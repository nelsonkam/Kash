import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Colors from '../utils/colors';
import {Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CardStack from './cards';
import KashStack from './kash';
import NotificationStack from './notifications';
import Search from '../screens/Search';
import ProfileStack from './profile';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
            Cards: 'card',
            Discovery: 'search',
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
          } else if (route.name === 'Invest') {
            return (
              <MaterialCommunityIcons
                name={'bitcoin'}
                size={size}
                color={color}
              />
            );
          } else {
            return (
              <Ionicons
                name={icons[route.name as keyof typeof icons]}
                size={size}
                color={color}
              />
            );
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.brand,
        inactiveTintColor: Colors.disabled,
      }}>
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="Cards" component={CardStack} />
      <Tab.Screen name="Kash" component={KashStack} />
      <Tab.Screen name="Discovery" component={Search} />
      <Tab.Screen name="Notifs" component={NotificationStack} />
    </Tab.Navigator>
  );
}
