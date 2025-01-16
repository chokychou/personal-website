export default class QLearning {
    constructor(MaxEpisode = 10000) {
        this.MaxEposide = MaxEpisode;
        this.reward = { 0: 1, 1: -1000 }; //idk, maybe useless
        this.action = [0, 1];
        this.Q = new Map();
        this.state_cnt = new Map();
        this.env = null;
    }

    train(dumpInterval = 100, evalInterval = 1000, epsilon = 0.2, lr = 0.8, decay = 0.8) {
        let max_score = 0;
        let interval_score_sum = [0, 1];
        let total_score = 0;
        let episodes = 0;

        while (episodes < this.MaxEposide) {
            let obs = this.env.reset();
            let state = obs2state(obs);
            let traject_recorder = [];
            let prev_score = 0;

            if (episodes % evalInterval === 0) {
                interval_score_sum.push(total_score);
                total_score = 0;
                console.log("Episodes trained " + episodes + ". Current average score:" + Math.floor(interval_score_sum[interval_score_sum.length - 1] / evalInterval));
            }

            while (true) {
                let epsilon_decay = Math.pow(0.99, (this.state_cnt[state] || 0));
                this.state_count_update(state);

                let action;
                if (Math.random() < epsilon * epsilon_decay) {
                    action = this.env.action_space.sample();
                } else {
                    this.Q[state] = this.Q[state] || {};
                    const stateValues = this.Q[state];
                    action = Object.keys(stateValues).length > 0 ? Object.keys(stateValues).reduce((a, b) => stateValues[a] > stateValues[b] ? a : b) : this.env.action_space.sample();
                }

                let next_obs, reward, done, info;
                try {
                    ({ next_obs, reward, done, info } = this.env.step(action));
                } catch (error) {
                    console.error("Error in env.step:", error);
                    console.log("Current State", state)
                    console.log("Action", action)
                    return;
                }

                let next_state = obs2state(next_obs);
                let score = info['score'];

                reward = 0;
                if (prev_score < score) {
                    prev_score = score;
                    reward = 10;
                    total_score += 1;
                }

                if (max_score < score) {
                    max_score = score;
                    episode_at_maximum = episodes;
                }

                if (done) {
                    let hit_dist = parseInt(next_state.split('_')[1]);
                    if (hit_dist > 120) {
                        reward = -10 * hit_dist;
                        if (traject_recorder.length < 3) {
                            reward += -1000;
                        }
                    } else {
                        reward = -500;
                    }
                    traject_recorder.push([state, action, reward, next_state]);
                    traject_recorder.reverse();
                    this.Q_value_update(traject_recorder, lr, decay);
                    if (episodes % dumpInterval === 0) {
                        QLearning.dump_Q_json(this);
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
        this.env.close();
        return;
    }

    Q_value_update(traject_, lr, decay) {
        for (const transition_set of traject_) {
            const [state, action, reward, next_state] = transition_set;
            let action_set = [...this.Q[state]]; // Create a copy of the action set

            action_set[action] = (1 - lr) * this.Q[state][action] + lr * (reward + decay * Math.max(...this.Q[next_state]));

            this.Q[state] = action_set;
        }
    }

    state_count_update(state) {
        this.state_cnt[state] += 1;
    }

    dump_Q_json() {
        const fs = require('fs');
        const path = require('path');

        const filePath = path.join(__dirname, '..', 'records', 'Q.json');
        fs.writeFileSync(filePath, JSON.stringify(this.Q));
    }
}


