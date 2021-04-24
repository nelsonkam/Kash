import React, {useEffect} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../utils/colors';
import KBottomSheet from './KBottomSheet';
import {AsyncHook} from '../utils/hooks';

type Props<T> = {
  statusTexts: {
    error: string;
    loading: string;
    success: string;
  };
  asyncAction: AsyncHook<T>;
};
export function AsyncAction<T>({statusTexts, asyncAction}: Props<T>) {
  let content;
  if (asyncAction.error) {
    content = (
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          height: 320,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AntDesign name={'closecircle'} color={Colors.danger} size={56} />
        <Text
          style={{
            fontFamily: 'Inter-Semibold',
            color: Colors.dark,
            marginVertical: 24,
            fontSize: 16,
            textAlign: 'center',
          }}>
          {statusTexts.error}
        </Text>
      </View>
    );
  } else if (asyncAction.value) {
    content = (
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          height: 320,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AntDesign name={'checkcircle'} color={Colors.success} size={56} />
        <Text
          style={{
            fontFamily: 'Inter-Semibold',
            color: Colors.dark,
            marginVertical: 24,
            fontSize: 16,
            textAlign: 'center',
          }}>
          {statusTexts.success}
        </Text>
      </View>
    );
  } else {
    content = (
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          height: 320,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size={'large'} color={Colors.brand} />
        <Text
          style={{
            fontFamily: 'Inter-Semibold',
            color: Colors.dark,
            marginVertical: 24,
            fontSize: 16,
            textAlign: 'center',
          }}>
          {statusTexts.loading}
        </Text>
      </View>
    );
  }
  return content;
}
const AsyncActionSheet = React.forwardRef<KBottomSheet, Props<any>>(
  (props, ref) => {
    return (
      <KBottomSheet ref={ref} snapPoints={[320, 0]}>
        <AsyncAction {...props} />
      </KBottomSheet>
    );
  },
);

export default AsyncActionSheet;
