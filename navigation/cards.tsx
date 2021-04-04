import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Cards from '../screens/cards/Cards';
import NewCard from '../screens/cards/NewCard';
import Colors from '../utils/colors';
import CardDetail from '../screens/cards/CardDetail';
import EditNickname from '../screens/cards/EditNickname';

const Stack = createStackNavigator();

export default function CardStack() {
  return (
    <Stack.Navigator initialRouteName="Cards">
      <Stack.Screen
        options={{title: 'Mes Cartes'}}
        name="Cards"
        component={Cards}
      />
      <Stack.Screen
        options={{title: 'Nouvelle Carte'}}
        name="NewCard"
        component={NewCard}
      />
      <Stack.Screen
        options={{title: ''}}
        name="CardDetail"
        component={CardDetail}
      />
      <Stack.Screen
        options={{title: 'Changer le nom'}}
        name="EditNickname"
        component={EditNickname}
      />
    </Stack.Navigator>
  );
}
