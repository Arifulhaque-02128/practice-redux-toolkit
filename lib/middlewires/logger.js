const logger = store => next => action => {
    const currentState = store.getState();
    console.log("Current State => ", currentState);
    console.log("Action => ", action);

    const result = next(action);

    console.log("Updated State => ", store.getState());

    return result;
};

export default logger;