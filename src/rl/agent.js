import QLearning, { get_state_from_pos, sleep } from "./train_eg";

export class Agent {

    constructor() {
        let metadata = {
            x_pos: 0,
            y_pos: 0,
            score: 0,
            done: false,
            current_action: 0,
            q_size: 0
        };
        this.metadata = metadata;
        this._handleKeydown = this._handleKeydown.bind(this);
        window.addEventListener('keydown', (event) => {
            if (event.code === 'Space' || event.code === 'ArrowUp') {
                this._handleKeydown(); // Call your original handler if it's the spacebar
            }
        });
        // For training
        // this.trainer()
        // For demo
        this.timerId = setTimeout(this.autoPlay.bind(this), 10000);
    }

    _handleKeydown() {
        this.userStart();
        clearTimeout(this.timerId); // Clear the existing timer
    }

    userStart() {
        // TODO
        // console.log("User mode.")
    }

    async autoPlay() {
        let q_learning = new QLearning(this.metadata);
        const Q = require('./record.json')
        q_learning.step(1); // start the game
        while (!this.metadata.done) {
            let state = get_state_from_pos(this.metadata);
            let action_set;
            try {
                action_set = [Q[state]["0"],Q[state]["1"],Q[state]["2"]]
            } catch {
                action_set = [0,1,0]
            }
            let action = action_set.indexOf(Math.max(...Object.values(action_set)));
            q_learning.step(action);
            await sleep(30);
        }
    }

    stop() {
    }

    trainer() {
        console.log("logger: start training")
        let q_learning = new QLearning(this.metadata);
        q_learning.train()
    }
}