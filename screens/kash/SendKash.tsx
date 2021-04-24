import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import KashPad from '../../components/KashPad';
import {useNavigation, useRoute} from '@react-navigation/native';
import {fetcher} from '../../utils/api';
import Colors from '../../utils/colors';
import useSWRNative from '@nandorojo/swr-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button';
import {P2PTxnType} from '../../utils';

type ChooseGroupMode = {
  amount: number;
  recipients: any[];
  onGroupModeSelected: (groupMode: string) => void;
};

const ChooseGroupMode = ({
  amount,
  recipients,
  onGroupModeSelected,
}: ChooseGroupMode) => {
  const [groupMode, setGroupMode] = useState<string | null>(null);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
        paddingTop: 32,
      }}>
      <Text
        style={{
          fontFamily: 'Inter-Bold',
          textAlign: 'center',
          fontSize: 18,
          marginTop: 12,
          color: Colors.dark,
        }}>
        Envoyer à plusieurs personnes
      </Text>
      <Text
        style={{
          fontFamily: 'Inter-Semibold',
          textAlign: 'center',
          fontSize: 16,
          marginTop: 16,
          color: Colors.medium,
        }}>
        Choisis un mode d'envoi
      </Text>

      <View style={{marginTop: 24}}>
        <TouchableOpacity
          onPress={() => setGroupMode('normal')}
          activeOpacity={0.6}
          style={{
            flexDirection: 'row',
            padding: 12,
            paddingVertical: 12,
            borderColor: Colors.border,
            borderWidth: 2,
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 8,
          }}>
          <View>
            <Text
              style={{
                fontFamily: 'Inter-Bold',
                fontSize: 17,
              }}>
              Normal 💰 –{'  '}CFA {amount.toLocaleString()}
            </Text>
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                color: Colors.medium,
                fontSize: 14,
                marginTop: 6,
              }}>
              Chaque personne reçoit CFA{' '}
              {Math.floor(amount / recipients.length).toLocaleString()}
            </Text>
          </View>
          <Ionicons
            name={
              groupMode === 'normal' ? 'checkmark-circle' : 'ellipse-outline'
            }
            color={groupMode === 'normal' ? Colors.brand : Colors.medium}
            size={28}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGroupMode('pacha')}
          activeOpacity={0.6}
          style={{
            flexDirection: 'row',
            padding: 12,
            paddingVertical: 12,
            borderColor: Colors.border,
            borderWidth: 2,
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 8,
          }}>
          <View>
            <Text
              style={{
                fontFamily: 'Inter-Bold',
                fontSize: 17,
              }}>
              Pacha 🤑 –{'  '}CFA{' '}
              {(amount * recipients.length).toLocaleString()}
            </Text>
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                color: Colors.medium,
                fontSize: 14,
                marginTop: 6,
              }}>
              Chaque personne reçoit CFA {amount.toLocaleString()}
            </Text>
          </View>
          <Ionicons
            name={
              groupMode === 'pacha' ? 'checkmark-circle' : 'ellipse-outline'
            }
            color={groupMode === 'pacha' ? Colors.brand : Colors.medium}
            size={28}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGroupMode('faro')}
          activeOpacity={0.6}
          style={{
            flexDirection: 'row',
            padding: 12,
            paddingVertical: 12,
            borderColor: Colors.border,
            borderWidth: 2,
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 8,
          }}>
          <View>
            <Text
              style={{
                fontFamily: 'Inter-Bold',
                fontSize: 17,
              }}>
              Faro Faro 💸 –{'  '}CFA {amount.toLocaleString()}
            </Text>
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                color: Colors.medium,
                fontSize: 14,
                marginTop: 6,
              }}>
              Chaque personne reçoit une somme aléatoire
            </Text>
          </View>
          <View style={{width: 28, flexShrink: 0}}>
            <Ionicons
              name={
                groupMode === 'faro' ? 'checkmark-circle' : 'ellipse-outline'
              }
              color={groupMode === 'faro' ? Colors.brand : Colors.medium}
              size={28}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 16}}>
        <Button
          disabled={!groupMode}
          onPress={() => onGroupModeSelected(groupMode!)}>
          Suivant
        </Button>
      </View>
    </View>
  );
};

function SendKash() {
  const {params} = useRoute();
  // @ts-ignore
  const {recipients, type} = params;
  const navigation = useNavigation();
  const profileQuery = useSWRNative(`/kash/profiles/current/`, fetcher);
  const [isGroupModeVisible, showGroupMode] = useState(false);
  const [amount, setAmount] = useState(0);
  const title = type === P2PTxnType.send ? 'Envoyer' : 'Demander';

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title,
    });
  }, [navigation]);

  const handleNext = (amount: number) => {
    setAmount(amount);
    if (type === P2PTxnType.request || recipients.length === 1) {
      navigation.navigate('KashRecap', {type, recipients, amount});
    } else {
      showGroupMode(true);
    }
  };

  const handleGroupNext = (groupMode: string) => {
    navigation.navigate('KashRecap', {type, recipients, amount, groupMode});
  };
  const limits = profileQuery.data?.limits
    ? profileQuery.data?.limits.sendkash
    : {min: 25};

  if (isGroupModeVisible) {
    return (
      <ChooseGroupMode
        amount={amount}
        recipients={recipients}
        onGroupModeSelected={handleGroupNext}
      />
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <KashPad
        buttonText={{cancel: 'Annuler', next: title}}
        currency={'CFA '}
        limits={limits}
        onNext={handleNext}
      />
    </View>
  );
}

export default SendKash;
