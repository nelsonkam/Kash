import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import VerificationOnboarding from '../../components/VerificationOnboarding';
import {CardPaymentOperationType} from '../../utils';

const CardForm = ({onVirtualCard}: {onVirtualCard: (card: any) => void}) => {
  const [name, setName] = useState<string>('');
  const [cardType, setCardType] = useState<string>('');
  const createVirtualCard = useAsync(data =>
    api.post(`/kash/virtual-cards/`, data),
  );

  const handlePress = () => {
    createVirtualCard
      .execute({nickname: name, category: cardType})
      .then(res => {
        onVirtualCard(res.data);
      })
      .catch(() => {
        toast.error('Une erreur est survenue', 'Veux-tu bien réessayer?');
      });
  };
  return (
    <ScrollView style={{padding: 16}}>
      <View>
        <Text
          style={{
            fontFamily: 'Inter-Bold',
            color: Colors.dark,
            fontSize: 16,
          }}>
          Nom de la carte
        </Text>
        <Input
          value={name}
          onChangeText={text => setName(text)}
          description={
            "Ce nom te permettra de distinguer tes cartes à l'avenir. Tu peux changer ce nom à tout moment."
          }
          placeholder={'Ex. Netflix, Shopping...'}
        />
      </View>
      <View style={{marginTop: 18}}>
        <Text
          style={{
            fontFamily: 'Inter-Bold',
            color: Colors.dark,
            marginBottom: 12,
            fontSize: 16,
          }}>
          Type de carte
        </Text>
        <TouchableOpacity
          onPress={() => setCardType('general')}
          style={{
            borderColor: cardType === 'general' ? Colors.brand : Colors.border,
            borderWidth: 2,
            borderRadius: 6,
            padding: 10,
            marginBottom: 16,
          }}>
          <Text
            style={{
              marginBottom: 6,
              color: Colors.dark,
              fontFamily: 'Inter-Bold',
              fontSize: 16,
            }}>
            Général
          </Text>
          <Text
            style={{
              color: Colors.medium,
              fontFamily: 'Inter-Regular',
              fontSize: 14,
            }}>
            Ces cartes peuvent être utilisées sur la plupart des sites.
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCardType('ads')}
          style={{
            borderColor: cardType === 'ads' ? Colors.brand : Colors.border,
            borderWidth: 2,
            borderRadius: 6,
            padding: 10,
            marginBottom: 16,
          }}>
          <Text
            style={{
              marginBottom: 6,
              color: Colors.dark,
              fontFamily: 'Inter-Bold',
              fontSize: 16,
            }}>
            Sponsoring
          </Text>
          <Text
            style={{
              color: Colors.medium,
              fontFamily: 'Inter-Regular',
              fontSize: 14,
            }}>
            Ces cartes sont optimisées pour les campagnes publicitaires sur
            Facebook et Instagram.
          </Text>
        </TouchableOpacity>
      </View>
      <Button
        style={{marginTop: 8}}
        color={Colors.brand}
        disabled={!name || !cardType}
        loading={createVirtualCard.loading}
        onPress={handlePress}>
        Suivant
      </Button>
    </ScrollView>
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
            CFA {virtualCard?.issuance_cost?.amount?.toLocaleString()}
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
            CFA {amount?.toLocaleString()}
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
            CFA {fees?.toLocaleString()}
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
            CFA{' '}
            {(
              amount +
              virtualCard?.issuance_cost?.amount +
              fees
            ).toLocaleString()}
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
      type: CardPaymentOperationType.purchase,
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {!virtualCard ? (
        <CardForm onVirtualCard={setVirtualCard} />
      ) : (
        <KashPad
          onChange={setAmount}
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
