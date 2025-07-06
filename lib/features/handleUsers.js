const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const initialState = {
    users : [],
    isLoading : false,
    error : null,
};

export const apiUsers = createAsyncThunk("apiusers", async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    return response.json();
});

const userSlice = createSlice({

    name : "Api User",
    initialState,
    extraReducers : (builder) => {

        builder.addCase(apiUsers.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });

        builder.addCase(apiUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.users = action.payload;
        });

        builder.addCase(apiUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        })

    }

});

export default userSlice.reducer;