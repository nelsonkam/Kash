import React, {useEffect, useState} from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../utils/colors';
import NumPad from '../../components/NumPad';
import Button from '../../components/Button';
import {P2PTxnType, parse} from '../../utils';
import {useNavigation} from '@react-navigation/native';
import useSWRNative from '@nandorojo/swr-react-native';
import {fetcher} from '../../utils/api';
import {SafeAreaView} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';

const VERSION = '1.0.0';

type ActionProps = {
  title: string;
  onPress: () => void;
  iconBgColor: string;
  icon: React.ReactElement;
};

const Action = ({title, onPress, iconBgColor, icon}: ActionProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={{marginHorizontal: 8}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomColor: Colors.border,
          borderBottomWidth: 1,
          paddingVertical: 16,
        }}>
        <View
          style={{
            backgroundColor: iconBgColor,
            height: 56,
            width: 56,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {icon}
        </View>
        <View
          style={{
            marginLeft: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              color: Colors.dark,
              fontSize: 18,
            }}>
            {title}
          </Text>
          <View
            style={{
              backgroundColor: Colors.grey,
              padding: 6,
              borderRadius: 8,
            }}>
            <AntDesign name={'right'} color={Colors.medium} size={20} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Kash = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white', padding: 16}}>
      <Text
        style={{
          fontFamily: 'Inter-Bold',
          color: Colors.dark,
          fontSize: 24,
          textAlign: 'center',
          marginVertical: 24,
        }}>
        Que veux tu faire?
      </Text>
      <Action
        title={'Envoyer du kash'}
        icon={<Text style={{fontSize: 25}}>💰</Text>}
        iconBgColor={'#1dd1a1'}
        onPress={() =>
          navigation.navigate('Recipients', {type: P2PTxnType.send})
        }
      />
      <Action
        title={'Demander du kash'}
        icon={<Text style={{fontSize: 25}}>🤑</Text>}
        iconBgColor={'#00a8ff'}
        onPress={() =>
          navigation.navigate('Recipients', {type: P2PTxnType.request})
        }
      />
      <Action
        title={'Créer une carte prépayée'}
        icon={<Text style={{fontSize: 25}}>💳</Text>}
        iconBgColor={'#f6e58d'}
        onPress={() =>
          navigation.navigate('Cards', {
            screen: 'NewCard',
          })
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    height: '25%',
    backgroundColor: Colors.primary,
    alignItems: 'center',
    padding: 28,
    justifyContent: 'center',
  },
  amount: {
    fontFamily: 'Inter-Semibold',
    fontSize: 44,
    color: Colors.dark,
    paddingHorizontal: 4,
  },
});

export default Kash;
