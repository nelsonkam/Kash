import React from 'react';
import {View, StyleSheet, Image, Text, Button} from 'react-native';
import Colors from '../utils/colors';

const Splash = () => {
  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Image style={styles.logo} source={require('../assets/woodmark.png')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingVertical: 48,
  },
  logo: {
    height: 48,
    width: 173,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginVertical: 12,
  },
  button: {
    backgroundColor: 'white',
    color: 'black',
    width: '100%',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    maxWidth: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Splash;
