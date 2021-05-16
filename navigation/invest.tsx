import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Invest from '../screens/invest/Invest';

const Stack = createStackNavigator();

function InvestStack() {
  return (
    <Stack.Navigator initialRouteName="Investments">
      <Stack.Screen
        options={{headerShown: false}}
        name="Investments"
        component={Invest}
      />
    </Stack.Navigator>
  );
}

export default InvestStack;
