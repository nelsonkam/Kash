import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';

type State = {
  paymentMethods: any[];
  env: 'beta' | 'prod'
};

const initialState: State = {
  paymentMethods: [],
  env: __DEV__ ? 'beta' : 'prod'
};

const prefsSlice = createSlice<State, SliceCaseReducers<State>>({
  name: 'prefs',
  initialState,
  reducers: {
    addPaymentMethod(state, action) {
      const { phone, gateway } = action.payload;
      if (!state.paymentMethods.some(item => item.phone === phone && item.gateway === gateway)) {
        state.paymentMethods = [...state.paymentMethods, action.payload];
      }
    },
    switchEnv(state, action) {
      state.env = action.payload
    }
  },
});

export default prefsSlice;
