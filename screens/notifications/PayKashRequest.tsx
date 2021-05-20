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

function PayKashRequest() {
  const [amount, setAmount] = useState(0);
  const {params} = useRoute();
  // @ts-ignore
  const request = params.request;
  const navigation = useNavigation();
  const profileQuery = useSWRNative(`/kash/profiles/current/`, fetcher);

  const ratesQuery = useSWRNative(`/kash/rates/`, fetcher);
  const rate = ratesQuery.data?.transfer?.XOF || Constants.defaultUSDRate;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Envoyer',
    });
  }, [navigation]);

  const handleNext = (amount: number) => {
    navigation.navigate('ConfirmPin', {
      url: `/kash/requests/${request.id}/accept/`,
      data: {
        amount: (amount / rate).toFixed(7),
      },
      backScreen: 'Activity',
    });
  };

  let limits = profileQuery.data?.limits
    ? profileQuery.data?.limits.sendkash
    : {min: 25};

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <KashPad
        buttonText={{cancel: 'Annuler', next: 'Envoyer'}}
        onChange={setAmount}
        currency={'CFA '}
        limits={limits}
        onNext={handleNext}
      />
    </View>
  );
}

export default PayKashRequest;
