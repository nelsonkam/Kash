import React, {useRef, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Colors from '../utils/colors';
import axios from 'axios';
import Button from '../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import authSlice from '../slices/auth';
import api, {BASE_URL} from '../utils/api';
import {useAsync} from '../utils/hooks';
import {useNavigation} from '@react-navigation/native';
import toast from '../utils/toast';
import {RootState} from '../utils/store';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {SafeAreaView} from 'react-native-safe-area-context';
import {identify} from '../utils/track';

const Verification = () => {
  const {sessionToken, phone} = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [verificationCode, setVerificationCode] = useState('');
  const pinInput = useRef(null);

  const verifyCode = useAsync(data =>
    axios
      .post('/phone/verify/', data, {baseURL: BASE_URL})
      .then(res => res.data),
  );

  const getProfile = useAsync(() => api.get(`/kash/profiles/current/`));

  if (!sessionToken || !phone) {
    navigation.navigate('Login');
  }

  const handleSubmit = async () => {
    verifyCode
      .execute({
        session_token: sessionToken,
        phone_number: phone,
        security_code: verificationCode,
      })
      .then(async data => {
        dispatch(
          authSlice.actions.setTokens({
            access: data.access,
            refresh: data.refresh,
          }),
        );
        return getProfile.execute();
      })
      .then(res => {
        dispatch(authSlice.actions.setProfile(res.data));
        identify(res.data.kashtag);
        if (!res.data.invite) {
          navigation.navigate('InviteCode');
          return;
        }
        if (res.data.payout_methods?.length !== 0) {
          navigation.navigate('SetupPaymentMethod');
          return;
        }
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          navigation.navigate('SetupProfile');
        } else {
          toast.error(
            'Erreur lors de la vérification',
            'Vérifies le code de vérification puis réessaies.',
          );
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Vérification</Text>
        <Text style={styles.subtitle}>
          Saisis le code que tu as reçu par SMS.
        </Text>
        <View style={{width: '100%'}}>
          <View
            style={{
              marginVertical: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
            <SmoothPinCodeInput
              ref={pinInput}
              codeLength={6}
              value={verificationCode}
              onTextChange={(code: string) => setVerificationCode(code)}
              cellSpacing={8}
              restrictToNumbers
              containerStyle={{padding: 0}}
              cellStyle={{
                borderRadius: 4,
                borderColor: 'gray',
                borderWidth: 1,
                height: 36,
                width: 36,
              }}
              cellStyleFocused={{
                borderColor: Colors.brand,
                borderWidth: 2,
                borderRadius: 4,
              }}
              textStyle={{
                fontFamily: 'Inter-Regular',
                fontSize: 18,
                color: 'black',
              }}
            />
          </View>

          <Button
            color={Colors.brand}
            onPress={handleSubmit}
            loading={verifyCode.loading}>
            Vérifier le code
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingVertical: 24,
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Inter-Black',
    fontSize: 28,
    color: Colors.dark,
    marginBottom: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.medium,
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  input: {
    borderRadius: 4,
    borderColor: Colors.border,
    borderWidth: 2,
    padding: 4,
  },
});

export default Verification;
