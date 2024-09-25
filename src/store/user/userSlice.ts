import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

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
      Cookies.remove("access_token");
    },
    updateUserImage(state, action: PayloadAction<string | null>) {
      state.userImage = action.payload;
    },
  },
});

export const { login, logout, updateUserImage } = userSlice.actions;
export default userSlice.reducer;
