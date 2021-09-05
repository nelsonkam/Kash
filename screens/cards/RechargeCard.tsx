import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CardPaymentOperationType, Constants} from '../../utils';
import {Alert, StyleSheet, View} from 'react-native';
import Colors from '../../utils/colors';
import {useAsync} from '../../utils/hooks';
import api, {fetcher} from '../../utils/api';
import KashPad from '../../components/KashPad';
import useSWRNative from '@nandorojo/swr-react-native';

const RechargeCard = ({}) => {
  const {params} = useRoute();
  // @ts-ignore
  const {card} = params;
  const [amount, setAmount] = useState(0);
  const profileQuery = useSWRNative('/kash/profiles/current/', fetcher);
  const getRate = useAsync(() =>
    api.post(`/kash/virtual-cards/${card.id}/convert/`, {
      currency: 'USD',
      amount: 1,
    }),
  );
  const navigation = useNavigation();

  useEffect(() => {
    getRate.execute();
  }, []);
  const limits = profileQuery.data?.limits
    ? profileQuery.data?.limits['fund-card']
    : {
        min: 5,
        max: 1000,
      };
  const fundingDetails = useAsync(data =>
    api.post(`/kash/virtual-cards/${card.id}/txn/preview/`, data),
  );
  const rate = getRate.value?.data.amount || Constants.defaultCardRate;

  const handleRecharge = (amount: number) => {
    fundingDetails.execute({amount, currency: "USD", operation: "funding"}).then(res => {
      navigation.navigate('PayCard', {
        id: card.id,
        usdAmount: amount,
        txnPreview: res.data,
        type: CardPaymentOperationType.fund,
      });
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white', position: 'relative'}}>
      <KashPad
        onChange={setAmount}
        limits={limits}
        currency={'$'}
        onNext={handleRecharge}
        miniText={`~ CFA ${Math.round(amount * rate).toLocaleString()}`}
        buttonText={{
          next: 'Recharger',
          cancel: 'Annuler',
        }}
        loading={fundingDetails.loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  amount: {
    fontFamily: 'Inter-Semibold',
    fontSize: 44,
    color: Colors.dark,
    paddingHorizontal: 4,
  },
  minMaxPill: {
    marginTop: 28,
    backgroundColor: Colors.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
});

export default RechargeCard;
