import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  loggedUser: undefined,
};

const authSlice = createSlice({
  name: 'authState',
  initialState,
  reducers: {
    changeIsAuthenticated(state) {
      state.isAuthenticated = !state.isAuthenticated;
    },
    setLoggedUser(state, action) {
      state.loggedUser = action.payload;
    },
    setPartners(state, action) {
      if (state.loggedUser) state.loggedUser.Partners = action.payload;
    },
  },
});

export const { changeIsAuthenticated, setLoggedUser } = authSlice.actions;
export default authSlice.reducer;
