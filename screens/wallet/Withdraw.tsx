import React, {useState} from 'react';
import KashPad from '../../components/KashPad';
import {View} from 'react-native';
import useSWRNative from '@nandorojo/swr-react-native';
import api, {fetcher} from '../../utils/api';
import {useNavigation} from '@react-navigation/native';
import {useAsync} from '../../utils/hooks';
import {Constants} from '../../utils';

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
  limits = limits || {min: 25, max: 50000};
  const rate = ratesQuery.data?.withdraw?.XOF || 650;
  const fee = Constants.withdrawFees;

  const handleNext = (amount: number) => {
    console.log(amount + fee);
    withdraw
      .execute({amount: ((amount + fee) / rate).toFixed(7), currency: 'USD'})
      .then(() => {
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      });
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white', position: 'relative'}}>
      <KashPad
        onChange={setAmount}
        limits={limits}
        currency={'CFA '}
        onNext={handleNext}
        buttonText={{
          next: 'Retirer',
          cancel: 'Annuler',
        }}
        miniText={`Frais: CFA ${fee}`}
        loading={withdraw.loading}
      />
    </View>
  );
}

export default Withdraw;
