import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Colors from '../utils/colors';

type Props = {
  source: ImageSourcePropType;
  text: string;
  active: boolean;
  onPress: () => void;
  style: StyleProp<ViewStyle>;
  imageSize?: number;
};

function ButtonPicker({
  source,
  text,
  active,
  onPress,
  style,
  imageSize = 32,
}: Props) {
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
        style={{height: imageSize, width: imageSize, borderRadius: 2}}
        source={source}
      />
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
