import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import Colors from '../../utils/colors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {toUsername} from '../../utils';
import {useAsync} from '../../utils/hooks';
import api from '../../utils/api';
import {useDispatch} from 'react-redux';
import authSlice from '../../slices/auth';
import toast from '../../utils/toast';
import {identify} from '../../utils/track';
import {useNavigation} from '@react-navigation/native';
import {AuthHeaderBar} from '../../components/HeaderBar';

function Signup() {
  const [form, setForm] = useState({
    name: '',
    password: '',
    confirm: '',
  });
  const [kashtag, setKashTag] = useState<string>('');
  const [showKashtagSection, setShowKashtagSection] = useState(false);
  const createProfile = useAsync(data =>
    api.post(`/kash/auth/register/`, data),
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<any>({});
  const getProfile = useAsync(() => api.get(`/kash/profiles/current/`));

  const getKashtagError = () => {
    if (kashtag) {
      if (kashtag.length < 3) {
        return 'Ton $kashtag doit avoir au moins 3 caractères.';
      } else if (kashtag.length > 20) {
        return 'Ton $kashtag doit avoir au plus 20 caractères.';
      }
    }
    return error;
  };

  const getErrors = () => {
    const errors: any = {};
    if (!form.name) {
      errors.name = 'Ce champs est requis';
    }

    if (!form.password || form.password.length < 8) {
      errors.password = 'Ton mot de passe doit contenir au moins 8 caractères.';
    }

    if (form.password !== form.confirm) {
      errors.confirm = 'Les mots de passe ne correspondent pas.';
    }
    return errors;
  };

  const handleAccountNext = () => {
    const errors = getErrors();
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      setShowKashtagSection(true);
    }
  };

  const handleNext = () => {
    createProfile
      .execute({...form, kashtag})
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
        identify(res.data.kashtag);
        navigation.navigate('AddPhone');
      })
      .catch(err => {
        if (err.response && err.response.status === 400) {
          setError('Oops! Ce $kashtag est déjà pris.');
        } else {
          toast.error(
            'Une erreur est survenue',
            'Vérifies ta connexion internet puis réessaies.',
          );
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {showKashtagSection ? (
        <View>
          <AuthHeaderBar title={'Choisis ton $kashtag'} />
          <View style={{padding: 18}}>
            <Text style={styles.subtitle}>
              Ton $kashtag est ton nom d'utilisateur sur Kash, tes potes s'en
              serviront pour t'envoyer du cash.
            </Text>
            <View style={{marginTop: 16}}>
              <Input
                value={'$' + kashtag}
                description={
                  'Ton kashtag ne peut contenir que des lettres miniscules, des chiffres et/ou un tiret de huit ( _ )'
                }
                onChangeText={text => setKashTag(toUsername(text))}
                error={getKashtagError()}
                label={'Ton $kashtag'}
              />
            </View>
            <Button
              style={{marginTop: 16}}
              color={Colors.brand}
              disabled={!kashtag || !!getKashtagError()}
              loading={createProfile.loading}
              onPress={handleNext}>
              Suivant
            </Button>
            <Text style={{fontSize: 12, color: Colors.disabled, marginTop: 16}}>
              En cliquant "Suivant", tu acceptes notre Politique de
              Confidentialité et nos Conditions Générales d'Utilisation que tu
              peux retrouver sur notre site web.
            </Text>
          </View>
        </View>
      ) : (
        <View>
          <StatusBar barStyle="default" />
          <AuthHeaderBar title={'Crée ton compte'} />
          <View
            style={{
              padding: 18,
            }}>
            <Text style={styles.subtitle}>
              Saisis les informations suivantes afin de créer ton compte.
            </Text>
            <View style={{marginTop: 16}}>
              <Input
                value={form.name}
                onChangeText={text => setForm({...form, name: text})}
                label={'Nom et prénom'}
                error={errors.name}
              />
              <Input
                value={form.password}
                secureTextEntry={true}
                onChangeText={text => setForm({...form, password: text})}
                label={'Mot de passe'}
                error={errors.password}
              />
              <Input
                value={form.confirm}
                secureTextEntry={true}
                onChangeText={text => setForm({...form, confirm: text})}
                label={'Confirmes ton mot de passe'}
                error={errors.confirm}
              />
              <Button
                onPress={handleAccountNext}
                style={{marginTop: 16}}
                color={Colors.brand}>
                Suivant
              </Button>
            </View>
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

export default Signup;
