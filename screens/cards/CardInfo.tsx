import React from 'react';
import {ScrollView, Text, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import Colors from '../../utils/colors';
import {spaceFour} from '../../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useRoute} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import toast from '../../utils/toast';
import useSWRNative from '@nandorojo/swr-react-native';
import { fetcher } from '../../utils/api';
import Button from '../../components/Button';

function CardInfo() {
  const {params} = useRoute();
  const cardQuery = useSWRNative(`/kash/virtual-cards/${params.card.id}/`, fetcher);
  const card = cardQuery.data || params.card;

  const handleCopy = str => {
    Clipboard.setString(str);
    toast.success('', 'Copié');
  };

  if (cardQuery.error) {
    return <View style={{flex: 1, backgroundColor: "white", alignItems: "center", justifyContent:  "center"}}>
    <Button style={{width: "inherit"}}>Rafraîchir</Button>
  </View>
  }

  if (!card.card_details.card_pan) {
    return <View style={{flex: 1, backgroundColor: "white", alignItems: "center", justifyContent:  "center"}}>
      <ActivityIndicator size={'large'} />
    </View>
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <TouchableOpacity
        onPress={() => handleCopy(card.card_details.name_on_card)}
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        }}>
        <Text
          style={{
            fontFamily: 'Inter-Semibold',
            fontSize: 16,
            color: Colors.medium,
          }}>
          Nom sur la carte
        </Text>
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: 18,
            color: Colors.dark,
            marginTop: 8,
          }}>
          {card.card_details.name_on_card}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleCopy(card.card_details.card_pan)}
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        }}>
        <Text
          style={{
            fontFamily: 'Inter-Semibold',
            fontSize: 16,
            color: Colors.medium,
          }}>
          Numéro de la carte
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: 18,
              color: Colors.dark,
            }}>
            {spaceFour(card.card_details.card_pan)}
          </Text>
          <TouchableOpacity
            onPress={() => handleCopy(card.card_details.card_pan)}>
            <Ionicons name={'copy-outline'} size={24} color={Colors.brand} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          onPress={() =>
            handleCopy(`${card.card_details.expiration.split('-')[1]}/
            ${card.card_details.expiration.split('-')[0]}`)
          }
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: Colors.border,
            flexGrow: 1,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              fontSize: 16,
              color: Colors.medium,
            }}>
            Expiration
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: 18,
              color: Colors.dark,
              marginTop: 8,
            }}>
            {card.card_details.expiration.split('-')[1]}/
            {card.card_details.expiration.split('-')[0]}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            handleCopy(card.card_details.cvv || card.card_details.cvc)
          }
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: Colors.border,
            borderLeftColor: Colors.border,
            borderLeftWidth: 1,
            flexGrow: 1,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              fontSize: 16,
              color: Colors.medium,
            }}>
            CVV/CVC
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: 18,
              color: Colors.dark,
              marginTop: 8,
            }}>
            {card.card_details.cvv || card.card_details.cvc}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => handleCopy(card.card_details.address_1)}
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        }}>
        <Text
          style={{
            fontFamily: 'Inter-Semibold',
            fontSize: 16,
            color: Colors.medium,
          }}>
          Adresse de facturation
        </Text>
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: 18,
            color: Colors.dark,
            marginTop: 8,
          }}>
          {card.card_details.address_1}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          onPress={() => handleCopy(card.card_details.city)}
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: Colors.border,
            flexGrow: 1,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              fontSize: 16,
              color: Colors.medium,
            }}>
            Ville
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: 18,
              color: Colors.dark,
              marginTop: 8,
            }}>
            {card.card_details.city}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleCopy(card.card_details.state)}
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            borderBottomColor: Colors.border,
            borderLeftColor: Colors.border,
            flexGrow: 1,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              fontSize: 16,
              color: Colors.medium,
            }}>
            État/Province
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: 18,
              color: Colors.dark,
              marginTop: 8,
            }}>
            {card.card_details.state}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => handleCopy(card.card_details.zip_code)}
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        }}>
        <Text
          style={{
            fontFamily: 'Inter-Semibold',
            fontSize: 16,
            color: Colors.medium,
          }}>
          Code Postale
        </Text>
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: 18,
            color: Colors.dark,
            marginTop: 8,
          }}>
          {card.card_details.zip_code}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default CardInfo;
