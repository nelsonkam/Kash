import React, {useState} from 'react';
import KashPad from '../../components/KashPad';
import {View} from 'react-native';
import useSWRNative from '@nandorojo/swr-react-native';
import api, {fetcher} from '../../utils/api';
import {useNavigation} from '@react-navigation/native';
import {useAsync} from '../../utils/hooks';

function Withdraw() {
  const [amount, setAmount] = useState(0);
  const navigation = useNavigation();
  const ratesQuery = useSWRNative(`/kash/rates/`, fetcher);
  const profileQuery = useSWRNative('/kash/profiles/current/', fetcher);
  const withdraw = useAsync(data =>
    api.post(`/kash/wallets/current/withdraw/`, data),
  );
  let limits = profileQuery.data?.limits
    ? profileQuery.data?.limits['withdraw']
    : null;
  limits = limits || {min: 1, max: 100};
  const rate = ratesQuery.data?.withdraw?.XOF || 545;

  const handleNext = (amount: number) => {
    withdraw.execute({amount, currency: 'USD'}).then(() => {
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    });
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white', position: 'relative'}}>
      <KashPad
        limits={limits}
        onChange={setAmount}
        currency={'$'}
        onNext={handleNext}
        miniText={`~ CFA ${Math.round(amount * rate)} à CFA ${rate}`}
        buttonText={{
          next: 'Retirer',
          cancel: 'Annuler',
        }}
        loading={withdraw.loading}
      />
    </View>
  );
}

export default Withdraw;
