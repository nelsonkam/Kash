import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../utils/colors';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';
import {fetcher} from '../../utils/api';
import CreditCard from '../../components/CreditCard';
import useSWRNative from '@nandorojo/swr-react-native';
import {HeaderBar} from '../../components/HeaderBar';
import {SafeAreaView} from 'react-native-safe-area-context';

function formatValue(data: any) {
  if (!data) return <ActivityIndicator size={'small'} />;
  if (data.is_percentage) {
    return `${data.amount}%`;
  } else {
    return `${data.amount} ${data.currency}`;
  }
}

const EmptyState = () => {
  const navigation = useNavigation();
  const info = useSWRNative(`/kash/info/cards/`, fetcher, {
    refreshInterval: 3000,
  });
  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          padding: 18,
        }}>
        <Text style={styles.title}>Créez votre carte virtuelle</Text>
        <Text style={styles.subtitle}>
          Les cartes virtuelles sont des cartes VISA prépayées qui vous
          permettent d'effectuer des paiements en ligne.
        </Text>
        <Text style={styles.subtitle}>
          Vous pouvez recharger et effectuer des retraits sur ces cartes avec
          votre portefeuille mobile money.
        </Text>
        <Text
          style={{
            fontFamily: 'Inter-Bold',
            color: Colors.dark,
            marginVertical: 20,
            fontSize: 17,
          }}>
          Informations supplémentaires
        </Text>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <Text style={styles.pricingTitle}>Devise de la carte</Text>
          <Text style={styles.pricingSubtitle}>Dollar USD</Text>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <Text style={styles.pricingTitle}>Taux de change*</Text>
          <Text style={styles.pricingSubtitle}>
            {formatValue(info.data?.usd_rate)} pour 1 USD
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <Text style={styles.pricingTitle}>Frais de création</Text>
          <Text style={styles.pricingSubtitle}>
            {formatValue(info.data?.fees?.issuing)}
          </Text>
        </View>

        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <Text style={styles.pricingTitle}>Dépôt minimum</Text>
          <Text style={styles.pricingSubtitle}>
            {formatValue(info.data?.minimum_deposit)}
          </Text>
        </View>

        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginBottom: 16,
          }}>
          <Text style={styles.pricingTitle}>Frais de transaction</Text>
          <Text style={styles.pricingSubtitle}>
            {formatValue(info.data?.fees?.transaction)}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginBottom: 16,
          }}>
          <Text style={styles.pricingTitle}>Frais de retrait</Text>
          <Text style={styles.pricingSubtitle}>
            {formatValue(info.data?.fees?.withdrawal)}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: Colors.medium,
            marginTop: 4,
          }}>
          (*) Lorsque vous rechargez votre carte, nous convertissons la somme
          rechargée en USD au taux de change indiqué ci-dessus et non le taux
          sur les marchés de devises.
        </Text>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'white',
          width: Dimensions.get('window').width,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          padding: 16,
        }}>
        <Button
          onPress={() => navigation.navigate('NewCard')}
          color={Colors.brand}>
          Créer une carte prépayée
        </Button>
      </View>
    </>
  );
};

function Cards() {
  const navigation = useNavigation();
  const cards = useSWRNative(`/kash/virtual-cards/`, fetcher);
  const data = cards.data?.filter((c: any) => c.external_id);

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
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderBar
        title={'Mes cartes'}
        renderRightAction={() => (
          <TouchableOpacity onPress={() => navigation.navigate('NewCard')}>
            <Ionicons name={'add-circle'} color={Colors.brand} size={28} />
          </TouchableOpacity>
        )}
      />
      {data?.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
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
      )}

      {data?.length === 0 && <EmptyState />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: Colors.dark,
    marginVertical: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    marginVertical: 4,
    color: Colors.medium,
  },
  pricingTitle: {
    fontFamily: 'Inter-Semibold',
    fontSize: 16,
    color: Colors.dark,
  },
  pricingSubtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.medium,
  },
});

export default Cards;
