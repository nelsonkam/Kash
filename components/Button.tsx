import React from 'react';
import {ActivityIndicator, TouchableOpacityProps} from 'react-native';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import Colors from '../utils/colors';

type Props = {
  onPress?: () => void;
  children: React.ReactNode;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  loading?: boolean;
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
          }}>
          {props.children}
        </Text>
      ) : (
        <ActivityIndicator color={props.textColor || 'white'} />
      )}
    </TouchableOpacity>
  );
}

export function NextButton(props) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.primary,
        paddingHorizontal: 18,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        borderRadius: 500,
        bottom: 8,
        right: 8,
      }}>
      <Text
        style={{
          color: 'white',
          fontFamily: 'Inter-Bold',
          marginRight: 6,
          fontSize: 16,
        }}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}

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
