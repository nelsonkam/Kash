import React from 'react';
import Colors from '../utils/colors';
import {BackButton} from './Button';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export function AuthHeaderBar(props: any) {
  return (
    <View
      style={{
        padding: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
      }}>
      <BackButton style={{flex: 2}} onPress={props.onPress} />
      <View style={{flex: 8}}>
        <Text
          style={{
            color: Colors.dark,
            fontFamily: 'Inter-Bold',
            fontSize: 18,
            textAlign: 'center',
          }}>
          {props.title}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          Linking.openURL(
            'https://www.notion.so/Centre-d-aide-464a7a6e4ebd4ba8af090e99320edbea',
          )
        }
        style={{flex: 2, flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Ionicons name={'help-circle-outline'} color={Colors.dark} size={28} />
      </TouchableOpacity>
    </View>
  );
}

export function HeaderBar(props: any) {
  return (
    <View
      style={{
        padding: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
      }}>
      <View
        style={{flex: 2, justifyContent: 'flex-start', flexDirection: 'row'}}>
        {props.renderLeftAction && props.renderLeftAction()}
        {props.canGoBack && <BackButton />}
      </View>
      <View style={{flex: 8}}>
        <Text
          style={{
            color: Colors.dark,
            fontFamily: 'Inter-Bold',
            fontSize: 18,
            textAlign: 'center',
          }}>
          {props.title}
        </Text>
      </View>
      <View style={{flex: 2, justifyContent: 'flex-end', flexDirection: 'row'}}>
        {props.renderRightAction && props.renderRightAction()}
      </View>
    </View>
  );
}
