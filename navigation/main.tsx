import React from 'react';
import Main from '../screens/kash/Kash';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Colors from '../utils/colors';
import {Image, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Cards from '../screens/cards/Cards';
import CardStack from './cards';

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
      <Tab.Screen name="Kash" component={Main} />
      <Tab.Screen name="Découverte" component={Main} />
      <Tab.Screen name="Notifs" component={Main} />
    </Tab.Navigator>
  );
}
