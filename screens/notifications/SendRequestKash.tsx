import React, {useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {parse} from '../../utils';
import {Text, View} from 'react-native';
import Colors from '../../utils/colors';
import Button from '../../components/Button';
import NumPad from '../../components/NumPad';
import PaymentSheet from '../../components/PaymentSheet';
import KBottomSheet from '../../components/KBottomSheet';
import {useAsync} from '../../utils/hooks';
import api from '../../utils/api';
import {mutate} from 'swr';

function SendRequestKash(props) {
  const {params} = useRoute();
  const request = params.request;
  const [amount, setAmount] = useState(parseInt(request.amount, 10));
  const navigation = useNavigation();
  const [txnRef, setTxnRef] = useState(null);
  const paymentRef = useRef<KBottomSheet>(null);
  const [kashTxn, setKashTxn] = useState(null);
  const sendKash = useAsync(data => api.post(`/kash/send/`, data), true);
  const payKashTxn = useAsync((id, data) =>
    api.post(`/kash/send/${id}/pay/`, data),
  );
  const acceptedRequest = useAsync(data =>
    api.post(`/kash/requests/${request.id}/accepted/`, data),
  );
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `CFA ${parseInt(request.amount, 10)}`,
    });
  }, [navigation]);

  const handleNumChange = num => {
    if (num === 'backspace') {
      setAmount(
        parse(amount.toString().substring(0, amount.toString().length - 1)),
      );
    } else {
      setAmount(parse(`${amount}${num}`));
    }
  };
  const handleSend = () => {
    sendKash
      .execute({
        note: 'Demande de kash 💰',
        is_incognito: false,
        recipient_tags: [request.initiator.kashtag],
        amount,
      })
      .then(res => {
        setKashTxn(res.data);
        paymentRef.current?.open();
      });
  };
  const handlePay = data => {
    payKashTxn.execute(kashTxn.id, data).then(res => {
      setTxnRef(res.data.txn_ref);
    });
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{
            fontFamily: 'Inter-Semibold',
            fontSize: 44,
            color: Colors.dark,
            paddingHorizontal: 4,
          }}>
          CFA{' '}
          <Text style={{color: amount === 0 ? Colors.disabled : Colors.dark}}>
            {amount}
          </Text>
        </Text>
      </View>
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', marginHorizontal: 8}}>
          <Button
            onPress={() => navigation.goBack()}
            color={Colors.border}
            textColor={Colors.dark}
            disabled={sendKash.loading}
            style={{flex: 1, marginVertical: 8, marginHorizontal: 8}}>
            Annuler
          </Button>
          <Button
            color={Colors.brand}
            disabled={amount < 1000 && amount > 50000}
            onPress={handleSend}
            loading={sendKash.loading}
            style={{flex: 1, marginVertical: 8, marginHorizontal: 8}}>
            Envoyer
          </Button>
        </View>
        <NumPad onChange={handleNumChange} height={320}></NumPad>
      </View>
      <KBottomSheet ref={paymentRef} snapPoints={['80%', 0]}>
        <PaymentSheet
          reference={txnRef}
          amount={kashTxn?.total?.amount}
          fees={kashTxn?.fees?.amount}
          onPay={handlePay}
          loading={payKashTxn.loading}
          onStatusChanged={() => {
            setTimeout(() => {
              acceptedRequest.execute({transaction_id: kashTxn?.id});
              mutate('/kash/notifications/');
              navigation.goBack();
            }, 2000);
          }}
        />
      </KBottomSheet>
    </View>
  );
}

export default SendRequestKash;
