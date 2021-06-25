import {createSlice, SliceCaseReducers} from '@reduxjs/toolkit';

type State = {
  paymentMethods: any[];
};

const initialState: State = {
  paymentMethods: [],
};

const prefsSlice = createSlice<State, SliceCaseReducers<State>>({
  name: 'prefs',
  initialState,
  reducers: {
    addPaymentMethod(state, action) {
      const {phone, gateway} = action.payload;
      if (!state.paymentMethods.some(item => item.phone === phone && item.gateway === gateway)) {
        state.paymentMethods = [...state.paymentMethods, action.payload];
      }
    },
  },
});

export default prefsSlice;
