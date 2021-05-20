import React from 'react';
import {Text, View} from 'react-native';
import useSWRNative from '@nandorojo/swr-react-native';
import {useRoute} from '@react-navigation/native';
import {fetcher} from '../../utils/api';
import Colors from '../../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Constants} from '../../utils';

function TransactionDetail() {
  const {params} = useRoute();
  // @ts-ignore
  const {id} = params;
  const transactionQuery = useSWRNative(
    `/kash/wallets/current/transactions/${id}/`,
    fetcher,
  );
  const transaction = transactionQuery.data || {};
  const amount: number = parseFloat(transaction.amount || 0);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontFamily: 'Inter-Bold',
          fontSize: 28,
          color: Colors.dark,
          marginTop: 24,
          marginBottom: 12,
        }}>
        CFA {Math.floor(amount).toLocaleString()}
      </Text>

      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 8,
          marginBottom: 24,
        }}>
        <Ionicons
          name={transaction.successful ? 'checkmark-circle' : 'close-circle'}
          color={transaction.successful ? Colors.brand : Colors.danger}
          size={24}
        />
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Inter-Regular',
            color: transaction.successful ? Colors.brand : Colors.danger,
            marginLeft: 6,
          }}>
          {transaction.successful
            ? transaction.type === 'debit'
              ? 'Envoyé'
              : 'Reçu'
            : 'Échoué'}
        </Text>
      </View>
      <View
        style={{
          borderWidth: 2,
          borderColor: Colors.border,
          borderRadius: 6,
          width: '95%',
          marginTop: 8,
          marginVertical: 16,
          marginHorizontal: 16,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: Colors.border,
          }}>
          <Text
            style={{
              color: Colors.medium,
              fontSize: 16,
              fontFamily: 'Inter-Medium',
            }}>
            {transaction.type === 'debit' ? 'Envoyé à' : 'Reçu de'}
          </Text>
          <Text
            style={{
              color: Colors.dark,
              fontSize: 16,
              fontFamily: 'Inter-Medium',
            }}>
            {transaction.source}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: Colors.border,
          }}>
          <Text
            style={{
              color: Colors.medium,
              fontSize: 16,
              fontFamily: 'Inter-Medium',
            }}>
            Date & Heure
          </Text>
          <Text
            style={{
              color: Colors.dark,
              fontSize: 16,
              fontFamily: 'Inter-Medium',
            }}>
            {new Date(transaction.created_at).toLocaleString()}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
          }}>
          <Text
            style={{
              color: Colors.medium,
              fontSize: 16,
              fontFamily: 'Inter-Medium',
            }}>
            Note
          </Text>
          <Text
            style={{
              color: transaction.memo ? Colors.dark : Colors.disabled,
              fontSize: 16,
              fontFamily: 'Inter-Medium',
            }}>
            {transaction.memo || 'Aucune note'}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default TransactionDetail;
