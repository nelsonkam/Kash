import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image, ScrollView, Text} from 'react-native';
import Colors from '../../utils/colors';
import Button from '../../components/Button';
import {useAsync} from '../../utils/hooks';
import api from '../../utils/api';
import {useDispatch} from 'react-redux';
import authSlice from '../../slices/auth';
import toast from '../../utils/toast';

function SetupWallet() {
  const createWallet = useAsync(() =>
    api.post(`/kash/profiles/current/wallet/`),
  );
  const getProfile = useAsync(() => api.get(`/kash/profiles/current/`));
  const dispatch = useDispatch();

  const handleCreateWallet = () => {
    createWallet
      .execute()
      .then(() => getProfile.execute())
      .then(res => {
        dispatch(authSlice.actions.setProfile(res.data));
      })
      .catch(err => {
        toast.error(
          'Une erreur est survenue',
          'Vérifies ta connexion internet puis réessaies.',
        );
      });
  };
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: 'white',
        padding: 18,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        style={{width: 300, height: 300 * 0.7, marginVertical: 24}}
        source={require('../../assets/wallet-concept.png')}
      />
      <Text
        style={{
          fontFamily: 'Inter-Bold',
          fontSize: 26,
          textAlign: 'center',
          marginVertical: 24,
        }}>
        Du nouveau sur Kash!
      </Text>
      <Text
        style={{
          fontFamily: 'Inter-Regular',
          fontSize: 18,
          color: Colors.dark,
          marginBottom: 12,
          width: '100%',
        }}>
        Désormais, ton compte Kash est équipé d'un portefeuille avec lequel tu
        pourras envoyer et recevoir du kash.
      </Text>
      <Text
        style={{
          fontFamily: 'Inter-Regular',
          fontSize: 18,
          color: Colors.dark,
          marginBottom: 12,
          width: '100%',
        }}>
        Avec ton portefeuille, tes transactions te coûteront juste{' '}
        <Text style={{fontFamily: 'Inter-Bold'}}> 25 FCFA seulement</Text>{' '}
        quelque soit le montant.{' '}
      </Text>
      <Button
        loading={createWallet.loading || getProfile.loading}
        onPress={handleCreateWallet}
        style={{marginVertical: 32}}>
        Créer mon portefeuille
      </Button>
    </ScrollView>
  );
}

export default SetupWallet;
