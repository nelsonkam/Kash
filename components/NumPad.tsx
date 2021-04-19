import * as React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../utils/colors';

const styles = StyleSheet.create({
  cell: {
    width: `${100 / 3}%`,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  cellRow: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
  },
  cellText: {
    color: Colors.medium,
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
  },
});

const NumPad = ({onChange}: {onChange: (value: string) => void}) => {
  const size = Dimensions.get('window').width - 32;
  const handleInput = (value: string) => {
    onChange(value);
  };
  return (
    <View style={{width: '100%', alignItems: 'center'}}>
      <View style={{width: size, height: size * 0.8}}>
        <View style={styles.cellRow}>
          <TouchableOpacity
            onPress={() => handleInput('1')}
            style={styles.cell}>
            <Text style={styles.cellText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInput('2')}
            style={styles.cell}>
            <Text style={styles.cellText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInput('3')}
            style={styles.cell}>
            <Text style={styles.cellText}>3</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cellRow}>
          <TouchableOpacity
            onPress={() => handleInput('4')}
            style={styles.cell}>
            <Text style={styles.cellText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInput('5')}
            style={styles.cell}>
            <Text style={styles.cellText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInput('6')}
            style={styles.cell}>
            <Text style={styles.cellText}>6</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cellRow}>
          <TouchableOpacity
            onPress={() => handleInput('7')}
            style={styles.cell}>
            <Text style={styles.cellText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInput('8')}
            style={styles.cell}>
            <Text style={styles.cellText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInput('9')}
            style={styles.cell}>
            <Text style={styles.cellText}>9</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cellRow}>
          <TouchableOpacity
            onPress={() => handleInput('00')}
            style={styles.cell}>
            <Text style={styles.cellText}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInput('0')}
            style={styles.cell}>
            <Text style={styles.cellText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInput('backspace')}
            style={styles.cell}>
            <Ionicons name={'backspace'} size={26} color={Colors.medium} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default NumPad;
