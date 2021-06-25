import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import KashPad from '../../components/KashPad';
import {useNavigation, useRoute} from '@react-navigation/native';
import api, {fetcher} from '../../utils/api';
import Colors from '../../utils/colors';
import useSWRNative from '@nandorojo/swr-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button';
import {Constants, P2PTxnType} from '../../utils';
import {useAsync} from '../../utils/hooks';

function SendKash() {
  const [amount, setAmount] = useState(0);
  const {params} = useRoute();
  // @ts-ignore
  const {recipients, type, note} = params;
  const navigation = useNavigation();
  const profileQuery = useSWRNative(`/kash/profiles/current/`, fetcher);
  const title = type === P2PTxnType.send ? 'Envoyer' : 'Demander';
  const sendKash = useAsync(
    data => api.post(`/kash/wallets/current/transfer/`, data),
    true,
  );
  const ratesQuery = useSWRNative(`/kash/rates/`, fetcher);
  const rate = ratesQuery.data?.transfer?.XOF || Constants.defaultUSDRate;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title,
    });
  }, [navigation]);

  const handleNext = (amount: number) => {
    navigation.navigate('Recipients', {
      type,
      amount: (amount / rate).toFixed(7),
    });
  };

  let limits = profileQuery.data?.limits
    ? profileQuery.data?.limits.sendkash
    : {min: 25};
  limits = type === P2PTxnType.send ? limits : {min: 25};

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <KashPad
        buttonText={{cancel: 'Annuler', next: title}}
        onChange={setAmount}
        currency={'CFA '}
        limits={limits}
        onNext={handleNext}
        miniText={'Par personne'}
        loading={sendKash.loading}
      />
    </View>
  );
}

export default SendKash;
