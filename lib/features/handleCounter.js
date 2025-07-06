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
        },

        setCount : (state, action) => {
            state.count = parseInt(action.payload);
        }
    }
})


export const {countIncrement, countDecrement, setCount} = CounterSlice.actions;
export default CounterSlice.reducer;

