import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import Colors from '../utils/colors';
import axios from 'axios';
import Button from '../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import authSlice from '../slices/auth';
import api, {BASE_URL} from '../utils/api';
import {useAsync} from '../utils/hooks';
import {useNavigation} from '@react-navigation/native';
import toast from '../utils/toast';
import {SafeAreaView} from 'react-native-safe-area-context';
import PhoneInput from '../components/PhoneInput';
import {RootState} from '../utils/store';

const Login = () => {
  const dispatch = useDispatch();
  const auth = useSelector((s: RootState) => s.auth);
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');

  const sendCode = useAsync(
    data =>
      api.post('/kash/profiles/current/otp/phone/', data).then(res => res.data),
    false,
  );

  const handleSubmit = async () => {
    sendCode
      .execute({
        phone_number: phone,
      })
      .then(data => {
        dispatch(authSlice.actions.setSessionToken(data.session_token));
        dispatch(authSlice.actions.setPhone(phone));
        navigation.navigate('Verification');
      })
      .catch(err => {
        toast.error(
          "Erreur lors de l'envoi du code de vérification",
          'Verifies ton numéro de téléphone puis réessaies.',
        );
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />
      <View>
        <Text style={styles.title}>Ajoutes un numéro de téléphone</Text>
        <Text style={styles.subtitle}>
          Ajouter ton numéro de téléphone te permettra de changer ton mot de
          passe en cas d'oubli.
        </Text>
        <View style={{marginTop: 20}}>
          <PhoneInput
            onChange={text => {
              setPhone(text);
            }}
          />
          <Button
            style={{marginTop: 8}}
            color={Colors.brand}
            onPress={handleSubmit}
            loading={sendCode.loading}>
            Vérifier mon numéro
          </Button>
        </View>
        <Text style={{fontSize: 14, color: Colors.disabled, marginTop: 16}}>
          Kash est uniquement disponible au Bénin🇧🇯 pour le moment.
        </Text>
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
  },
  subtitle: {
    color: Colors.medium,
    fontSize: 16,
    marginTop: 4,
  },
  input: {
    borderRadius: 4,
    borderColor: Colors.border,
    borderWidth: 2,
    padding: 4,
  },
});

export default Login;
