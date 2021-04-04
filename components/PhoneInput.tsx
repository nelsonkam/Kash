import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import RNPhoneInput from 'react-native-phone-number-input';
import Colors from '../utils/colors';

interface Props {
  onChange: (text: string) => void;
  placeholder?: string;
}

const PhoneInput = ({onChange, placeholder = 'Numéro de tél.'}: Props) => {
  return (
    <RNPhoneInput
      defaultCode="BJ"
      onChangeFormattedText={onChange}
      containerStyle={[
        styles.input,
        {height: 50, width: '100%', marginVertical: 16},
      ]}
      textContainerStyle={{alignItems: 'center'}}
      textInputProps={{placeholder}}
      codeTextStyle={{
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        height: Platform.select({ios: 20, android: 25}),
      }}
      textInputStyle={{fontSize: 16, fontFamily: 'Inter-Regular', height: 50}}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 4,
    borderColor: Colors.border,
    borderWidth: 2,
    padding: 4,
  },
});

export default PhoneInput;
