import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Colors from '../../utils/colors';
import NumPad from '../../components/NumPad';
import {parse} from '../../utils';
import KBottomSheet from '../../components/KBottomSheet';
import PaymentSheet from '../../components/PaymentSheet';
import {useAsync} from '../../utils/hooks';
import api from '../../utils/api';
import toast from '../../utils/toast';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const CardForm = ({onVirtualCard}) => {
  const [name, setName] = useState<string>('');
  const createVirtualCard = useAsync(data =>
    api.post(`/kash/virtual-cards/`, data),
  );

  const handlePress = () => {
    createVirtualCard
      .execute({nickname: name})
      .then(res => {
        onVirtualCard(res.data);
      })
      .catch(() => {
        toast.error('Une erreur est survenue', 'Veux-tu bien réessayer?');
      });
  };
  return (
    <View style={{padding: 16}}>
      <Text style={styles.title}>Donnes un nom à ta carte</Text>
      <Text style={styles.subtitle}>
        Ce nom te permettra de distinguer tes cartes à l'avenir.
      </Text>
      <View style={{marginTop: 16}}>
        <Input
          value={name}
          onChangeText={text => setName(text)}
          label={'Nom de la carte'}
        />
      </View>
      <Button
        style={{marginTop: 8}}
        color={Colors.brand}
        disabled={!name}
        loading={createVirtualCard.loading}
        onPress={handlePress}>
        Suivant
      </Button>
    </View>
  );
};

const RechargeCard = ({onRecharge}) => {
  const [amount, setAmount] = useState(0);
  const navigation = useNavigation();
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
    <View style={{flex: 1}}>
      <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
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
            onPress={() => navigation.goBack()}
            color={Colors.border}
            textColor={Colors.dark}
            style={{flex: 1, marginVertical: 8, marginHorizontal: 8}}>
            Annuler
          </Button>
          <Button
            color={Colors.brand}
            disabled={amount < 3000 || amount > 50000}
            onPress={() => onRecharge(amount)}
            style={{flex: 1, marginVertical: 8, marginHorizontal: 8}}>
            Recharger
          </Button>
        </View>
        <NumPad onChange={handleNumChange} height={320}></NumPad>
      </View>
    </View>
  );
};

const RecapSheet = ({amount, onNext, virtualCard}) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: 360,
      }}>
      <Text
        style={{
          fontFamily: 'Inter-Bold',
          textAlign: 'center',
          fontSize: 18,
          marginTop: 12,
          color: Colors.dark,
        }}>
        Recapitulatif
      </Text>
      <View style={{marginVertical: 24, marginHorizontal: 12}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 12,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              fontSize: 16,
              color: Colors.dark,
            }}>
            Frais de création
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              fontSize: 16,
              color: Colors.medium,
            }}>
            {' '}
            CFA {virtualCard?.issuance_cost?.amount}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 12,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              fontSize: 16,
              color: Colors.dark,
            }}>
            Somme à recharger
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              fontSize: 16,
              color: Colors.medium,
            }}>
            {' '}
            CFA {amount}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: Colors.disabled,
            height: StyleSheet.hairlineWidth,
            width: '100%',
            marginVertical: 8,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 12,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              fontSize: 16,
              color: Colors.dark,
            }}>
            Total à payer
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              fontSize: 16,
              color: Colors.medium,
            }}>
            {' '}
            CFA {amount + 1000}
          </Text>
        </View>
      </View>
      <Button onPress={onNext}>Suivant</Button>
    </View>
  );
};

const CardCreation = ({action}) => {
  const navigation = useNavigation();
  useEffect(() => {
    if (action.value) {
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    }
  }, [action]);
  if (action.error) {
    return (
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          height: 320,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AntDesign name={'closecircle'} color={Colors.danger} size={56} />
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            color: Colors.dark,
            marginVertical: 24,
            fontSize: 16,
            textAlign: 'center',
          }}>
          Oops, une erreur est survenue lors de la création de ta carte
        </Text>
      </View>
    );
  } else if (action.data) {
    return (
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          height: 320,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AntDesign name={'checkcircle'} color={Colors.success} size={56} />
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            color: Colors.dark,
            marginVertical: 24,
            fontSize: 16,
            textAlign: 'center',
          }}>
          Super, ta carte vient d'être créée!
        </Text>
      </View>
    );
  } else {
    return (
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          height: 320,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size={'large'} color={Colors.brand} />
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            color: Colors.dark,
            marginVertical: 24,
            fontSize: 16,
            textAlign: 'center',
          }}>
          Un instant, la création de ta carte est en cours...
        </Text>
      </View>
    );
  }
};

function NewCard(props) {
  const navigation = useNavigation();
  const [virtualCard, setVirtualCard] = useState(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const recapRef = useRef<KBottomSheet>(null);
  const paymentRef = useRef<KBottomSheet>(null);
  const creationRef = useRef<KBottomSheet>(null);
  const purchaseVirtualCard = useAsync((id, data) =>
    api.post(`/kash/virtual-cards/${id}/purchase/`, data),
  );
  const confirmPurchase = useAsync((id, data) =>
    api.post(`/kash/virtual-cards/${id}/purchase/confirm/`, data),
  );

  const handleRecharge = (n: number) => {
    setAmount(n);
    recapRef.current?.open();
  };

  const handlePay = (data: {phone: string; gateway: string}) => {
    return purchaseVirtualCard
      .execute(virtualCard.id, {
        initial_amount: amount,
        phone: data.phone,
        gateway: data.gateway,
      })
      .then(res => {
        setReference(res.data.txn_ref);
      });
  };

  const handleStatusChanged = txn => {
    if (txn.status === 'failed') {
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } else if (txn.status === 'success') {
      recapRef.current?.close();
      paymentRef.current?.close();
      creationRef.current?.open();
      confirmPurchase.execute(virtualCard.id, {txn_ref: txn.reference});
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {!virtualCard ? (
        <CardForm onVirtualCard={setVirtualCard} />
      ) : (
        <RechargeCard onRecharge={handleRecharge} />
      )}
      <KBottomSheet ref={recapRef} snapPoints={[320, 0]}>
        <RecapSheet
          virtualCard={virtualCard}
          amount={amount}
          onNext={() => {
            recapRef.current?.close();
            paymentRef.current?.open();
          }}
        />
      </KBottomSheet>
      <KBottomSheet ref={creationRef} snapPoints={[320, 0]}>
        <CardCreation action={confirmPurchase} />
      </KBottomSheet>

      <KBottomSheet ref={paymentRef} snapPoints={['80%', 0]}>
        <PaymentSheet
          reference={reference}
          loading={purchaseVirtualCard.loading}
          amount={amount + (virtualCard?.issuance_cost?.amount || 0)}
          fees={0}
          onPay={handlePay}
          onStatusChanged={handleStatusChanged}
        />
      </KBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingVertical: 24,
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Inter-Black',
    fontSize: 20,
    color: Colors.dark,
    marginBottom: 10,
    marginTop: 4,
  },
  subtitle: {
    color: Colors.medium,
    fontSize: 16,
    marginTop: 0,
  },
  amount: {
    fontFamily: 'Inter-Semibold',
    fontSize: 44,
    color: Colors.dark,
    paddingHorizontal: 4,
  },
});

export default NewCard;
