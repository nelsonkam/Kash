import {Text, View, Image} from 'react-native';
import Colors from '../utils/colors';
import React from 'react';

const Avatar = ({profile, size = 42}) => {
  return profile?.avatar_url ? (
    <Image
      style={{
        height: size,
        width: size,
        backgroundColor: Colors.disabled,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        flexShrink: 0,
        borderColor: 'white',
        borderWidth: 1,
      }}
      source={{uri: profile.avatar_url}}
    />
  ) : (
    <View
      style={{
        height: size,
        width: size,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        flexShrink: 0,
        borderColor: 'white',
        borderWidth: 1,
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: 20,
          fontFamily: 'Inter-Bold',
        }}>
        {profile?.name ? profile.name[0] : '🤑'}
      </Text>
    </View>
  );
};

export default Avatar;
