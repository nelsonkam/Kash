import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';

import {Provider, useDispatch, useSelector} from 'react-redux';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import store, {persistor, RootState} from './utils/store';
import {PersistGate} from 'redux-persist/integration/react';
import AuthStack from './navigation/auth';
import {NotifierWrapper} from 'react-native-notifier';
import MainStack from './navigation/main';
import OneSignal from 'react-native-onesignal';
import authSlice from './slices/auth';
import Splash from './screens/Splash';
import {useAsync} from './utils/hooks';
import api from './utils/api';
import Colors from './utils/colors';
import * as Sentry from '@sentry/react-native';

import codePush from 'react-native-code-push';
import {requestTrackingPermission} from 'react-native-tracking-transparency';
import SetupWallet from './screens/auth/SetupWallet';
import {useAsyncStorage} from '@react-native-community/async-storage';
import SetupPin from './screens/auth/SetupPin';

if (!__DEV__) {
  Sentry.init({
    dsn:
      'https://7d9127654ac6459f8f60a0c28f285590@o441760.ingest.sentry.io/5709350',
  });
}
const KashTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.brand,
  },
};

function App() {
  const auth = useSelector((s: RootState) => s.auth);
  const [ready, setReady] = useState(false);
  const updateDeviceIds = useAsync(data =>
    api.post(`/kash/profiles/current/device_ids/`, data),
  );
  const dispatch = useDispatch();
  const pincode = useAsyncStorage('pincode');

  useEffect(() => {
    OneSignal.setAppId('514da48c-3c9c-4430-a4b7-de7f539dc552');
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    requestTrackingPermission().then(res => {
      OneSignal.promptForPushNotificationsWithUserResponse(() => null);
    });

    setReady(true);
  }, []);

  useEffect(() => {
    async function setDeviceID() {
      const deviceState = await OneSignal.getDeviceState();
      if (auth.profile) {
        await updateDeviceIds.execute({device_id: deviceState.userId});
      }
      dispatch(authSlice.actions.setDeviceId(deviceState.userId));
    }

    setDeviceID();
  }, [auth.profile]);

  if (!ready) {
    return <Splash />;
  }
  if (!auth.refresh || !auth.profile || !auth.profile?.payout_methods) {
    return <AuthStack />;
  }

  if (auth.profile && !auth.profile?.wallet) {
    return <SetupWallet />;
  }

  if (!auth.pincode) {
    return <SetupPin />;
  }

  return <MainStack />;
}

export default codePush(() => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <NotifierWrapper>
        <NavigationContainer theme={KashTheme}>
          <App />
        </NavigationContainer>
      </NotifierWrapper>
    </PersistGate>
  </Provider>
));
