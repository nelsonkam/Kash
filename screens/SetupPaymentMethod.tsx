import React, {useState} from 'react';
import {Dimensions, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../utils/colors';
import {PaymentForm} from '../components/PaymentSheet';
import ButtonPicker from '../components/Picker';
import Input from '../components/Input';
import Button from '../components/Button';
import {useAsync} from '../utils/hooks';
import api from '../utils/api';
import {useDispatch} from 'react-redux';
import authSlice from '../slices/auth';
import toast from '../utils/toast';
import {track} from '../utils/track';

export function CreatePaymentMethod(props) {
  const [gateway, setGateway] = useState(null);
  const [phone, setPhone] = useState(null);
  const createPayoutMethod = useAsync(data =>
    api.post(`/kash/payout-methods/`, data),
  );
  const getProfile = useAsync(() => api.get(`/kash/profiles/current/`));
  const dispatch = useDispatch();

  const handleNext = () => {
    createPayoutMethod
      .execute({phone, gateway})
      .then(res => {
        return getProfile.execute();
      })
      .then(res => {
        dispatch(authSlice.actions.setProfile(res.data));
        props.onCreated && props.onCreated();
      })
      .catch(err => {
        toast.error(
          'Une erreur est survenue',
          'Vérifies ta connexion internet puis réessaies.',
        );
      });
  };
  return (
    <View>
      <Text style={styles.subtitle}>
        Dis nous vers quel compte momo tu aimerais qu'on envoie ton kash.
      </Text>
      <View
        style={{
          backgroundColor: 'white',
          height: Dimensions.get('window').height * 0.65,
        }}>
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontFamily: 'Inter-Bold',
              color: Colors.dark,
              marginBottom: 12,
            }}>
            Choisis un opérateur mobile
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <ButtonPicker
              style={{
                flex: 48,
              }}
              source={require('../assets/mtn.png')}
              text="MTN Momo"
              active={gateway === 'mtn-bj'}
              onPress={() => setGateway('mtn-bj')}
            />
            <View style={{flex: 4}}></View>
            <ButtonPicker
              style={{
                flex: 48,
              }}
              source={require('../assets/moov-africa.jpeg')}
              text="Moov Money"
              active={gateway === 'moov-bj'}
              onPress={() => setGateway('moov-bj')}
            />
          </View>
          <View style={{marginVertical: 12}}>
            <Input
              value={phone}
              onChangeText={text => setPhone(text.substring(0, 8))}
              keyboardType={'number-pad'}
              label={'Numéro'}></Input>
          </View>
          <Button
            loading={createPayoutMethod.loading}
            onPress={handleNext}
            disabled={!(gateway && phone)}>
            Suivant
          </Button>
        </View>
      </View>
    </View>
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
  },
});

export default () => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Ajoutes ton compte momo</Text>
    <CreatePaymentMethod />
  </SafeAreaView>
);
