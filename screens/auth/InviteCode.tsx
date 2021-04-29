import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import Colors from '../../utils/colors';
import Input from '../../components/Input';
import {toUsername} from '../../utils';
import Button from '../../components/Button';
import {useAsync} from '../../utils/hooks';
import api from '../../utils/api';
import authSlice from '../../slices/auth';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import toast from '../../utils/toast';
import {AuthHeaderBar} from '../../components/HeaderBar';

const formatInviteCode = (code: string) => {
  return code.toUpperCase().substring(0, 4);
};

function InviteCode() {
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const verifyCode = useAsync(code =>
    api.post(`/kash/invites/verify/`, {code}),
  );
  const getProfile = useAsync(() => api.get(`/kash/profiles/current/`));
  const dispatch = useDispatch();

  const errorMessage = {
    invalid: 'Ce code est invalide',
    used: 'Ce code a déjà été utilisé.',
  };

  const handleNext = () => {
    verifyCode
      .execute(code)
      .then(res => {
        return getProfile.execute();
      })
      .then(res => {
        dispatch(authSlice.actions.setProfile(res.data));
        if (res.data.payout_methods?.length !== 0) {
          navigation.navigate('SetupPaymentMethod');
        }
      })
      .catch(err => {
        if (err.response && err.response.status === 400) {
          // @ts-ignore
          setError(errorMessage[err.response.data.code]);
        } else {
          toast.error(
            'Erreur lors de la vérification',
            "Vérifies le code d'invitation puis réessaies.",
          );
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <StatusBar barStyle="default" />
        <AuthHeaderBar title={"Code d'invitation"} />
        <View style={{padding: 18}}>
          <Text style={styles.subtitle}>
            Saisis le code d'invitation que l'un de tes potes t'as envoyé pour
            utiliser Kash.
          </Text>
          <View style={{marginTop: 16}}>
            <Input
              value={code}
              onChangeText={text => setCode(formatInviteCode(text))}
              label={"Code d'invitation"}
              error={error}
            />
            <Button
              style={{marginTop: 16}}
              color={Colors.brand}
              disabled={!(code && code.length >= 4)}
              loading={verifyCode.loading}
              onPress={handleNext}>
              Suivant
            </Button>
            <Button
              onPress={() => navigation.navigate('SetupPaymentMethod')}
              color={'white'}
              textColor={Colors.primary}
              style={{
                marginTop: 24,
              }}>
              Je n'ai pas de code d'invitation
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

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
    marginBottom: 10,
    marginTop: 4,
  },
  subtitle: {
    color: Colors.medium,
    fontSize: 16,
    marginTop: 4,
  },
});

export default InviteCode;
