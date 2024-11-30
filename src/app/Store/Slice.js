import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to add user and set authentication status
    AddUser(state, action) {
      const { id, name, role } = action.payload; // Extract name and role from action payload
      const userData = {
        id, // Generate unique ID for user
        name,
        role,
      };

      // Update the state
      state.user = userData;
      state.isAuthenticated = true;
    },

    // Action to logout the user
    Logout(state) {
      state.user = {};
      state.isAuthenticated = false;
    },

    // Action to update user details
    UpdateUser(state, action) {
      const { id, name, role } = action.payload;
      state.user.id = id;
      state.user.name = name;
      state.user.role = role;
    },
  },
});

// Export actions for dispatching
export const { AddUser, Logout, UpdateUser } = userSlice.actions;

// Export the reducer to be used in the store
export default userSlice.reducer;
