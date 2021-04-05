import React, {useEffect} from 'react';
import Main from '../screens/kash/Kash';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Colors from '../utils/colors';
import {Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CardStack from './cards';
import KashStack from './kash';
import Notifications from '../screens/notifications/Notifications';
import NotificationStack from './notifications';
import OneSignal from 'react-native-onesignal';
import {useNavigation} from '@react-navigation/native';

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
              // <Text></Text>
              <Ionicons name={icons[route.name]} size={size} color={color} />
            );
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.brand,
        inactiveTintColor: Colors.disabled,
      }}>
      <Tab.Screen name="Profile" component={Main} />
      <Tab.Screen name="Cartes" component={CardStack} />
      <Tab.Screen name="Kash" component={KashStack} />
      <Tab.Screen name="Découverte" component={Main} />
      <Tab.Screen name="Notifs" component={NotificationStack} />
    </Tab.Navigator>
  );
}
