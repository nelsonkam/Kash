import React, {useEffect, useState} from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Colors from '../../utils/colors';
import NumPad from '../../components/NumPad';
import Button from '../../components/Button';
import {parse} from '../../utils';
import {useNavigation} from '@react-navigation/native';
import useSWRNative from '@nandorojo/swr-react-native';
import {fetcher} from '../../utils/api';

const VERSION = '1.0.0';

const Kash = () => {
  const [amount, setAmount] = useState(0);
  const navigation = useNavigation();
  const versionQuery = useSWRNative(`/kash/version/`, fetcher);
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
  const handleNumChange = num => {
    if (num === 'backspace') {
      setAmount(
        parse(amount.toString().substring(0, amount.toString().length - 1)),
      );
    } else {
      setAmount(parse(`${amount}${num}`));
    }
  };
  return (
    <>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'space-between',
        }}>
        <StatusBar barStyle="dark-content" />
        <View
          style={{flex: 0.7, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.amount}>
            CFA{' '}
            <Text style={{color: amount === 0 ? Colors.disabled : Colors.dark}}>
              {amount}
            </Text>
          </Text>
        </View>
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 8,
              marginBottom: 24,
            }}>
            <Button
              color={Colors.brand}
              disabled={amount < 25}
              onPress={() => {
                setAmount(0);
                navigation.navigate('RequestRecipient', {amount});
              }}
              style={{flex: 1, marginVertical: 8, marginHorizontal: 8}}>
              Demander
            </Button>
            <Button
              color={Colors.brand}
              disabled={amount < 25}
              onPress={() => {
                setAmount(0);
                navigation.navigate('SendRecipient', {amount});
              }}
              style={{flex: 1, marginVertical: 8, marginHorizontal: 8}}>
              Envoyer
            </Button>
          </View>
          <View style={{alignItems: 'center'}}>
            <NumPad onChange={handleNumChange} />
          </View>
        </View>
      </ScrollView>
    </>
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
});

export default Kash;
