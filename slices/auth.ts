import {createSlice, SliceCaseReducers} from '@reduxjs/toolkit';
import {ShopResponse, UserResponse} from '../types/auth';

type State = {
  profile: any | null;
  access: string | null;
  refresh: string | null;
  sessionToken: string | null;
  phone: string | null;
  affiliateCode: string | null;
  user: UserResponse | null;
  setupComplete: boolean;
  deviceId: string | null;
  pincode: string | null;
};

const initialState: State = {
  profile: null,
  user: null,
  access: null,
  refresh: null,
  sessionToken: null,
  phone: null,
  affiliateCode: null,
  setupComplete: false,
  deviceId: null,
  pincode: null,
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
    setUser(state, action) {
      state.user = action.payload;
    },
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setSessionToken(state, action) {
      state.sessionToken = action.payload;
    },
    setPhone(state, action) {
      state.phone = action.payload;
    },
    setAffiliateCode(state, action) {
      state.affiliateCode = action.payload;
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
