function obs2state(obs, multiplier = 1000) {
    const x_pos = Math.floor(obs[0] * multiplier);
    const y_pos = Math.floor(obs[1] * multiplier);
    const y_vel = obs[2]; // Assuming y_vel is an integer

    const state_string = `${x_pos}_${y_pos}_${y_vel}`;

    return state_string;
}