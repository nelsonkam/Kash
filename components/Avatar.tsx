import {Text, View, Image} from 'react-native';
import Colors from '../utils/colors';
import React from 'react';

type AvatarProps = {
  profile: any;
  size?: number;
};

const Avatar = ({profile, size = 42}: AvatarProps) => {
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
      source={{uri: profile?.avatar_url}}
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

type AvatarsProps = {
  profiles: any[];
  size?: number;
};

export const Avatars = ({profiles, size = 42}: AvatarsProps) => {
  const visibleProfiles = profiles.slice(0, 5);
  const computeStyle = (index: number) => {
    const halfwayPoint = Math.floor(visibleProfiles.length / 2);
    if (visibleProfiles.length % 2 !== 0) {
      if (index < halfwayPoint) {
        return {
          left: (halfwayPoint - index) * 32,
        };
      } else if (index > halfwayPoint) {
        return {
          right: (index - halfwayPoint) * 32,
        };
      } else {
        return {
          right: 0,
        };
      }
    } else {
      if (index < halfwayPoint - 1) {
        return {
          left: (halfwayPoint - index) * 24,
        };
      } else if (index === halfwayPoint - 1) {
        return {
          left: 16,
        };
      } else if (index === halfwayPoint) {
        return {
          right: 16,
        };
      } else if (index > halfwayPoint) {
        return {
          right: (index - halfwayPoint) * 48,
        };
      } else {
        return {
          right: 0,
        };
      }
    }
  };
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          position: 'relative',
          width: 1,
        }}>
        {visibleProfiles.slice(0, 5).map((profile: any, index: number) => (
          <View
            style={{
              position: profiles.length > 1 ? 'relative' : 'relative',
              marginBottom: 12,
              top: 0,
              ...computeStyle(index),
            }}>
            <Avatar profile={profile} size={size} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default Avatar;
