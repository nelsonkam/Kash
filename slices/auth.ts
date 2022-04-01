import {createSlice, SliceCaseReducers} from '@reduxjs/toolkit';
import {ShopResponse, UserResponse} from '../types/auth';

type State = {
  profile: any | null;
  access: string | null;
  refresh: string | null;
  phone: string | null;
  email: string | null;
  deviceId: string | null;
  sessionToken: string | null;
  pincode: string | null;
  skipPhone: boolean | null;
};

const initialState: State = {
  profile: null,
  access: null,
  refresh: null,
  phone: null,
  deviceId: null,
  sessionToken: null,
  pincode: null,
  skipPhone: null,
  email: null,
};

const authSlice = createSlice<State, SliceCaseReducers<State>>({
  name: 'auth',
  initialState,
  reducers: {
    setTokens(state, action) {
      const {access, refresh} = action.payload;
      state.access = access;
      state.refresh = refresh;
    },
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setSkipPhone(state, action) {
      state.skipPhone = action.payload;
    },
    setPhone(state, action) {
      state.phone = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setSessionToken(state, action) {
      state.sessionToken = action.payload;
    },
    setDeviceId(state, action) {
      state.deviceId = action.payload;
    },
    setPincode(state, action) {
      state.pincode = action.payload;
    },
    logout(state) {
      return initialState;
    },
  },
});

export default authSlice;
