import React, {useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
import {moderateScale} from 'react-native-size-matters';

const Verification = () => {
  const {sessionToken, phone, email} = useSelector((s: RootState) => s.auth);
  const {params} = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [verificationCode, setVerificationCode] = useState('');
  const pinInput = useRef(null);
  const getProfile = useAsync(() => api.get(`/kash/profiles/current/`));
  const [counter, setCounter] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [resendCode, setResendCode] = useState(true);
  const [showVerifyToEmail, setShowVerifyToEmail] = useState(false);
  const [timerCount, setTimer] = useState(59);
  const [activator, setActivator] = useState(0);

  const verifyCode = useAsync(data =>
    api.post('/auth/verification/verify/', data).then(res => res.data),
  );
  const sendCode = useAsync(
    data => api.post('/auth/verification/link/', data).then(res => res.data),
    false,
  );

  const handleSubmit = async () => {
    verifyCode
      .execute({
        session_token: sessionToken,
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
  const sendCodeAgain = () => {
    setCounter(prevState => prevState + 1);
    sendCode
      .execute({
        type: params?.verification_type == 'phone_number' ? 'phone' : 'email',
        value: params?.verification_type == 'phone_number' ? phone : email,
      })
      .then(data => {
        dispatch(authSlice.actions.setSessionToken(data.session_token));
        console.log(data);
        setCounter(prevState => prevState + 1);
        setResendCode(false);
        setTimeout(() => {
          setResendCode(true);
          setTimer(59);
        }, 60000);
      })
      .catch(err => {
        if (err.response && err.response.status === 403) {
          Alert.alert(
            '',
            'Ce numéro de téléphone est déjà associé à un compte Kash. Réessaie avec un autre numéro.',
          );
        } else {
          toast.error(
            "Erreur lors de l'envoi du code de vérification",
            'Verifies ton numéro de téléphone puis réessaies.',
          );
        }
      });
  };

  useEffect(() => {
    let interval: number;
    if (!resendCode) {
      interval = setInterval(() => {
        if (timerCount > 0) {
          setTimer(lastTimerCount => {
            lastTimerCount <= 1 && clearInterval(interval);
            return lastTimerCount - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (!resendCode) {
        clearInterval(interval);
      }
    };
  }, [activator]);
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
            {counter <= 3 && (
              <TouchableOpacity
                disabled={!resendCode}
                style={{alignItems: 'center', padding: moderateScale(12)}}
                onPress={() => {
                  sendCodeAgain();
                  setActivator(Math.random);
                }}>
                <Text style={{color: resendCode ? Colors.brand : Colors.light}}>
                  Renvoyer
                  {!resendCode ? ' (' + minutes + ':' + timerCount + ')' : ''}
                </Text>
              </TouchableOpacity>
            )}

            <Button
              color={Colors.brand}
              onPress={handleSubmit}
              loading={verifyCode.loading}>
              Vérifier le code
            </Button>
            {counter > 3 && params?.verification_type == 'phone_number' && (
              <Button
                underline={true}
                onPress={() => navigation.navigate('AddEmail')}
                style={{marginTop: moderateScale(16)}}
                color={'white'}
                textColor={Colors.brand}>
                Ou ajoutez votre adresse mail
              </Button>
            )}
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
