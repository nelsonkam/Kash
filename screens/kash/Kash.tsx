import React, {useEffect, useRef, useState} from 'react';
import {
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../../utils/colors';
import NumPad from '../../components/NumPad';
import Button from '../../components/Button';
import {parse} from '../../utils';
import {useNavigation} from '@react-navigation/native';
import KBottomSheet from '../../components/KBottomSheet';
import useSWRNative from '@nandorojo/swr-react-native';
import {fetcher} from '../../utils/api';
const VERSION = '1.0.0';

const Kash = () => {
  const [amount, setAmount] = useState(0);
  const navigation = useNavigation();
  const versionQuery = useSWRNative(`/kash/version/`, fetcher);
  const updateRef = useRef(null);
  useEffect(() => {
    if (versionQuery.data && versionQuery.data.version > VERSION) {
      updateRef.current?.open();
    }
  }, [versionQuery.data]);

  const handleDownload = () => {
    const url =
      Platform.OS === 'ios'
        ? versionQuery.data.ios_url
        : versionQuery.data.android_url;
    if (url) {
      updateRef.current?.close();
      Linking.openURL(url);
    }
  };
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
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'space-between',
        }}>
        <StatusBar barStyle="dark-content" />
        <View
          style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.amount}>
            CFA{' '}
            <Text style={{color: amount === 0 ? Colors.disabled : Colors.dark}}>
              {amount}
            </Text>
          </Text>
        </View>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', marginHorizontal: 8}}>
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
          <NumPad onChange={handleNumChange} height={320}></NumPad>
        </View>
      </SafeAreaView>
      <KBottomSheet ref={updateRef} snapPoints={[220, 0]}>
        <View
          style={{
            backgroundColor: 'white',
            height: 220,
            padding: 16,
            paddingTop: 24,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              color: Colors.dark,
              fontSize: 20,
            }}>
            Mise à jour disponible
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              color: Colors.medium,
              fontSize: 16,
              marginTop: 12,
            }}>
            Une nouvelle version de Kash est disponible avec de nouvelles
            fonctionnalité et pleins de surpises
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 32,
            }}>
            <Button
              textColor={Colors.dark}
              style={{flex: 0.8}}
              onPress={() => updateRef.current?.close()}
              color={Colors.border}>
              Plus tard
            </Button>
            <View style={{flex: 0.1}}></View>
            <Button onPress={handleDownload} style={{flex: 0.8}}>
              Télécharger
            </Button>
          </View>
        </View>
      </KBottomSheet>
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
