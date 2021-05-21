import React, {useState} from 'react';
import KashPad from '../../components/KashPad';
import {View} from 'react-native';
import useSWRNative from '@nandorojo/swr-react-native';
import {fetcher} from '../../utils/api';
import {useNavigation} from '@react-navigation/native';

function Deposit() {
  const [amount, setAmount] = useState(0);
  const navigation = useNavigation();
  const ratesQuery = useSWRNative(`/kash/rates/`, fetcher);
  const profileQuery = useSWRNative('/kash/profiles/current/', fetcher);
  let limits = profileQuery.data?.limits
    ? profileQuery.data?.limits['deposit']
    : null;
  limits = limits || {min: 25, max: 500000};

  const handleRecharge = (amount: number) => {
    navigation.navigate('Payment', {
      url: `/kash/wallets/current/deposit/`,
      total: {amount, currency: 'XOF'},
      fees: {amount: 0, currency: 'XOF'},
    });
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white', position: 'relative'}}>
      <KashPad
        limits={limits}
        onChange={setAmount}
        currency={'CFA '}
        onNext={handleRecharge}
        buttonText={{
          next: 'Recharger',
          cancel: 'Annuler',
        }}
      />
    </View>
  );
}

export default Deposit;
