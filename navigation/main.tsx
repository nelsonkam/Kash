import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Colors from '../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CardStack from './cards';
import NotificationStack from './notifications';
import ProfileStack from './profile';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName={'Cards'}
      screenOptions={({route}) => ({
        tabBarLabel: () => null,
        tabBarIcon: ({focused, color, size}) => {
          const icons = {
            Profile: 'person-circle',
            Cards: 'card',
            Notifs: 'notifications-circle',
          };

          return (
            <Ionicons
              name={icons[route.name as keyof typeof icons]}
              size={size}
              color={color}
            />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.brand,
        inactiveTintColor: Colors.disabled,
      }}>
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="Cards" component={CardStack} />
      <Tab.Screen name="Notifs" component={NotificationStack} />
    </Tab.Navigator>
  );
}
