import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Colors from '../../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

function Security() {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ConfirmPassword', {nextScreen: 'ChangePIN'})
        }
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 16,
          paddingRight: 16,
          borderBottomColor: Colors.border,
          borderBottomWidth: 1,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              color: Colors.dark,
              fontSize: 16,
              marginLeft: 12,
            }}>
            Changer mon code PIN
          </Text>
        </View>
        <AntDesign name={'right'} color={Colors.medium} size={20} />
      </TouchableOpacity>
    </View>
  );
}

export default Security;
