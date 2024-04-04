import { createSlice } from '@reduxjs/toolkit';

// Define a type for the slice state
const initialState = {
    calabash: [],
    sticks: [],
    rivers: [],
    villages: [],
    loading: false,
    forestStick: [],
    userStick: [],
    watching: [],
    forestCalabash: [],
    userCalabash: []
};

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setDataSticks: (state, action) => {
            state.sticks = action.payload;
        },
        addStick: (state, action) => {
            state.sticks.unshift(action.payload);
        },
        setWatching: (state, action) => {
            state.watching = action.payload;
        },
        setForestStick: (state, action) => {
            state.forestStick = action.payload;
        },
        setForestCalabsh: (state, action) => {
            state.forestCalabash = action.payload;
        },
        setUserStick: (state, action) => {
            state.userStick = action.payload;
        },
        setUserCalabsh: (state, action) => {
            state.userCalabash = action.payload;
        },
        setDataCalabash: (state, action) => {
            state.calabash = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        addCalabsh: (state, action) => {
            state.calabash.unshift(action.payload);
        },
        addForestStick: (state, action) => {  
            state.forestStick.unshift(action.payload);
        },
        addForestLike: (state, action) => {
            state.forestStick[action.payload.index].likes++;
        },
        removeForestLike: (state, action) => {
            state.forestStick[action.payload.index].likes = action.payload.value;
        },
        addForestComment: (state, action) => {
            state.forestStick[action.payload.index].comments++;
        },
        removeForesComment: (state, action) => {
            state.forestStick[action.payload.index].comments = action.payload.value;
        },
        addUserStickLike: (state, action) => {
            state.userStick[action.payload.index].likes++;
        },
        removeUserStickLike: (state, action) => {
            state.userStick[action.payload.index].likes = action.payload.value;
        },
        addUserCalabashLike: (state, action) => {
            state.userCalabash[action.payload.index].likes++;
        },
        removeUserCalabashLike: (state, action) => {
            state.userCalabash[action.payload.index].likes = action.payload.value;
        },
    },
});

export const {
    addStick,
    setDataSticks,
    setDataCalabash,
    addCalabsh,
    setLoading,
    setWatching,
    setForestStick,
    setUserCalabsh,
    setUserStick,
    addForestLike,
    removeForestLike,
    addUserCalabashLike,
    addUserStickLike,
    removeUserCalabashLike,
    removeUserStickLike,
    addForestStick,
    addForestComment,
    removeForesComment
} = dataSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSticks = state => state.data.sticks;
export const selectCalabash = state => state.data.calabash;
export const selectRivers = state => state.data.rivers;
export const selectVillages = state => state.data.villages;
export const selectWatching = state => state.data.watching;
export const selectForestStick = state => state.data.forestStick;
export const selectUserStick = state => state.data.userStick;
export const selectForerstCalabash = state => state.data.forestCalabash;
export const selectUserCalabash = state => state.data.userCalabash;
export const selectLoading = state => state.data.loading;

export default dataSlice.reducer;
