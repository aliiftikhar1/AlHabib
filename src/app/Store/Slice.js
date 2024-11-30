
import { createSlice, nanoid } from '@reduxjs/toolkit';

// Retrieve initial state from localStorage (if available)
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || {}, // Retrieve user data from localStorage
  isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')) || false, // Check if authenticated
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to add user and set authentication status
    AddUser(state, action) {
      const { id,name, role } = action.payload; // Extract name and role from action payload
      const userData = {
        id, // Generate unique ID for user
        name,
        role,
      };

      // Update the state
      state.user = userData;
      state.isAuthenticated = true;

      // Save user data and authentication status to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', JSON.stringify(true));
    },

    // Action to logout the user
    Logout(state) {
      state.user = {};
      state.isAuthenticated = false;

      // Clear user data and authentication status from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    },

    // Action to update user details (optional)
    UpdateUser(state, action) {
      const { id,name, role } = action.payload;
      state.user.id = id;
      state.user.name = name;
      state.user.role = role;

      // Update user data in localStorage
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
});

// Export actions for dispatching
export const { AddUser, Logout, UpdateUser } = userSlice.actions;

// Export the reducer to be used in the store
export default userSlice.reducer;
