import React, {useEffect, useRef, useState} from 'react';
import {
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Colors from '../../utils/colors';
import NumPad from '../../components/NumPad';
import Button from '../../components/Button';
import {parse} from '../../utils';
import {useNavigation} from '@react-navigation/native';
import KBottomSheet from '../../components/KBottomSheet';
import useSWRNative from '@nandorojo/swr-react-native';
import {fetcher} from '../../utils/api';
import Avatar from '../../components/Avatar';
import {useSelector} from 'react-redux';
import {RootState} from '../../utils/store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RequestItem from '../../components/RequestItem';

const VERSION = '1.0.0';

const EmptyState = ({icon, text}) => {
  return (
    <View style={{height: 160, justifyContent: 'center', alignItems: 'center'}}>
      {icon}
      <Text style={{color: Colors.disabled, fontSize: 16, marginVertical: 20}}>
        {text}
      </Text>
    </View>
  );
};

const TransactionItem = ({transaction}) => {
  const isDebit = transaction.txn_type === 'debit';
  let iconName = isDebit ? 'arrow-top-right' : 'arrow-bottom-left';
  iconName = transaction.status.toLowerCase() === 'failed' ? 'close' : iconName;
  iconName = transaction.status === 'refunded' ? 'cash-refund' : iconName;
  return (
    <View
      style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 4}}>
      <View
        style={{
          height: 48,
          width: 48,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          backgroundColor: isDebit
            ? 'rgba(244, 84, 29, 0.05)'
            : 'rgba(26, 206, 76, 0.05)',
        }}>
        <MaterialCommunityIcons
          size={24}
          name={iconName}
          color={isDebit ? Colors.danger : Colors.success}
        />
      </View>
      <View
        style={{
          marginLeft: 12,
          flex: 1,
        }}>
        <View>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'Inter-Semibold',
                fontSize: 16,
                color: Colors.dark,
              }}>
              {transaction.formatted?.title}
            </Text>
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                fontSize: 14,
                color: isDebit ? Colors.danger : Colors.brand,
              }}>
              {transaction.amount} XOF
            </Text>
          </View>
          <Text
            style={{
              marginTop: 8,
              color: Colors.medium,
              fontFamily: 'Inter-Regular',
            }}>
            {transaction.formatted?.description}
          </Text>
        </View>
      </View>
    </View>
  );
};

const Home = () => {
  const {profile} = useSelector((s: RootState) => s.auth);
  const navigation = useNavigation();
  const {top} = useSafeAreaInsets();
  const versionQuery = useSWRNative(`/kash/version/`, fetcher);
  const requestsQuery = useSWRNative(
    `/kash/requests/received/?paginate=1&limit=3`,
    fetcher,
  );
  const transactionsQuery = useSWRNative(
    `/kash/txn_history/?paginate=1&limit=5`,
    fetcher,
  );
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

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        padding: 16,
        paddingTop: top + 16,
      }}>
      <View
        style={{
          marginBottom: 24,
          marginTop: 6,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Inter-Bold',
            color: Colors.dark,
            fontSize: 20,
          }}>
          Tableau de bord
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name={'person-circle-outline'} size={28} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View
            style={{
              borderRadius: 8,
              padding: 18,
              backgroundColor: Colors.lightGrey,
              flex: 1,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Inter-SemiBold',
                marginBottom: 8,
              }}>
              Entrées
            </Text>
            <Text
              style={{
                fontFamily: 'Inter-Bold',
                fontSize: 20,
                color: Colors.brand,
              }}>
              CFA 20,000
            </Text>
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                color: Colors.medium,
                marginTop: 8,
              }}>
              Ce mois
            </Text>
          </View>
          <View style={{width: 16, height: 1}} />
          <View
            style={{
              borderRadius: 8,
              padding: 18,
              backgroundColor: Colors.lightGrey,
              flex: 1,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Inter-SemiBold',
                marginBottom: 8,
              }}>
              Sorties
            </Text>
            <Text
              style={{
                fontFamily: 'Inter-Bold',
                fontSize: 20,
                color: Colors.danger,
              }}>
              CFA 20,000
            </Text>
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                color: Colors.medium,
                marginTop: 8,
              }}>
              Ce mois
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 24,
            marginBottom: 4,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              color: Colors.medium,
              fontSize: 17,
            }}>
            Requêtes reçues
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Requests')}
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
            <Ionicons name={'arrow-forward'} size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {requestsQuery.data?.results?.map((item, i) => (
            <>
              <RequestItem profile={profile} request={item} />
              {i !== requestsQuery.data?.results.length - 1 && (
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: Colors.grey,
                  }}
                />
              )}
            </>
          ))}
          {requestsQuery.data?.length === 0 && (
            <EmptyState
              icon={
                <AntDesign
                  name={'arrowdown'}
                  size={48}
                  color={Colors.disabled}
                />
              }
              text={"Tes requêtes reçues s'afficheront ici."}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 24,
            marginBottom: 16,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              color: Colors.medium,
              fontSize: 17,
            }}>
            Transactions récentes
          </Text>
          <TouchableOpacity
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
            <Ionicons name={'arrow-forward'} size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {transactionsQuery.data?.results?.map((item, i) => (
            <>
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
            </>
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
  amount: {
    fontFamily: 'Inter-Semibold',
    fontSize: 44,
    color: Colors.dark,
    paddingHorizontal: 4,
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
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'Inter-Bold',
    color: Colors.dark,
    textAlign: 'center',
    fontSize: 17,
    marginVertical: 4,
    marginBottom: 20,
  },
});

export default Home;
