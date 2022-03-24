import React from 'react';
import {ActivityIndicator, Platform, TouchableOpacityProps} from 'react-native';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import Colors from '../utils/colors';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  onPress?: () => void;
  children: React.ReactNode;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  loading?: boolean;
  underline?: boolean;
} & TouchableOpacityProps;

function Button(props: Props) {
  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.button,
        {
          backgroundColor: props.disabled
            ? Colors.disabled
            : props.color || Colors.brand,
        },
        props.style,
      ]}
      onPress={props.onPress}
      disabled={props.loading || props.disabled}>
      {!props.loading ? (
        <Text
          style={{
            fontFamily: 'Inter-Bold',
            color: props.disabled ? 'white' : props.textColor || 'white',
            fontSize: 16,
            textAlign: 'center',
            textDecorationLine: props.underline ? 'underline' : 'none',
          }}>
          {props.children}
        </Text>
      ) : (
        <ActivityIndicator color={props.textColor || 'white'} />
      )}
    </TouchableOpacity>
  );
}

type BackButtonProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export const BackButton = ({onPress, style}: BackButtonProps) => {
  const navigation = useNavigation();
  const handleBack = () => navigation.goBack();
  return (
    <TouchableOpacity onPress={onPress || handleBack} style={style}>
      {Platform.OS === 'ios' ? (
        <Ionicons name={'chevron-back'} color={'black'} size={28} />
      ) : (
        <Ionicons name={'arrow-back'} color={'black'} size={28} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    color: 'black',
    width: '100%',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;
