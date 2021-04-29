import React, {useEffect, useState} from 'react';
import {
  Alert,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../utils/colors';
import Button, {BackButton} from '../../components/Button';
import {useDispatch} from 'react-redux';
import authSlice from '../../slices/auth';
import api from '../../utils/api';
import {useAsync} from '../../utils/hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import toast from '../../utils/toast';
import {SafeAreaView} from 'react-native-safe-area-context';
import PhoneInput from '../../components/PhoneInput';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AddPhone = () => {
  const dispatch = useDispatch();
  const {params} = useRoute();
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [isSkipVisible, setSkipVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // @ts-ignore
      if (!params.stack) {
        setSkipVisible(true);
      }
    }, 60 * 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleSkip = () => {
    Alert.alert(
      'Information importante',
      "À moins que tu ne rajoutes un numéro de téléphone plus tard, en cas d'oubli de ton mot de passe " +
        "le seul moyen de récupérer ton compte sera de prouver que ce compte t'appartient (cela prends environ 1 semaine).",
      [
        {
          style: 'destructive',
          text: "Je comprends et j'accepte",
          onPress() {
            navigation.navigate('InviteCode');
          },
        },
        {
          style: 'default',
          text: 'Annuler',
        },
      ],
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />
      <View>
        <View
          style={{
            padding: 12,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: Colors.border,
          }}>
          <BackButton style={{flex: 2}} />
          <View style={{flex: 8}}>
            <Text
              style={{
                color: Colors.dark,
                fontFamily: 'Inter-Bold',
                fontSize: 18,
                textAlign: 'center',
              }}>
              Numéro de téléphone
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://www.notion.so/Centre-d-aide-464a7a6e4ebd4ba8af090e99320edbea',
              )
            }
            style={{flex: 2, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Ionicons
              name={'help-circle-outline'}
              color={Colors.dark}
              size={28}
            />
          </TouchableOpacity>
        </View>
        <View style={{padding: 18}}>
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
            {isSkipVisible && (
              <Button
                onPress={handleSkip}
                style={{marginTop: 16}}
                color={'white'}
                textColor={Colors.primary}>
                Sauter cette étape
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

export default AddPhone;
