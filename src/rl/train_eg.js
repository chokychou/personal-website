export function get_state_from_pos(metadata) {
    let divisor = 10;
    return `${Math.floor(metadata.x_pos/divisor)}_${Math.floor(metadata.y_pos/divisor)}`
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function action_sample(action) {
    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    };
    return action[getRandomInt(action.length)];
}

export default class QLearning {
    constructor(metadata, MaxEpisode = 10000) {
        this.metadata = metadata
        this.MaxEposide = MaxEpisode;
        this.reward = { 0: 1, 1: -1000 }; //idk, maybe useless
        // TODO: let's keep it simple for now, just jump and duck and nothing.
        this.action = [0, 1, 2];
        this.Q = {};
        this.state_cnt = new Map();
    }

    debug_log() {
        console.log(this.metadata);
    }

    next_round() {
        document.dispatchEvent(new TouchEvent("touchend", {
            cancelable: true,
            bubbles: true,
            shiftKey: false,
            ctrlKey: false,
            altKey: false,
            metaKey: false
        }));
    }

    step(action) {
        if (action === 1) {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Space',
                code: 'Space',
                keyCode: 32,
                which: 32,
                bubbles: true,
                cancelable: true
            }));
        }
        if (action === 2) {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowDown',
                code: 'ArrowDown',
                keyCode: 40,
                which: 40,
                bubbles: true,
                cancelable: true
            }));
        }
    }

    async train(dumpInterval = 100, evalInterval = 10, epsilon = 0.2, lr = 0.8, decay = 0.8) {
        let episodes = 0;
        let max_score = 0;
        let episode_at_maximum = 0;

        while (episodes < this.MaxEposide) {
            let state = get_state_from_pos(this.metadata);
            let traject_recorder = [];
            let prev_score = 0;
            while (this.metadata.done) {
                await sleep(1000)
                this.next_round()
            }

            if (episodes % evalInterval === 0) {
                this.debug_log();
                console.log("Q", this.Q)
                console.log("Episodes trained " + episodes + ".");
            }

            while (!this.metadata.done) {
                let epsilon_decay = Math.pow(0.99, (this.state_cnt[state] || 0));
                this.state_count_update(state);

                let action;
                if (Math.random() < epsilon * epsilon_decay) {
                    action = action_sample(this.action);
                } else {
                    const action_set = this.Q[state];
                    try {
                        action = action_set.indexOf(Math.max(...Object.values(action_set)));
                    } catch {
                        action = 0;
                    }
                }
                this.metadata.action = action;

                this.step(action);
                await sleep(200);

                let reward = 0;
                let next_state = get_state_from_pos(this.metadata);
                let score = this.metadata.score;

                if (action !== 0) {
                    reward += 1
                }

                if (this.metadata.x_pos == 0) {
                    reward += 2
                }

                if (prev_score < score) {
                    prev_score = score;
                    reward += 5;
                }

                if (max_score < score) {
                    max_score = score;
                    episode_at_maximum = episodes;
                }

                if (this.metadata.done) {
                    reward = -200;
                    traject_recorder.push([state, action, reward, next_state]);
                    traject_recorder.reverse();
                    this.Q_value_update(traject_recorder, lr, decay);
                    this.metadata.q_size = Object.keys(this.Q).length;
                    if (episodes % dumpInterval === 0) {
                        this.dump_Q_json(episodes);
                    }
                    break;
                }

                if (score > 10 ** 5) {
                    return;
                }

                traject_recorder.push([state, action, reward, next_state]);
                state = next_state;
            }
            episodes += 1;
        }

        console.log(Object.keys(this.Q).length);
        console.log('The maximum score is: ', max_score, 'at Itertaion: ', episode_at_maximum);
        return;
    }

    Q_value_update(traject_, lr, decay) {
        for (const transition_set of traject_) {
            const state = transition_set[0];
            const action = transition_set[1];
            const reward = transition_set[2];
            const next_state = transition_set[3];

            // Convert Q[state] to an array to allow modification
            let action_set = this.Q[state];
            let next_action_set = this.Q[next_state];
            // Update the Q-value for the given action
            if (action_set == undefined) {
                action_set = {
                    0:0,
                    1:0,
                    2:1
                }
            }
            if (next_action_set == undefined) {
                next_action_set = {
                    0:0,
                    1:0,
                    2:1
                }
            }
            try {
                let decrypt_action;
                if (isNaN(action_set[action])) {
                    decrypt_action = 0
                } else {
                    decrypt_action = action_set[action]
                }
                let decrypt_next_action;
                if (isNaN(Math.max(...Object.values(next_action_set)))) {
                    decrypt_next_action = 0
                } else {
                    decrypt_next_action = Math.max(...Object.values(next_action_set))
                }
                action_set[action] = (1 - lr) * decrypt_action + lr * (reward + decay * decrypt_next_action);
            } catch {
                if (action_set === undefined) {
                    continue;
                }
                action_set[action] = 0
            }
            this.Q[state] = action_set;
        }
    }

    state_count_update(state) {
        if (this.state_cnt[state] === undefined) {
            this.state_cnt[state] = 0
        }
        this.state_cnt[state] += 1;
    }

    dump_Q_json(episodes) {
        const data = JSON.stringify(this.Q, null, 2); // Convert object to JSON string
        const blob = new Blob([data], { type: 'application/json' }); // Create a Blob
        const url = URL.createObjectURL(blob); // Generate a URL for the Blob

        // Create a link element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = `Q${episodes}.json`; // Set the file name
        document.body.appendChild(a);
        a.click(); // Trigger the download
        document.body.removeChild(a); // Clean up
        URL.revokeObjectURL(url); // Release the Blob URL
    }
}
