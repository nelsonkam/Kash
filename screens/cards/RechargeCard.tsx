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
  const wallet = profileQuery.data?.wallet || {};
  const balance = Math.round(parseFloat(wallet?.xof_amount?.amount) || 0);

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
    api.post(`/kash/virtual-cards/${card.id}/funding_details/`, data),
  );
  const rate = getRate.value?.data.amount || Constants.defaultCardRate;

  const handleRecharge = (amount: number) => {
    fundingDetails.execute({amount}).then(res => {
      const total = parseInt(res.data.fees, 10) + parseInt(res.data.amount, 10);
      if (total > balance) {
        Alert.alert(
          '',
          'Ton solde est insuffisant pour effectuer cette opération. Recharge ton portefeuille puis réessaie.',
          [
            {
              text: 'Recharger',
              onPress: () => {
                navigation.navigate('Kash', {
                  screen: 'Deposit',
                });
              },
            },
          ],
        );
        return;
      }
      navigation.navigate('ConfirmPin', {
        url: `/kash/virtual-cards/${card.id}/fund/`,
        data: {
          amount: total,
          usd_amount: amount,
        },
        backScreen: 'Cards',
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
