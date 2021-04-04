import React from 'react';
import {StyleSheet, View, Text, TextInput, TextInputProps} from 'react-native';
import Colors from '../utils/colors';

type Props = {
  label: string;
  description?: string;
  error?: string;
} & TextInputProps;

const Input = ({label, description, error, ...rest}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {!!description && <Text style={styles.description}>{description}</Text>}
      <TextInput {...rest} style={styles.input} />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderColor: Colors.border,
    fontSize: 16,
    borderWidth: 2,
    marginTop: 8,
    borderRadius: 6,
    fontFamily: 'Inter-Regular',
  },
  label: {
    fontFamily: 'Inter-Bold',
    // textTransform: "uppercase",
    color: Colors.dark,
  },
  description: {
    color: Colors.medium,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  error: {
    color: Colors.danger,
    marginTop: 2,
  },
});

export default Input;
