import React, {useState} from 'react';
import {View, Text} from 'react-native';
import Input from '../../components/Input';
import Colors from '../../utils/colors';
import Button from '../../components/Button';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAsync} from '../../utils/hooks';
import axios from 'axios';
import {BASE_URL} from '../../utils/api';
import {useSelector} from 'react-redux';
import {RootState} from '../../utils/store';

function ConfirmPassword() {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const {kashtag} = useSelector((state: RootState) => state.auth.profile);
  const {params} = useRoute();
  // @ts-ignore
  const {nextScreen, nextScreenParams} = params;
  const login = useAsync(data =>
    axios.post(`/kash/auth/login/`, data, {
      baseURL: BASE_URL,
    }),
  );

  const handleLogin = () => {
    login.execute({username: kashtag, password}).then(() => {
      navigation.navigate(nextScreen, nextScreenParams);
    });
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 16}}>
      <Text
        style={{fontFamily: 'Inter-Bold', color: Colors.dark, fontSize: 16}}>
        Saisis ton mot de passe pour continuer
      </Text>
      <View style={{marginVertical: 16}}>
        <Input
          value={password}
          onChangeText={setPassword}
          label={'Mot de passe'}
          secureTextEntry={true}
          error={login.error ? 'Mot de passe incorrecte.' : undefined}
        />
      </View>
      <Button loading={login.loading} onPress={handleLogin}>
        Continuer
      </Button>
    </View>
  );
}

export default ConfirmPassword;
