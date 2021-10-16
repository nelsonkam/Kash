import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../utils/colors';
import React from 'react';

type Props = {
  card: any;
  onPress?: (card: any) => void;
};
const CreditCard = ({card, onPress}: Props) => {
  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(card)}
      activeOpacity={onPress ? 0.2 : 1}
      style={{marginVertical: 12}}>
      <ImageBackground
        style={{
          height: 190,
          width: '100%',
          borderRadius: 10,
          backgroundColor: Colors.disabled,
        }}
        imageStyle={{borderRadius: 10}}
        source={{
          uri: `https://kweek.sgp1.cdn.digitaloceanspaces.com/cards/bkg/${card.id % 9}.jpg`,
        }}>
        <View style={{padding: 16, justifyContent: 'space-between', flex: 1}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View
              style={{
                backgroundColor: card.is_active ? Colors.brand : Colors.warning,
                borderRadius: 100,
                paddingVertical: 4,
                paddingHorizontal: 12,
              }}>
              <Text style={{fontFamily: 'Inter-Semibold', color: 'white'}}>
                {card.is_active ? `Active` : 'Désactivée'}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 4,
                paddingVertical: 4,
                paddingHorizontal: 8,
              }}>
              <Text style={{fontFamily: 'Inter-Semibold', fontSize: 15}}>
                {card.nickname}
              </Text>
            </View>
          </View>
          <View>
            <Image
              style={{height: 44.3, width: 50}}
              source={{uri: 'https://cdn.kweek.shop/cards/card-chip.png'}}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 4,
                paddingVertical: 8,
                paddingHorizontal: 12,
              }}>
              <Text
                style={{
                  fontFamily: 'Inter-Bold',
                  fontSize: 16,
                  color: Colors.dark,
                }}>
                ****{card.last_4}
              </Text>
            </View>
            <Image
              style={{height: 32, width: 64}}
              source={{
                uri: `https://cdn.kweek.shop/cards/issuer/${card.card_type}.png`,
              }}
            />
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default CreditCard;
