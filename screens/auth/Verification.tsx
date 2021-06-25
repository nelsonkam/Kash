import React, {useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '../../utils/colors';
import Button from '../../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import api from '../../utils/api';
import {useAsync} from '../../utils/hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import toast from '../../utils/toast';
import {RootState} from '../../utils/store';
// @ts-ignore
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthHeaderBar} from '../../components/HeaderBar';
import authSlice from '../../slices/auth';

const Verification = () => {
  const {sessionToken, phone} = useSelector((s: RootState) => s.auth);
  const {params} = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [verificationCode, setVerificationCode] = useState('');
  const pinInput = useRef(null);
  const getProfile = useAsync(() => api.get(`/kash/profiles/current/`));

  const verifyCode = useAsync(data =>
    api
      .post('/kash/profiles/current/otp/verify/phone/', data)
      .then(res => res.data),
  );

  const handleSubmit = async () => {
    verifyCode
      .execute({
        session_token: sessionToken,
        phone_number: phone,
        security_code: verificationCode,
      })
      .then(res => {
        // @ts-ignore
        if (params.stack && params.stack === 'profile') {
          navigation.navigate('Profile');
        }
        return getProfile.execute();
      })
      .then(res => {
        dispatch(authSlice.actions.setProfile(res.data));
      })
      .catch(err => {
        toast.error(
          'Erreur lors de la vérification',
          'Vérifies le code de vérification puis réessaies.',
        );
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <AuthHeaderBar title={'Vérification'} />
        <View style={{padding: 18}}>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
