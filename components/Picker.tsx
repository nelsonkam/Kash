import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../utils/colors';

function ButtonPicker({source, text, active, onPress, style}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderColor: active ? Colors.brand : Colors.border,
        borderWidth: 2,
        borderRadius: 4,
        padding: 6,
        flexDirection: 'row',
        alignItems: 'center',
        ...style,
      }}>
      <Image
        style={{height: 32, width: 32, borderRadius: 2}}
        source={source}></Image>
      <Text
        style={{
          fontFamily: 'Inter-Semibold',
          fontSize: 16,
          marginLeft: 12,
          color: Colors.dark,
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export default ButtonPicker;
