import React from 'react';
import {Image} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import Colors from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';

function OnboardingScreen() {
  const navigation = useNavigation();
  const handleDone = () => {
    navigation.navigate('GetStarted');
  };

  return (
    <Onboarding
      onSkip={handleDone}
      onDone={handleDone}
      nextLabel={'Suivant'}
      skipLabel={'Sauter'}
      titleStyles={{
        fontFamily: 'Inter-Bold',
      }}
      subTitleStyles={{
        fontFamily: 'Inter-Medium',
        color: 'rgba(255, 255, 255, .8)',
      }}
      pages={[
        {
          backgroundColor: Colors.brand,
          image: (
            <Image
              style={{height: 250, width: 250}}
              source={require('../../assets/send-receive-kash.png')}
            />
          ),
          title: 'Envoie et reçois du Kash instantanément.',
          subtitle:
            "Kash est le moyen le plus simple d'envoyer et de recevoir de l'argent à partir de compte momo (MTN/Moov).",
        },
        {
          backgroundColor: Colors.brand,
          image: (
            <Image
              style={{height: 250, width: 208}}
              source={require('../../assets/kash-card.png')}
            />
          ),
          title: 'Crée des cartes virtuelles illimités',
          subtitle:
            'Avec ton Momo, crée des cartes Visa virtuelles que tu peux utiliser pour des services tels que Netflix, Facebook, Paypal, etc.',
        },
      ]}
    />
  );
}

export default OnboardingScreen;
