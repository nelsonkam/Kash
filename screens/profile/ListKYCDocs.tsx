import React, {useState} from 'react';
import {View, TouchableOpacity, Text, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../utils/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import useSWRNative from '@nandorojo/swr-react-native';
import {fetcher} from '../../utils/api';

function VerificationOnboarding({onNext}: {onNext: () => void}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <MaterialCommunityIcons name={'shield'} color={Colors.brand} size={96} />
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Inter-Medium',
          fontSize: 18,
          marginVertical: 20,
          marginHorizontal: 32,
          color: Colors.dark,
        }}>
        Avant d'éffectuer certaines actions, tu dois vérifier ton identité. La
        vérification de ton identité est requise afin de sécuriser ton compte et
        de protéger les utilisateurs de Kash.
      </Text>

      <View style={{marginTop: 24}}>
        <Button onPress={onNext} style={{paddingHorizontal: 32}}>
          Continuer
        </Button>
      </View>
    </View>
  );
}

function ListKYCDocs() {
  const navigation = useNavigation();
  const [isOnboardingVisible, showOnboarding] = useState(true);
  const kycDocsQuery = useSWRNative(`/kash/kyc/`, fetcher);

  if (isOnboardingVisible) {
    return <VerificationOnboarding onNext={() => showOnboarding(false)} />;
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={kycDocsQuery.data}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('VerifyKYCDoc')}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 16,
              paddingRight: 16,
              marginLeft: 16,
              borderBottomColor: Colors.border,
              borderBottomWidth: 1,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  color: Colors.dark,
                  fontSize: 16,
                  marginLeft: 12,
                }}>
                {item.formatted?.name}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                color: item.formatted?.status_color,
                fontSize: 16,
                marginLeft: 12,
              }}>
              {item.formatted?.status_text}
            </Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity
            onPress={() => navigation.navigate('VerifyKYCDoc')}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 16,
              paddingRight: 16,
              marginLeft: 16,
              borderBottomColor: Colors.border,
              borderBottomWidth: 1,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  color: Colors.dark,
                  fontSize: 16,
                  marginLeft: 12,
                }}>
                Ajouter un document de vérification
              </Text>
            </View>
            <AntDesign name={'right'} color={Colors.medium} size={20} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default ListKYCDocs;
