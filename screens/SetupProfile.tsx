import React, {useState} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../utils/colors';
import Input from '../components/Input';
import {toUsername} from '../utils';
import Button from '../components/Button';
import {useAsync} from '../utils/hooks';
import api from '../utils/api';
import toast from '../utils/toast';
import authSlice from '../slices/auth';
import {useDispatch} from 'react-redux';

function SetupProfile(props) {
  const [kashtag, setKashTag] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [showKashtagSection, setShowKashtagSection] = useState(false);
  const createProfile = useAsync(data => api.post(`/kash/profiles/`, data));
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const handleNext = () => {
    createProfile
      .execute({name, kashtag})
      .then(res => {
        dispatch(authSlice.actions.setProfile(res.data));
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

  const getKashtagError = () => {
    if (kashtag) {
      if (kashtag.length < 3) {
        return 'Ton $kashtag doit avoir au moins 3 caractères.';
      } else if (kashtag.length > 30) {
        return 'Ton $kashtag doit avoir au plus 30 caractères.';
      }
    }
    return error;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />
      {showKashtagSection && name ? (
        <View>
          <Text style={styles.title}>Choisis ton $kashtag</Text>
          <Text style={styles.subtitle}>
            Ton $kashtag est un nom unique avec lequel tes potes pourront
            t'envoyer du kash!
          </Text>
          <View style={{marginTop: 16}}>
            <Input
              value={'$' + kashtag}
              description={
                'Ton kashtag ne peut contenir que des lettres miniscules, des chiffres et/ou un tiret de 8 (_)'
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
      ) : (
        <View>
          <Text style={styles.title}>Faisons connaissance</Text>
          <Text style={styles.subtitle}>
            Dis nous comment tu veux qu'on t'appelle.
          </Text>
          <View style={{marginTop: 16}}>
            <Input
              value={name}
              onChangeText={text => setName(text)}
              label={'Nom et prénoms'}
            />
          </View>
          <Button
            style={{marginTop: 8}}
            color={Colors.brand}
            disabled={!name}
            onPress={() => setShowKashtagSection(true)}>
            Suivant
          </Button>
        </View>
      )}
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
  },
});

export default SetupProfile;
