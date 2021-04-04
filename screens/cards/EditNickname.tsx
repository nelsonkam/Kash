import React, {useState} from 'react';
import {useAsync} from '../../utils/hooks';
import api from '../../utils/api';
import toast from '../../utils/toast';
import {StyleSheet, Text, View} from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Colors from '../../utils/colors';
import {useNavigation, useRoute} from '@react-navigation/native';

const EditNickname = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [name, setName] = useState<string>('');
  const updateVirtualCard = useAsync(data =>
    api.patch(`/kash/virtual-cards/${route.params.card.id}/`, data),
  );

  const handlePress = () => {
    updateVirtualCard
      .execute({nickname: name})
      .then(() => {
        navigation.goBack();
      })
      .catch(() => {
        toast.error('Une erreur est survenue', 'Veux-tu bien réessayer?');
      });
  };
  return (
    <View style={{padding: 16, backgroundColor: 'white', flex: 1}}>
      <Text style={styles.title}>Donnes un nom à ta carte</Text>
      <Text style={styles.subtitle}>
        Ce nom te permettra de distinguer tes cartes à l'avenir.
      </Text>
      <View style={{marginTop: 16}}>
        <Input
          value={name}
          onChangeText={text => setName(text)}
          label={'Nom de la carte'}
        />
      </View>
      <Button
        style={{marginTop: 8}}
        color={Colors.brand}
        disabled={!name}
        loading={updateVirtualCard.loading}
        onPress={handlePress}>
        Enregistrer
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Inter-Black',
    fontSize: 20,
    color: Colors.dark,
    marginBottom: 10,
    marginTop: 4,
  },
  subtitle: {
    color: Colors.medium,
    fontSize: 16,
    marginTop: 0,
  },
});

export default EditNickname;
