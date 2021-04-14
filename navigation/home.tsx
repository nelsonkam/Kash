import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileStack from './profile';
import Home from '../screens/home/Home';

const Stack = createStackNavigator();

function HomeStack(props) {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        options={{headerShown: false}}
        name="Home"
        component={Home}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Profile"
        component={ProfileStack}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
