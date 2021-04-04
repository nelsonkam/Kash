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

  useEffect(() => {
    OneSignal.setAppId('514da48c-3c9c-4430-a4b7-de7f539dc552');
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    OneSignal.promptForPushNotificationsWithUserResponse(() => null);

    async function setDeviceID() {
      const deviceState = await OneSignal.getDeviceState();
      if (auth.profile) {
        await updateDeviceIds.execute({device_id: deviceState.userId});
      }
      dispatch(authSlice.actions.setDeviceId(deviceState.userId));
    }

    setDeviceID();
    setReady(true);
  }, []);

  if (!ready) {
    return <Splash />;
  }

  return auth.refresh && auth.profile ? <MainStack /> : <AuthStack />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <NotifierWrapper>
        <NavigationContainer theme={KashTheme}>
          <App />
        </NavigationContainer>
      </NotifierWrapper>
    </PersistGate>
  </Provider>
);
