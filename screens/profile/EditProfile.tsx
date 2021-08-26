import React, {useState} from 'react';
import {View} from 'react-native';
import Input from '../../components/Input';
import useSWRNative from '@nandorojo/swr-react-native';
import api, {fetcher} from '../../utils/api';
import {toUsername} from '../../utils';
import Button from '../../components/Button';
import {useAsync} from '../../utils/hooks';
import toast from '../../utils/toast';
import {useNavigation} from '@react-navigation/native';

function EditProfile() {
  const profileQuery = useSWRNative(`/kash/profiles/current/`, fetcher);
  const updateProfile = useAsync(data =>
    api.patch(`/kash/profiles/current/`, data),
  );
  const navigation = useNavigation();
  const [name, setName] = useState(profileQuery.data?.name || '');
  const [kashtag, setKashtag] = useState(profileQuery.data?.kashtag || '');
  const [errors, setErrors] = useState<any>({});
  const getErrors = () => {
    const errors: any = {};
    if (!name) {
      errors.name = 'Ce champs est requis';
    }

    if (kashtag) {
      if (kashtag.length < 3) {
        errors.kashtag = 'Ton $kashtag doit avoir au moins 3 caractères.';
      } else if (kashtag.length > 20) {
        errors.kashtag = 'Ton $kashtag doit avoir au plus 20 caractères.';
      }
    }

    if (!kashtag) {
      errors.kashtag = 'Ce champs est requis';
    }

    return errors;
  };

  const handleSubmit = () => {
    const errors = getErrors();
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      updateProfile
        .execute({
          name,
          kashtag,
        })
        .then(() => {
          setTimeout(() => {
            profileQuery.mutate();
            navigation.goBack();
          }, 500);
        })
        .catch(err => {
          if (err.response && err.response.status === 400) {
            setErrors({...errors, kashtag: 'Oops! Ce $kashtag est déjà pris.'});
          } else {
            toast.error(
              'Une erreur est survenue',
              'Vérifies ta connexion internet puis réessaies.',
            );
          }
        });
    }
  };

  return (
    <View style={{flex: 1, padding: 16, backgroundColor: 'white'}}>
      <Input
        value={name}
        onChangeText={text => setName(text)}
        label={'Noms & prénoms'}
        error={errors.name}
      />
      <Input
        value={'$' + kashtag}
        description={
          'Ton kashtag ne peut contenir que des lettres miniscules, des chiffres et/ou un tiret de huit ( _ )'
        }
        onChangeText={text => setKashtag(toUsername(text))}
        label={'Ton $kashtag'}
        error={errors.kashtag}
      />
      <Button
        loading={updateProfile.loading}
        onPress={handleSubmit}
        style={{marginTop: 12}}>
        Enregistrer
      </Button>
    </View>
  );
}

export default EditProfile;
