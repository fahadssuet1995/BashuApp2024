import { createSlice } from '@reduxjs/toolkit';

// Define a type for the slice state
const initialState = {
    data: [] // Assuming it's an array of notifications
};

// Create a slice
export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        // Define reducers here if needed
        addNofity: (state, action) => {
            state.data = action.payload;
        }
    }
});

// Export the slice actions
export const { addNofity } = notificationSlice.actions;

// Define selector function
export const selectNotification = (state) => state.notification.data;

// Export the slice reducer
export default notificationSlice.reducer;
