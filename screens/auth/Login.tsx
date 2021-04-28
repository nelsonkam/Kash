import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '../../utils/colors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {toUsername} from '../../utils';
import {useAsync} from '../../utils/hooks';
import api from '../../utils/api';
import toast from '../../utils/toast';
import authSlice from '../../slices/auth';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

function Login() {
  const navigation = useNavigation();
  const [kashtag, setKashtag] = useState('');
  const [password, setPassword] = useState('');
  const login = useAsync(data => api.post(`/kash/auth/login/`, data));
  const dispatch = useDispatch();
  const getProfile = useAsync(() => api.get(`/kash/profiles/current/`));

  const handleLogin = () => {
    login
      .execute({username: kashtag, password})
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
        toast.error('', 'Vérifie tes identifiants puis réessaie.');
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Connexion</Text>
        <View style={{marginTop: 8}}>
          <Input
            value={'$' + kashtag}
            onChangeText={text => setKashtag(toUsername(text))}
            label={'Ton $kashtag'}
          />
          <Input
            value={password}
            secureTextEntry={true}
            onChangeText={setPassword}
            label={'Mot de passe'}
          />
          <Button
            onPress={handleLogin}
            style={{marginTop: 16}}
            color={Colors.brand}
            loading={login.loading}>
            Suivant
          </Button>
          <Button
            onPress={() => navigation.navigate('RecoverPassword')}
            style={{marginTop: 16}}
            color={'white'}
            textColor={Colors.primary}
            loading={login.loading}>
            Mot de passe ou $kashtag oublié
          </Button>
        </View>
      </View>
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

export default Login;
