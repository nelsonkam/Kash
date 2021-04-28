import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {useSelector} from 'react-redux';
import Button from '../../components/Button';
import Colors from '../../utils/colors';
import {RootState} from '../../utils/store';

export default function GetStarted() {
  const navigation = useNavigation();
  const auth = useSelector((s: RootState) => s.auth);

  const handleClick = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <View />
      <View style={{alignItems: 'center'}}>
        <Image
          style={styles.logo}
          source={require('../../assets/woodmark.png')}
        />
      </View>
      <View style={{width: '100%'}}>
        <Button
          style={{width: '100%'}}
          color="white"
          textColor="black"
          onPress={handleClick}>
          Créer un compte
        </Button>
        <Button
          onPress={() => navigation.navigate('Login')}
          style={{marginTop: 16}}
          color={Colors.brand}>
          J'ai déjà un compte
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'space-between',
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
