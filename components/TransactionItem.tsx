import {Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../utils/colors';
import React from 'react';

const TransactionItem = ({transaction}: {transaction: any}) => {
  const isDebit = transaction.type === 'debit';
  let iconName = isDebit ? 'arrow-top-right' : 'arrow-bottom-left';
  iconName = !transaction.successful ? 'close' : iconName;
  iconName = transaction.status === 'refunded' ? 'cash-refund' : iconName;
  return (
    <View
      style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 4}}>
      <View
        style={{
          height: 48,
          width: 48,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          backgroundColor: isDebit
            ? 'rgba(244, 84, 29, 0.05)'
            : 'rgba(26, 206, 76, 0.05)',
        }}>
        <MaterialCommunityIcons
          size={24}
          name={iconName}
          color={isDebit ? Colors.danger : Colors.success}
        />
      </View>
      <View
        style={{
          marginLeft: 12,
          flex: 1,
        }}>
        <View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <Text
              style={{
                fontFamily: 'Inter-Semibold',
                fontSize: 16,
                color: Colors.dark,
              }}>
              {transaction.source}
            </Text>
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                fontSize: 14,
                color: isDebit ? Colors.danger : Colors.brand,
              }}>
              ${parseFloat(transaction.amount).toLocaleString()}
            </Text>
          </View>
          {transaction.memo && (
            <Text
              style={{
                marginTop: 8,
                color: Colors.medium,
                fontFamily: 'Inter-Regular',
              }}>
              {transaction.memo}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default TransactionItem;
