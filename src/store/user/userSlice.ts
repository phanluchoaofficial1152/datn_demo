import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isLoggedIn: boolean;
  userImage: string | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  userImage: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.isLoggedIn = true;
      state.userImage = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userImage = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
