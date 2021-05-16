import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image, Text} from 'react-native';
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        padding: 18,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        style={{width: 320, height: 320 * 0.6, marginVertical: 24}}
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
        }}>
        Désormais, ton compte Kash est équipé d'un portefeuille dont le solde
        est en dollar USD. Tu pourras toujours effectuer tes transactions en
        francs CFA (la conversion est automatique).
      </Text>
      <Text
        style={{
          fontFamily: 'Inter-Regular',
          fontSize: 18,
          color: Colors.dark,
          marginBottom: 12,
        }}>
        Avec ton portefeuille, toutes tes transactions en dessous de 5000 FCFA
        sont gratuites et toutes celles au dessus de 5000 FCFA te coûteront{' '}
        <Text style={{fontFamily: 'Inter-Bold'}}>25 FCFA seulement</Text>.{' '}
      </Text>
      <Button
        loading={createWallet.loading || getProfile.loading}
        onPress={handleCreateWallet}
        style={{marginVertical: 32}}>
        Créer mon portefeuille
      </Button>
    </SafeAreaView>
  );
}

export default SetupWallet;
