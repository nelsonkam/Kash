import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../utils/colors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {makeKashtag, toUsername} from '../../utils';
import {useAsync} from '../../utils/hooks';
import api, {BASE_URL} from '../../utils/api';
import {useDispatch, useSelector} from 'react-redux';
import authSlice from '../../slices/auth';
import toast from '../../utils/toast';
import {identify} from '../../utils/track';
import {useNavigation} from '@react-navigation/native';
import {AuthHeaderBar} from '../../components/HeaderBar';
import axios from 'axios';
import {RootState} from '../../utils/store';
import {Formik} from 'formik';
import {validateRegistration} from '../../utils/validationSchemas';
import {moderateScale} from 'react-native-size-matters';
import {RFValue} from 'react-native-responsive-fontsize';

function Signup() {
  const [form, setForm] = useState({
    name: '',
    password: '',
    confirm: '',
    referral_code: '',
  });
  const currentEnv = useSelector((s: RootState) => s.prefs.env);
  const [kashtag, setKashTag] = useState<string>('');
  const [showKashtagSection, setShowKashtagSection] = useState(false);
  const createProfile = useAsync(data =>
    axios.post(`/kash/auth/register/`, data, {
      baseURL: BASE_URL,
    }),
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

  // const getErrors = () => {
  //   const errors: any = {};
  //   if (!form.name) {
  //     errors.name = 'Ce champs est requis';
  //   }
  //
  //   if (!form.password || form.password.length < 8) {
  //     errors.password = 'Ton mot de passe doit contenir au moins 8 caractères.';
  //   }
  //
  //   if (form.password !== form.confirmPassword) {
  //     errors.confirm = 'Les mots de passe ne correspondent pas.';
  //   }
  //   return errors;
  // };

  const handleAccountNext = values => {
    // const errors = getErrors();
    // setErrors(errors);
    // if (Object.keys(errors).length === 0) {
    setForm(values);
    setShowKashtagSection(true);
    // }
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
          toast.error(
            'Oops! ',
            'Ce $kashtag est déjà pris. Réessaie un autre.',
          );
          // setError('Oops! Ce $kashtag est déjà pris. Réessaie un autre');
          setKashTag('');
        } else {
          console.log(err.response);
          toast.error(
            'Une erreur est survenue',
            'Vérifies ta connexion internet puis réessaies.',
          );
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />
      <AuthHeaderBar
        title={showKashtagSection ? 'Choisis ton $kashtag' : 'Crée ton compte'}
        onPress={() => setShowKashtagSection(false)}
      />
      {currentEnv !== 'prod' && (
        <View
          style={{backgroundColor: Colors.warning, padding: moderateScale(12)}}>
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
      <KeyboardAwareScrollView>
        {showKashtagSection ? (
          <View>
            <View style={{padding: moderateScale(18)}}>
              <Text style={styles.subtitle}>
                Ton $kashtag est ton nom d'utilisateur sur Kash, tes potes s'en
                serviront pour t'envoyer du cash.
              </Text>
              <View style={{marginTop: moderateScale(16)}}>
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
              <View style={{paddingVertical: 5}}>
                <Text>Suggestions de $kashtag</Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                {[1, 2].map(item => {
                  let suggestedKashtag = makeKashtag(form.name);
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => setKashTag(suggestedKashtag)}
                      style={{
                        backgroundColor: Colors.brand,
                        padding: moderateScale(8),
                        borderRadius: 20,
                        justifyContent: 'center',
                        margin: moderateScale(5),
                      }}>
                      <Text style={{color: Colors.lightGrey}}>
                        ${makeKashtag(form.name)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Button
                style={{marginTop: moderateScale(16)}}
                color={Colors.brand}
                disabled={!kashtag || !!getKashtagError()}
                loading={createProfile.loading}
                onPress={handleNext}>
                Suivant
              </Button>
              <Text
                style={{
                  fontSize: RFValue(12),
                  color: Colors.disabled,
                  marginTop: moderateScale(16),
                }}>
                En cliquant "Suivant", tu acceptes notre Politique de
                Confidentialité et nos Conditions Générales d'Utilisation que tu
                peux retrouver sur notre site web.
              </Text>
            </View>
          </View>
        ) : (
          <Formik
            initialValues={{
              name: form.name,
              password: form.password,
              confirm: form.confirm,
              referral_code: form.referral_code,
            }}
            validationSchema={validateRegistration}
            onSubmit={handleAccountNext}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <View
                  style={{
                    padding: moderateScale(18),
                  }}>
                  <Text style={styles.subtitle}>
                    Saisis les informations suivantes afin de créer ton compte.
                  </Text>
                  <View style={{marginTop: moderateScale(16)}}>
                    <Input
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      label={'Nom et prénom'}
                      error={errors.name}
                      touched={touched.name}
                    />
                    <Input
                      value={values.password}
                      secureTextEntry={true}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      label={'Mot de passe'}
                      error={errors.password}
                      touched={touched.password}
                    />
                    <Input
                      value={values.confirm}
                      secureTextEntry={true}
                      onChangeText={handleChange('confirm')}
                      onBlur={handleBlur('confirm')}
                      label={'Confirmes ton mot de passe'}
                      error={errors.confirm}
                      touched={touched.confirm}
                    />
                    <Input
                      value={values.referral_code.toUpperCase()}
                      onChangeText={handleChange('referral_code')}
                      label={"Code d'invitation (facultatif)"}
                      onBlur={handleBlur('referral_code')}
                      error={errors.referral_code}
                      placeholder="REF-XXXXX"
                    />
                    <Button
                      onPress={handleSubmit}
                      style={{marginTop: moderateScale(16)}}
                      color={Colors.brand}>
                      Suivant
                    </Button>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        )}
      </KeyboardAwareScrollView>
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

export default Signup;
