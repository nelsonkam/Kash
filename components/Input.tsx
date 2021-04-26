import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Colors from '../utils/colors';

type Props = {
  label: string;
  description?: string;
  error?: string;
} & TextInputProps;

const Input = ({label, description, error, ...rest}: Props) => {
  const [isSecure, setSecure] = useState(rest.secureTextEntry);
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={styles.label}>{label}</Text>
        {rest.secureTextEntry && (
          <TouchableOpacity onPress={() => setSecure(!isSecure)}>
            <Text style={{color: Colors.primary, fontFamily: 'Inter-Medium'}}>
              {isSecure ? 'Afficher' : 'Cacher'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {!!description && <Text style={styles.description}>{description}</Text>}
      <TextInput
        {...rest}
        style={styles.input}
        placeholderTextColor={Colors.medium}
        secureTextEntry={isSecure}
      />
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
    color: 'black',
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
