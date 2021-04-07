import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../utils/colors';
import {Text, View} from 'react-native';
import Button from '../components/Button';

function Search(props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <Ionicons name="search" size={72} color={Colors.disabled} />

      <View>
        <Button
          disabled={true}
          color={Colors.brand}
          style={{marginTop: 32, paddingHorizontal: 32}}>
          Bientôt disponible
        </Button>
      </View>
    </View>
  );
}

export default Search;
