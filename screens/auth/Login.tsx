import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Colors from '../../utils/colors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {toUsername} from '../../utils';
import {useAsync} from '../../utils/hooks';
import api, {BASE_URL} from '../../utils/api';
import toast from '../../utils/toast';
import authSlice from '../../slices/auth';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {AuthHeaderBar} from '../../components/HeaderBar';
import {RootState} from '../../utils/store';
import {
  validateLoginWithEmailOrKashtag,
  validateLoginWithPhone,
} from '../../utils/validationSchemas';
import {Formik} from 'formik';
import PhoneInput from '../../components/PhoneInput';
import {moderateScale} from 'react-native-size-matters';
import {RFValue} from 'react-native-responsive-fontsize';

function Login() {
  const navigation = useNavigation();
  const currentEnv = useSelector((s: RootState) => s.prefs.env);
  const [kashtag, setKashtag] = useState('');
  const [loginWithPhone, setLoginWithPhone] = useState(true);
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
        if (!res.data.phone_number) {
          navigation.navigate('AddPhone');
        }
      })
      .catch(err => {
        toast.error('', 'Vérifie tes identifiants puis réessaie.');
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <AuthHeaderBar title={'Connexion'} />
        {currentEnv !== 'prod' && (
          <View
            style={{
              backgroundColor: Colors.warning,
              padding: moderateScale(12),
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Inter-Semibold',
                textAlign: 'center',
              }}>
              Current environment: {currentEnv.toUpperCase()}
            </Text>
          </View>
        )}
        <ScrollView showsVerticalScrollIndicator={false}>
          {loginWithPhone ? (
            <Formik
              initialValues={{
                phone: '',
                password: '',
              }}
              validationSchema={validateLoginWithPhone}
              onSubmit={handleLogin}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={{padding: moderateScale(18)}}>
                  <View>
                    <PhoneInput onChange={handleChange('phone')} />
                    <Input
                      value={values.password}
                      secureTextEntry={true}
                      onChangeText={handleChange('password')}
                      label={'Mot de passe'}
                      error={errors.password}
                    />
                    <Button
                      underline={true}
                      onPress={() => navigation.navigate('RecoverPassword')}
                      style={{
                        marginTop: moderateScale(16),
                        alignItems: 'flex-start',
                      }}
                      color={'white'}
                      textColor={Colors.primary}>
                      J'ai oublié mon mot de passe
                    </Button>

                    <Button
                      onPress={handleSubmit}
                      style={{marginTop: moderateScale(16)}}
                      color={Colors.brand}
                      loading={login.loading || getProfile.loading}>
                      Me connecter
                    </Button>
                    <Button
                      underline={true}
                      onPress={() => setLoginWithPhone(false)}
                      style={{marginTop: moderateScale(16)}}
                      color={'white'}
                      textColor={Colors.brand}>
                      Me connecter par email ou $kashtag
                    </Button>
                  </View>
                </View>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={{
                username: '',
                password: '',
              }}
              validationSchema={validateLoginWithEmailOrKashtag}
              onSubmit={handleLogin}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={{padding: moderateScale(18)}}>
                  <View>
                    <Input
                      value={values.username}
                      onChangeText={handleChange('username')}
                      touched={touched.username}
                      error={errors.username}
                      label={'Adresse mail ou $kashtag'}
                    />
                    <Input
                      value={values.password}
                      secureTextEntry={true}
                      onChangeText={handleChange('password')}
                      label={'Mot de passe'}
                    />
                    <Button
                      underline={true}
                      onPress={() => navigation.navigate('RecoverPassword')}
                      style={{
                        marginTop: moderateScale(16),
                        alignItems: 'flex-start',
                      }}
                      color={'white'}
                      textColor={Colors.primary}>
                      J'ai oublié mon mot de passe
                    </Button>

                    <Button
                      onPress={handleSubmit}
                      style={{marginTop: moderateScale(16)}}
                      color={Colors.brand}
                      loading={login.loading || getProfile.loading}>
                      Me connecter
                    </Button>
                    <Button
                      underline={true}
                      onPress={() => setLoginWithPhone(true)}
                      style={{marginTop: moderateScale(16)}}
                      color={'white'}
                      textColor={Colors.brand}>
                      Me connecter par numéro de téléphone
                    </Button>
                  </View>
                </View>
              )}
            </Formik>
          )}
        </ScrollView>
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
    fontSize: RFValue(28),
    color: Colors.dark,
    marginBottom: moderateScale(10),
    marginTop: moderateScale(4),
  },
  subtitle: {
    color: Colors.medium,
    fontSize: RFValue(16),
    marginTop: moderateScale(4),
    lineHeight: moderateScale(22),
  },
});

export default Login;
