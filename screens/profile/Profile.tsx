import React, {useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
  Dimensions,
  Share,
  Platform,
} from 'react-native';
import Avatar from '../../components/Avatar';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../utils/store';
import useSWRNative from '@nandorojo/swr-react-native';
import api, {fetcher} from '../../utils/api';
import Colors from '../../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import KBottomSheet from '../../components/KBottomSheet';
import Button from '../../components/Button';
import {useAsync} from '../../utils/hooks';
import authSlice from '../../slices/auth';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';

const createFormData = (photo: any, body: any = {}) => {
  const data = new FormData();

  data.append('avatar', {
    name: photo.fileName,
    type: photo.type,
    uri: Platform.OS === 'ios' ? photo?.uri?.replace('file://', '') : photo.uri,
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
};

function Profile() {
  const navigation = useNavigation();
  const stateProfile = useSelector((s: RootState) => s.auth.profile);
  const profileQuery = useSWRNative(`/kash/profiles/current/`, fetcher);
  const generateInviteCode = useAsync(() => api.post(`/kash/invites/`));
  const inviteRef = useRef<KBottomSheet>(null);
  const profile = profileQuery.data || stateProfile || {};
  const dispatch = useDispatch();
  const uploadAvatar = useAsync(data =>
    api.post(`/kash/profiles/current/avatar/`, data, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }),
  );

  const handleChoosePhoto = () => {
    // @ts-ignore
    launchImageLibrary({noData: true}, response => {
      if (response && response.uri) {
        uploadAvatar.execute(createFormData(response)).then(() => {
          profileQuery.mutate();
        });
      }
    });
  };

  const handleLogout = () => {
    dispatch(authSlice.actions.logout(null));
  };
  return (
    <ScrollView style={{flex: 1, backgroundColor: Colors.lightGrey}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor: 'white',
          paddingVertical: 24,
          marginBottom: 12,
        }}>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            disabled={uploadAvatar.loading}
            onPress={handleChoosePhoto}
            style={{
              alignItems: 'center',
              marginBottom: 16,
              borderColor: Colors.brand,
              borderWidth: 1,
              borderRadius: 100,
              padding: 4,
            }}>
            {profile?.avatar_url ? (
              uploadAvatar.loading ? (
                <View
                  style={{
                    height: 96,
                    width: 96,
                    borderRadius: 100,
                    backgroundColor: Colors.brand,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator color={'white'} />
                </View>
              ) : (
                <Avatar size={96} profile={profile} />
              )
            ) : (
              <View
                style={{
                  height: 96,
                  width: 96,
                  borderRadius: 100,
                  backgroundColor: Colors.brand,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {uploadAvatar.loading ? (
                  <ActivityIndicator color={'white'} />
                ) : (
                  <Ionicons name={'camera'} color={'white'} size={32} />
                )}
              </View>
            )}
          </TouchableOpacity>
          <Text style={{fontFamily: 'Inter-Bold', fontSize: 20}}>
            {profile?.name}
          </Text>
          <View
            style={{
              paddingVertical: 8,
              paddingHorizontal: 24,
              backgroundColor: Colors.lightSuccess,
              marginTop: 12,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 100,
            }}>
            <Text
              style={{
                fontFamily: 'Inter-Semibold',
                fontSize: 18,
                color: Colors.brand,
              }}>
              ${profile.kashtag}
            </Text>
          </View>
        </View>
      </View>
      <View style={{backgroundColor: 'white', marginBottom: 12}}>
        <TouchableOpacity
          onPress={() => {
            generateInviteCode.execute();
            inviteRef.current?.open();
          }}
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
            <AntDesign name={'adduser'} color={Colors.brand} size={24} />
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                color: Colors.brand,
                fontSize: 16,
                marginLeft: 12,
              }}>
              Inviter mes potes
            </Text>
          </View>
          <AntDesign name={'right'} color={Colors.medium} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
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
            <AntDesign name={'user'} color={'black'} size={24} />
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                color: Colors.dark,
                fontSize: 16,
                marginLeft: 12,
              }}>
              Modifier mon profil
            </Text>
          </View>
          <AntDesign name={'right'} color={Colors.medium} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('PaymentMethods')}
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
            <AntDesign name={'wallet'} color={'black'} size={24} />
            <Text
              style={{
                fontFamily: 'Inter-Semibold',
                color: Colors.dark,
                fontSize: 16,
                marginLeft: 12,
              }}>
              Mes comptes momo
            </Text>
          </View>
          <AntDesign name={'right'} color={Colors.medium} size={20} />
        </TouchableOpacity>
        {!profileQuery.data?.phone_number && (
          <TouchableOpacity
            onPress={() => navigation.navigate('AddPhone')}
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
              <AntDesign name={'lock1'} color={Colors.warning} size={24} />
              <Text
                style={{
                  fontFamily: 'Inter-Semibold',
                  color: Colors.warning,
                  fontSize: 16,
                  marginLeft: 12,
                }}>
                Ajouter mon numéro de tél.
              </Text>
            </View>
            <AntDesign name={'right'} color={Colors.medium} size={20} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate('Security')}
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
            <Ionicons name={'lock-closed-outline'} color={'black'} size={24} />
            <Text
              style={{
                fontFamily: 'Inter-Semibold',
                color: Colors.dark,
                fontSize: 16,
                marginLeft: 12,
              }}>
              Sécurité
            </Text>
          </View>
          <AntDesign name={'right'} color={Colors.medium} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('VerifyKYC')}
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
            <AntDesign name={'Safety'} color={'black'} size={24} />
            <Text
              style={{
                fontFamily: 'Inter-Semibold',
                color: Colors.dark,
                fontSize: 16,
                marginLeft: 12,
              }}>
              Vérifier mon identité
            </Text>
          </View>
          <AntDesign name={'right'} color={Colors.medium} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              'https://www.notion.so/Centre-d-aide-464a7a6e4ebd4ba8af090e99320edbea',
            )
          }
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 16,
            paddingRight: 16,
            marginLeft: 16,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign name={'questioncircleo'} color={'black'} size={24} />
            <Text
              style={{
                fontFamily: 'Inter-Semibold',
                color: Colors.dark,
                fontSize: 16,
                marginLeft: 12,
              }}>
              Questions & Service Client
            </Text>
          </View>
          <AntDesign name={'right'} color={Colors.medium} size={20} />
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor: 'white', marginBottom: 12}}>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 16,
            paddingRight: 16,
            marginLeft: 16,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign name={'logout'} color={Colors.danger} size={24} />
            <Text
              style={{
                fontFamily: 'Inter-Semibold',
                color: Colors.danger,
                fontSize: 16,
                marginLeft: 12,
              }}>
              Me déconnecter
            </Text>
          </View>
          <AntDesign name={'right'} color={Colors.medium} size={20} />
        </TouchableOpacity>
      </View>
      <View style={{marginVertical: 36, alignItems: 'center'}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://twitter.com/kash_africa')}
            style={{marginHorizontal: 12}}>
            <Ionicons name={'logo-twitter'} color={Colors.disabled} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://instagram.com/kash_africa')}
            style={{marginHorizontal: 12}}>
            <Ionicons
              name={'logo-instagram'}
              color={Colors.disabled}
              size={24}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://fb.me/mykashafrica')}
            style={{marginHorizontal: 12}}>
            <Ionicons
              name={'logo-facebook'}
              color={Colors.disabled}
              size={24}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={{marginVertical: 12, color: Colors.disabled, fontSize: 10}}>
          © {new Date().getFullYear()} - Tous droits réservés. Futurix LLC.
        </Text>
      </View>
      <KBottomSheet ref={inviteRef} snapPoints={[420, 0]}>
        {generateInviteCode.loading && (
          <View
            style={{
              height: 360,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator color={Colors.brand} />
          </View>
        )}
        {generateInviteCode.error && (
          <View
            style={{
              backgroundColor: 'white',
              padding: 16,
              alignItems: 'center',
              justifyContent: 'center',
              height: 360,
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
              Oops, tu as atteint ta limite d'invitation pour l'instant.
            </Text>
          </View>
        )}
        {generateInviteCode.value && (
          <View
            style={{
              alignItems: 'center',
              backgroundColor: 'white',
              height: 360,
              padding: 16,
              paddingTop: 32,
              paddingBottom: 48,
            }}>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Inter-Semibold',
                  color: Colors.dark,
                  fontSize: 18,
                  textAlign: 'center',
                }}>
                Invites tes potes sur Kash
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  color: Colors.medium,
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 8,
                }}>
                Utilises ce code d'invitation pour inviter tes potes sur Kash
              </Text>
            </View>
            <View
              style={{
                borderRadius: 10,
                backgroundColor: Colors.lightGrey,
                paddingVertical: 8,
                paddingHorizontal: 24,
                marginVertical: 32,
              }}>
              <Text
                style={{
                  fontFamily: 'Inter-Bold',
                  color: Colors.dark,
                  fontSize: 24,
                  textAlign: 'center',
                }}>
                {generateInviteCode.value.data.code}{' '}
              </Text>
            </View>
            <Button
              onPress={() => {
                Share.share({
                  message: `Rejoins-moi sur Kash en téléchargeant l'appli sur: https://kashafrica.app.link/EKgDUkI0Hfb et en utilisant le code d'invitation suivant: *${generateInviteCode.value?.data.code}*`,
                });
              }}>
              Partager
            </Button>
          </View>
        )}
      </KBottomSheet>
    </ScrollView>
  );
}

export default Profile;
