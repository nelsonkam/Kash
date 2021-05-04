import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Colors from '../../utils/colors';
import KBottomSheet from '../../components/KBottomSheet';
import {useAsync} from '../../utils/hooks';
import api, {fetcher} from '../../utils/api';
import toast from '../../utils/toast';
import {useNavigation} from '@react-navigation/native';
import KashPad from '../../components/KashPad';
import useSWRNative from '@nandorojo/swr-react-native';
import {CardPaymentOperationType} from '../../utils';
import VerificationOnboarding from '../../components/VerificationOnboarding';

const CardForm = ({onVirtualCard}: {onVirtualCard: (card: any) => void}) => {
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
        Ce nom te permettra de distinguer tes cartes à l'avenir. Tu peux changer
        ce nom à tout moment.
      </Text>
      <View style={{marginTop: 16}}>
        <Input
          value={name}
          onChangeText={text => setName(text)}
          label={'Nom de la carte'}
          placeholder={'Ex. Netflix, Shopping...'}
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

type RecapSheetProps = {
  amount: number;
  onNext: () => void;
  fees: number;
  virtualCard: any;
};

const RecapSheet = ({amount, onNext, fees, virtualCard}: RecapSheetProps) => {
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
            Frais de transaction
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              fontSize: 16,
              color: Colors.medium,
            }}>
            {' '}
            CFA {fees}
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
            CFA {amount + virtualCard?.issuance_cost?.amount + fees}
          </Text>
        </View>
      </View>
      <Button onPress={onNext}>Suivant</Button>
    </View>
  );
};

function NewCard() {
  const navigation = useNavigation();
  const profileQuery = useSWRNative('/kash/profiles/current/', fetcher, {});
  const [virtualCard, setVirtualCard] = useState<any>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [usdAmount, setUSDAmount] = useState<number | null>(null);
  const [fees, setFees] = useState<number | null>(null);
  const recapRef = useRef<KBottomSheet>(null);
  const convertAmount = useAsync((id, amount) =>
    api.post(`/kash/virtual-cards/${id}/convert/`, {amount, currency: 'USD'}),
  );
  const limits = profileQuery.data?.limits || {};

  if (profileQuery.data && profileQuery.data.kyc_level < 2) {
    return (
      <VerificationOnboarding
        onNext={() => navigation.navigate('VerifyKYC', {showOnboarding: false})}
      />
    );
  }

  const handleRecharge = (usdAmount: number) => {
    setUSDAmount(usdAmount);
    convertAmount.execute(virtualCard?.id, usdAmount).then(res => {
      setAmount(res.data.amount);
      setFees(res.data.fees);
      recapRef.current?.open();
    });
  };

  const handleNext = () => {
    recapRef.current?.close();
    const totalAmount = amount + virtualCard?.issuance_cost.amount;
    navigation.navigate('PayCard', {
      id: virtualCard.id,
      total: {
        amount: totalAmount,
        currency: 'XOF',
      },
      fees: {amount: fees, currency: 'XOF'},
      usdAmount,
      type: CardPaymentOperationType.fund,
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {!virtualCard ? (
        <CardForm onVirtualCard={setVirtualCard} />
      ) : (
        <KashPad
          limits={limits['purchase-card'] || {}}
          currency={'$'}
          onNext={handleRecharge}
          loading={convertAmount.loading}
          buttonText={{
            next: 'Recharger',
            cancel: 'Annuler',
          }}
        />
      )}
      <KBottomSheet ref={recapRef} snapPoints={[360, 0]}>
        <RecapSheet
          virtualCard={virtualCard}
          amount={amount!}
          fees={fees!}
          onNext={handleNext}
        />
      </KBottomSheet>
    </View>
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
