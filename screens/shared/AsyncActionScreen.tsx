import React, {useEffect} from 'react';
import {AsyncAction} from '../../components/AsyncActionSheet';
import {useAsync} from '../../utils/hooks';
import api from '../../utils/api';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View} from 'react-native';

function AsyncActionScreen() {
  const {params} = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const {url, data, backScreen} = params;
  const action = useAsync(data => api.post(url, data));
  useEffect(() => {
    action.execute(data).finally(() => {
      setTimeout(() => {
        navigation.navigate(backScreen);
      }, 2000);
    });
  }, [params]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <AsyncAction
        asyncAction={action}
        statusTexts={{
          error: "Oops, nous n'avons pu effectuer ton opération.",
          loading: 'Un instant, ton opération est en cours...',
          success: 'Super, ton opération a été effectué',
        }}
      />
    </View>
  );
}

export default AsyncActionScreen;
