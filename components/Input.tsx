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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {moderateScale} from 'react-native-size-matters';
import {RFValue} from 'react-native-responsive-fontsize';

type Props = {
  label?: string;
  description?: string;
  error?: string;
  touched?: boolean;
} & TextInputProps;

const Input = ({label, description, error, touched, ...rest}: Props) => {
  const [isSecure, setSecure] = useState(rest.secureTextEntry);
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
      {!!description && <Text style={styles.description}>{description}</Text>}
      <View style={styles.input}>
        <TextInput
          {...rest}
          style={styles.textInput}
          placeholderTextColor={Colors.medium}
          secureTextEntry={isSecure}
        />
        {rest.secureTextEntry && (
          <TouchableOpacity onPress={() => setSecure(!isSecure)}>
            <Ionicons
              name={!isSecure ? 'eye-outline' : 'eye-off-outline'}
              color={Colors.dark}
              size={moderateScale(28)}
            />
          </TouchableOpacity>
        )}
      </View>

      {!!error && touched && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export const PinInput = ({
  filled,
  error,
}: {
  filled: string;
  error?: boolean;
}) => {
  const color = filled ? (error ? 'red' : 'black') : 'white';
  return (
    <View
      style={{
        height: moderateScale(16),
        width: moderateScale(16),
        backgroundColor: color,
        borderRadius: 24,
        borderColor: error ? 'red' : 'black',
        borderWidth: 1,
        marginHorizontal: moderateScale(12),
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: moderateScale(10),
  },
  input: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(14),
    borderColor: Colors.border,
    color: 'black',
    fontSize: RFValue(16),
    borderWidth: moderateScale(2),
    marginTop: moderateScale(8),
    borderRadius: 6,
    fontFamily: 'Inter-Regular',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    color: 'black',
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
    fontSize: RFValue(12),
    marginTop: moderateScale(4),
  },
  error: {
    color: Colors.danger,
    marginTop: moderateScale(2),
  },
});

export default Input;
