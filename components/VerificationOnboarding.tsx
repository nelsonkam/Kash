import {Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../utils/colors';
import Button from './Button';
import React from 'react';

export default function VerificationOnboarding({onNext}: {onNext: () => void}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <MaterialCommunityIcons name={'shield'} color={Colors.brand} size={96} />
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Inter-Medium',
          fontSize: 18,
          marginVertical: 20,
          marginHorizontal: 32,
          color: Colors.dark,
        }}>
        Avant d'éffectuer certaines actions, tu dois vérifier ton identité. La
        vérification de ton identité est requise afin de sécuriser ton compte et
        de protéger les utilisateurs de Kash.
      </Text>

      <View style={{marginTop: 24}}>
        <Button onPress={onNext} style={{paddingHorizontal: 32}}>
          Continuer
        </Button>
      </View>
    </View>
  );
}
