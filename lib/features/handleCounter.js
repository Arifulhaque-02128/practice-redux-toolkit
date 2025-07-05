const { createSlice } = require("@reduxjs/toolkit");


const initialState = {
    count : 0
};

const CounterSlice = createSlice({
    name : "Counter",
    initialState,
    reducers : {
        countIncrement : (state, action) => {
            const newCount = state.count + 1;
            state.count = newCount;
        },
        countDecrement : (state, action) => {
            const newCount = state.count - 1;
            state.count = (newCount >= 0) ? newCount : state.count;
        }
    }
})


export const {countIncrement, countDecrement} = CounterSlice.actions;
export default CounterSlice.reducer;

