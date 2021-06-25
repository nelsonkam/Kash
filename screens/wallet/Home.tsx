import React, {useEffect} from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Colors from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import useSWRNative from '@nandorojo/swr-react-native';
import {fetcher} from '../../utils/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RequestItem from '../../components/RequestItem';
import TransactionItem from '../../components/TransactionItem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {P2PTxnType} from '../../utils';

const VERSION = '1.2.0';

const EmptyState = ({icon, text}: {icon: React.ReactElement; text: string}) => {
  return (
    <View style={{height: 160, justifyContent: 'center', alignItems: 'center'}}>
      {icon}
      <Text style={{color: Colors.disabled, fontSize: 16, marginVertical: 20}}>
        {text}
      </Text>
    </View>
  );
};

const Home = () => {
  const navigation = useNavigation();
  const {top} = useSafeAreaInsets();
  const profileQuery = useSWRNative(`/kash/profiles/current/`, fetcher);
  const versionQuery = useSWRNative(`/kash/version/`, fetcher);

  const transactionsQuery = useSWRNative(
    `/kash/wallets/current/transactions/?paginate=1&limit=5`,
    fetcher,
  );
  const profile = profileQuery.data || {};
  const isRefreshing =
    transactionsQuery.isValidating || profileQuery.isValidating;
  const handleDownload = () => {
    const url =
      Platform.OS === 'ios'
        ? versionQuery.data.ios_url
        : versionQuery.data.android_url;
    if (url) {
      Linking.openURL(url);
    }
  };
  useEffect(() => {
    if (versionQuery.data && versionQuery.data.version > VERSION) {
      Alert.alert(
        'Mise à jour disponible',
        'Une nouvelle version de Kash est disponible avec de nouvelles fonctionnalités et pleins de surpises',
        [{text: 'Télécharger', onPress: handleDownload}],
      );
    }
  }, [versionQuery.data]);

  const handleRefresh = () => {
    transactionsQuery.revalidate();
    profileQuery.revalidate();
  };

  const wallet = profile.wallet || {};

  return (
    <View
      style={{
        backgroundColor: Colors.brand,
        flex: 1,
        paddingTop: top + 16,
      }}>
      <View
        style={{
          marginBottom: 16,
          marginHorizontal: 16,
          marginTop: 6,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Inter-Bold',
            color: 'white',
            fontSize: 18,
          }}>
          Portefeuille
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: 'white',
          minHeight:
            transactionsQuery.data?.length === 0
              ? undefined
              : Dimensions.get('screen').height - top + 16,
          flex: transactionsQuery.data?.length === 0 ? 1 : undefined,
        }}
        style={{backgroundColor: Colors.brand}}
        refreshControl={
          <RefreshControl
            tintColor={'white'}
            colors={['white']}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }>
        <View
          style={{
            height: 150,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.brand,
            paddingBottom: 16,
          }}>
          <Text style={styles.amount}>
            <Text style={{color: 'white'}}>
              CFA{' '}
              {Math.round(
                parseFloat(wallet?.xof_amount?.amount) || 0,
              ).toLocaleString()}
            </Text>
          </Text>
        </View>
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 8,
            flexDirection: 'row',
            justifyContent: 'space-around',
            borderColor: Colors.border,
            borderBottomWidth: 1,
            borderTopWidth: 1,
            backgroundColor: 'white',
          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SendKash', {type: P2PTxnType.send})
            }
            style={styles.homeActionContainer}>
            <View style={styles.homeAction}>
              <MaterialCommunityIcons
                size={26}
                name={'arrow-top-right'}
                color={'white'}
              />
            </View>
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                fontSize: 16,
                color: Colors.dark,
                textAlign: 'center',
              }}>
              Envoyer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Deposit')}
            style={styles.homeActionContainer}>
            <View style={styles.homeAction}>
              <MaterialCommunityIcons
                name="arrow-collapse-down"
                size={26}
                color={'white'}
              />
            </View>
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                fontSize: 16,
                color: Colors.dark,
                textAlign: 'center',
              }}>
              Recharger
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Withdraw')}
            style={styles.homeActionContainer}>
            <View style={styles.homeAction}>
              <MaterialCommunityIcons
                name="arrow-collapse-up"
                size={26}
                color={'white'}
              />
            </View>
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                fontSize: 16,
                color: Colors.dark,
                textAlign: 'center',
              }}>
              Retirer
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            padding: 16,
            paddingTop: 24,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: 16,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                color: Colors.medium,
                fontSize: 18,
              }}>
              Transactions récentes
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('TransactionHistory')}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  color: Colors.primary,
                  fontSize: 17,
                  marginRight: 2,
                }}>
                Voir tout
              </Text>
              <Ionicons
                name={'arrow-forward'}
                size={24}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>
          <View style={{backgroundColor: 'white'}}>
            {transactionsQuery.data?.slice(0, 5).map((item: any, i: number) => (
              <React.Fragment key={item.id}>
                <TransactionItem transaction={item} />
                {i !== 4 && (
                  <View
                    style={{
                      marginVertical: 8,
                      width: '100%',
                      height: 1,
                      backgroundColor: Colors.grey,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
            {transactionsQuery.data?.length === 0 && (
              <EmptyState
                icon={
                  <AntDesign name={'swap'} size={48} color={Colors.disabled} />
                }
                text={"Tes transactions s'afficheront ici."}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    height: '25%',
    backgroundColor: Colors.primary,
    alignItems: 'center',
    padding: 28,
    justifyContent: 'center',
  },
  topButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    flex: 1,
    alignItems: 'center',
  },
  topButtonText: {
    fontFamily: 'Inter-Bold',
    color: Colors.brand,
    fontSize: 16,
  },
  card: {
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  cardTitle: {
    fontFamily: 'Inter-Bold',
    color: Colors.dark,
    textAlign: 'center',
    fontSize: 17,
    marginVertical: 4,
    marginBottom: 20,
  },
  amount: {
    fontFamily: 'Inter-Medium',
    fontSize: 38,
    color: 'white',
    paddingHorizontal: 4,
  },
  homeAction: {
    height: 52,
    width: 52,
    backgroundColor: Colors.brand,
    borderRadius: 100,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  homeActionContainer: {
    alignItems: 'center',
    maxWidth: 80,
    marginHorizontal: 16,
    width: '100%',
  },
});

export default Home;
