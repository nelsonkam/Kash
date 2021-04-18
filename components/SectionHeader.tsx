import React from 'react';
import {SectionListData, Text, View} from 'react-native';
import Colors from '../utils/colors';

type Props<T> = {
  section: SectionListData<T>;
};

function SectionHeader<T>({section}: Props<T>) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 16,
      }}>
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 50,
          backgroundColor: Colors.brand,
        }}>
        <Text
          style={{
            color: 'white',
            fontFamily: 'Inter-Semibold',
            fontSize: 16,
            textTransform: 'uppercase',
          }}>
          {section.title}
        </Text>
      </View>
      <View style={{height: 2, flex: 1, backgroundColor: Colors.brand}} />
    </View>
  );
}

export default SectionHeader;
