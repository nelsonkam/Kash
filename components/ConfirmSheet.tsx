import {Text, View} from 'react-native';
import Colors from '../utils/colors';
import Button from './Button';
import React, {ReactNode} from 'react';
import KBottomSheet from './KBottomSheet';

type Props = {
  renderHeading?: () => ReactNode;
  renderFooter?: () => ReactNode;
  confirmText: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  height?: number;
};

const ConfirmSheet = React.forwardRef<KBottomSheet, Props>(
  (
    {
      renderHeading,
      renderFooter,
      confirmText,
      loading,
      onConfirm,
      onCancel,
      height = 200,
    },
    ref,
  ) => {
    return (
      <KBottomSheet ref={ref} snapPoints={[height, 0]}>
        <View
          style={{
            backgroundColor: 'white',
            height: height,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          {renderHeading && renderHeading()}
          <View
            style={{
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Inter-Semibold',
                color: Colors.dark,
                fontSize: 18,
                textAlign: 'center',
              }}>
              {confirmText}
            </Text>
            {renderFooter && renderFooter()}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button
              textColor={Colors.dark}
              style={{flex: 0.8}}
              disabled={loading}
              onPress={onCancel}
              color={Colors.border}>
              Annuler
            </Button>
            <View style={{flex: 0.1}}></View>
            <Button loading={loading} onPress={onConfirm} style={{flex: 0.8}}>
              Je confirme
            </Button>
          </View>
        </View>
      </KBottomSheet>
    );
  },
);

export default ConfirmSheet;
