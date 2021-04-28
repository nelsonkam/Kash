import React, {useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Alert, StyleSheet, Text, View} from 'react-native';
import Colors from '../../utils/colors';
import PhoneInput from '../../components/PhoneInput';
import Button from '../../components/Button';
import api from '../../utils/api';
import {useAsync} from '../../utils/hooks';
import toast from '../../utils/toast';
import {useNavigation} from '@react-navigation/native';
// @ts-ignore
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Input from '../../components/Input';
import authSlice from '../../slices/auth';
import {useDispatch} from 'react-redux';

function RecoverPassword() {
  const [phone, setPhone] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const sendCode = useAsync(data => api.post(`/kash/auth/recover/`, data));
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [resetForm, setResetForm] = useState({
    security_code: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState<any>({});
  const resetPassword = useAsync(data =>
    api.post('/kash/auth/recover/password/', data),
  );
  const getProfile = useAsync(() => api.get(`/kash/profiles/current/`));

  const getErrors = () => {
    const errors: any = {};
    if (!resetForm.security_code) {
      errors.security_code = 'Ce champs est requis';
    }

    if (!resetForm.password || resetForm.password.length < 8) {
      errors.password = 'Ton mot de passe doit contenir au moins 8 caractères.';
    }

    if (resetForm.password !== resetForm.confirm) {
      errors.confirm = 'Les mots de passe ne correspondent pas.';
    }
    return errors;
  };

  const handleSubmit = async () => {
    const errors = getErrors();
    setErrors(errors);
    if (Object.keys(errors).length > 0) return;
    resetPassword
      .execute({
        session_token: sessionToken,
        phone_number: phone,
        security_code: resetForm.security_code,
        password: resetForm.password,
        confirm: resetForm.confirm,
      })
      .then(({data}) => {
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
      })
      .catch(err => {
        console.log(err);
        toast.error(
          'Erreur lors du changement de ton mot de passe',
          'Vérifies les informations que tu as saisi puis réessaye.',
        );
      });
  };
  const handleSendCode = () => {
    sendCode
      .execute({phone_number: phone})
      .then(res => {
        setSessionToken(res.data.session_token);
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          Alert.alert(
            'Échec lors de la récupération',
            "Nous n'avons pas pu retrouver un compte Kash associé à ce numéro de téléphone.",
            [
              {
                style: 'default',
                text: 'Créer un compte',
                onPress: () => navigation.navigate('Signup'),
              },
              {
                style: 'destructive',
                text: 'Annuler',
                onPress: () => null,
              },
            ],
          );
        } else {
          toast.error(
            "Erreur lors de l'envoi du code de vérification",
            'Verifies ton numéro de téléphone puis réessaies.',
          );
        }
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      {!sessionToken && (
        <View>
          <Text style={styles.title}>Récupères ton compte</Text>
          <Text style={styles.subtitle}>
            Saisis le numéro de téléphone associé à ton compte afin de pouvoir
            le récupérer.
          </Text>
          <View>
            <PhoneInput
              onChange={text => {
                setPhone(text);
              }}
            />
            <Button
              style={{marginTop: 8}}
              color={Colors.brand}
              onPress={handleSendCode}
              loading={sendCode.loading}>
              Récupérer mon compte
            </Button>
          </View>
        </View>
      )}
      {!!sessionToken && (
        <View>
          <Text style={styles.title}>Changes ton mot de passe</Text>

          <View style={{width: '100%'}}>
            <Input
              value={resetForm.security_code}
              onChangeText={text =>
                setResetForm({...resetForm, security_code: text})
              }
              label={'Code reçu par SMS'}
              textContentType={'oneTimeCode'}
              error={errors.security_code}
            />
            <Input
              value={resetForm.password}
              secureTextEntry={true}
              onChangeText={text =>
                setResetForm({...resetForm, password: text})
              }
              label={'Nouveau mot de passe'}
              error={errors.password}
            />
            <Input
              value={resetForm.confirm}
              secureTextEntry={true}
              onChangeText={text => setResetForm({...resetForm, confirm: text})}
              label={'Confirmes ton mot de passe'}
              error={errors.confirm}
            />

            <Button
              style={{marginTop: 8}}
              color={Colors.brand}
              onPress={handleSubmit}
              loading={resetPassword.loading}>
              Changer mon mot de passe
            </Button>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

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
    marginBottom: 10,
    marginTop: 4,
  },
  subtitle: {
    color: Colors.medium,
    fontSize: 16,
    marginTop: 4,
    lineHeight: 22,
  },
});

export default RecoverPassword;
