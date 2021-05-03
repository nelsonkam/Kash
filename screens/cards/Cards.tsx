import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import Colors from '../../utils/colors';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';
import useSWR from 'swr';
import {fetcher} from '../../utils/api';
import CreditCard from '../../components/CreditCard';
import useSWRNative from '@nandorojo/swr-react-native';

function Cards() {
  const navigation = useNavigation();
  const cards = useSWRNative(`/kash/virtual-cards/`, fetcher);
  const data = cards.data?.filter((c: any) => c.card_details);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('NewCard')}
          style={{paddingHorizontal: 16}}>
          <Ionicons name={'add-circle'} color={Colors.brand} size={28} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 16}}>
      <FlatList
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 24,
            }}>
            <Ionicons name="card" size={72} color={Colors.disabled} />
            <Text style={styles.title}>Crée ta première carte</Text>
            <Text style={styles.subtitle}>
              Crée des cartes prépayées rechargeables à partir de ton compte
              momo pour tes achats en ligne.
            </Text>
            <Button
              onPress={() => navigation.navigate('NewCard')}
              color={Colors.brand}
              style={{marginTop: 32}}>
              Créer une carte prépayée
            </Button>
          </View>
        )}
        onRefresh={() => cards.revalidate()}
        refreshing={cards.isValidating}
        data={data}
        renderItem={({item}) => (
          <CreditCard
            onPress={(card: any) => navigation.navigate('CardDetail', {card})}
            card={item}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.dark,
    marginVertical: 8,
  },
  subtitle: {
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginVertical: 4,
    color: Colors.medium,
  },
});

export default Cards;
