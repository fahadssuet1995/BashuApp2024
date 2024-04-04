
import { createSlice } from '@reduxjs/toolkit';


// Define a type for the slice state
const initialState = {
    data: {
        username: '',
        uid: '',
        fullname: '',
        profile: '',
        sticks: 0,
        watching: 0,
        watchers: 0,
        villages: 0,
        notifications: 0,
        pushToken: ''
    }
};

// Create a slice
export const userSlice = createSlice({
    name: 'userdata',
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setData: (state, action) => {
            state.data = action.payload;
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        setSticks: (state, action) => {
            state.data.sticks = action.payload;
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        setWatching: (state, action) => {
            state.data.watching = action.payload;
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        setVillage: (state, action) => {
            state.data.villages = action.payload;
        },
        setWatchers: (state, action) => {
            state.data.watchers = action.payload;
        },
        setFullname: (state, action) => {
            state.data.fullname = action.payload;
        },
        setUsername: (state, action) => {
            state.data.username = action.payload;
        },
        setPushtoken: (state, action) => {
            state.data.pushToken = action.payload;
        },
        setProfile: (state, action) => {
            state.data.profile = action.payload;
        },
        setNotify: (state, action) => {
            state.data.notifications = action.payload;
        },
    },
});

// Export the slice actions
export const {
    setData,
    setSticks,
    setWatching,
    setVillage,
    setWatchers,
    setPushtoken,
    setFullname,
    setUsername,
    setProfile,
    setNotify
} = userSlice.actions;

// Define selector function
export const selectUser = (state) => state.userdata.data;

// Export the slice reducer
export default userSlice.reducer;
