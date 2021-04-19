import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CardPaymentOperationType} from '../../utils';
import {StyleSheet, View} from 'react-native';
import Colors from '../../utils/colors';
import {useAsync} from '../../utils/hooks';
import api, {fetcher} from '../../utils/api';
import KashPad from '../../components/KashPad';
import useSWRNative from '@nandorojo/swr-react-native';

const RechargeCard = ({}) => {
  const {params} = useRoute();
  // @ts-ignore
  const {card} = params;
  const profileQuery = useSWRNative('/kash/profiles/current/', fetcher);
  const navigation = useNavigation();
  const limits = profileQuery.data?.limits
    ? profileQuery.data?.limits['fund-card']
    : {
        min: 5,
        max: 1000,
      };
  const fundingDetails = useAsync(data =>
    api.post(`/kash/virtual-cards/${card.id}/funding_details/`, data),
  );

  const handleRecharge = (amount: number) => {
    fundingDetails.execute({amount}).then(res => {
      navigation.navigate('PayCard', {
        id: card.id,
        total: {
          amount: parseInt(res.data.amount, 10),
          currency: 'XOF',
        },
        fees: {amount: parseInt(res.data.fees, 10), currency: 'XOF'},
        usdAmount: amount,
        type: CardPaymentOperationType.fund,
      });
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white', position: 'relative'}}>
      <KashPad
        limits={limits}
        currency={'$'}
        onNext={handleRecharge}
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
