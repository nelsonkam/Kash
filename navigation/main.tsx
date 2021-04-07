import React, {useEffect, useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Colors from '../utils/colors';
import {Image, Linking, Platform, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CardStack from './cards';
import KashStack from './kash';
import NotificationStack from './notifications';
import ProfileStack from './profile';
import Search from '../screens/Search';
import useSWRNative from '@nandorojo/swr-react-native';
import {fetcher} from '../utils/api';
import KBottomSheet from '../components/KBottomSheet';
import Button from '../components/Button';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName={'Kash'}
      screenOptions={({route}) => ({
        tabBarLabel: () => null,
        tabBarIcon: ({focused, color, size}) => {
          const icons = {
            Profile: 'person-circle',
            Cartes: 'card',
            Découverte: 'search',
            Notifs: 'notifications-circle',
          };

          if (route.name === 'Kash') {
            return focused ? (
              <Image
                style={{height: size, width: size}}
                source={require(`../assets/icon-active.png`)}
              />
            ) : (
              <Image
                style={{height: size, width: size}}
                source={require(`../assets/icon-inactive.png`)}
              />
            );
          } else {
            return (
              <Ionicons name={icons[route.name]} size={size} color={color} />
            );
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.brand,
        inactiveTintColor: Colors.disabled,
      }}>
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="Cartes" component={CardStack} />
      <Tab.Screen name="Kash" component={KashStack} />
      <Tab.Screen name="Découverte" component={Search} />
      <Tab.Screen name="Notifs" component={NotificationStack} />
    </Tab.Navigator>
  );
}
