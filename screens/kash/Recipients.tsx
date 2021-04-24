import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Contacts from 'react-native-contacts';
import {useAsync} from '../../utils/hooks';
import api from '../../utils/api';
import Avatar from '../../components/Avatar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, useRoute} from '@react-navigation/native';
import {P2PTxnType} from '../../utils';
import {BackButton} from '../../components/Button';

function Recipients() {
  const [search, setSearch] = useState('');
  const {params} = useRoute();
  // @ts-ignore
  const {type} = params;
  const [areContactsVisible, showContacts] = useState(true);
  const navigation = useNavigation();
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const syncProfileContacts = useAsync(data =>
    api.post(`/kash/profiles/current/contacts/`, data),
  );
  const searchContacts = useAsync(search =>
    api.post(`/kash/profiles/current/search/contacts/`, {search}),
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearching(true);
      searchContacts
        .execute(search)
        .then(res => {
          setResults(res.data);
        })
        .finally(() => setSearching(false));
    }, 400);
  }, [search]);
  const syncContacts = async () => {
    const contacts = await (Platform.OS === 'android'
      ? PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Accès à tes contacts',
            message:
              'Nous avons besoin de ta permission pour lire ta liste de contacts afin de retrouver tes potes sur Kash.',
            buttonPositive: 'Accepter',
            buttonNegative: 'Annuler',
          },
        ).then(Contacts.getAllWithoutPhotos)
      : Contacts.getAllWithoutPhotos());

    const phoneNumbers = contacts
      .map(i => {
        return i.phoneNumbers.reduce(
          (a: string[], b) => a.concat([b.number]),
          [],
        );
      })
      .reduce((a, b) => a.concat(b), [])
      .map(number => number.replace(/[^\d\+]/g, ''));

    syncProfileContacts.execute({contacts: phoneNumbers});
  };
  useEffect(() => {
    syncContacts();
  }, []);
  const handleProfileClick = (profile: any) => {
    if (!selected.map(i => i.kashtag).includes(profile.kashtag)) {
      setSelected([profile, ...selected]);
    }
  };

  const handleRemove = (profile: any) => {
    setSelected(selected.filter(item => item.kashtag !== profile.kashtag));
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{padding: 16, flexDirection: 'row', alignItems: 'center'}}>
        <BackButton style={{flex: 2}} />
        <View style={{flex: 8}}>
          <Text
            style={{
              color: Colors.dark,
              fontFamily: 'Inter-Bold',
              fontSize: 18,
              textAlign: 'center',
            }}>
            {type === P2PTxnType.request ? 'Demander' : 'Envoyer'}
          </Text>
        </View>
        <View style={{flex: 2}} />
      </View>
      <View style={{padding: 16}}>
        <View
          style={{
            backgroundColor: Colors.grey,
            flexDirection: 'row',
            borderRadius: 8,
          }}>
          <View style={{padding: 10}}>
            <Ionicons name={'search'} size={24} color={Colors.dark} />
          </View>
          <TextInput
            style={{
              fontSize: 16,
              paddingVertical: 10,
              flex: 1,
              color: 'black',
            }}
            onFocus={() => showContacts(false)}
            onBlur={() => showContacts(true)}
            value={search}
            onChangeText={text => setSearch(text)}
            placeholderTextColor={Colors.medium}
            placeholder={'Rechercher par nom ou $kashtag'}
          />
        </View>
      </View>
      {selected.length > 0 && (
        <View style={{padding: 16}}>
          <View>
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                color: Colors.medium,
                fontSize: 17,
              }}>
              Sélectionnés
            </Text>
          </View>
          <FlatList
            data={selected}
            horizontal={true}
            keyExtractor={item => item.kashtag}
            renderItem={({item}) => (
              <View
                style={{
                  alignItems: 'center',
                  paddingTop: 16,
                  paddingRight: 16,
                  maxWidth: 96,
                  position: 'relative',
                }}>
                <Avatar size={56} profile={item} />
                <TouchableOpacity
                  onPress={() => handleRemove(item)}
                  style={{
                    height: 26,
                    width: 26,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Colors.danger,
                    position: 'absolute',
                    right: 12,
                    top: 8,
                  }}>
                  <Ionicons size={20} name={'close'} color={'white'} />
                </TouchableOpacity>

                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Inter-Regular',
                    color: Colors.medium,
                    marginTop: 4,
                    textAlign: 'center',
                  }}>
                  ${item.kashtag}
                </Text>
              </View>
            )}
          />
        </View>
      )}
      {!!search && results.length === 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 24,
            marginVertical: 56,
          }}>
          <Ionicons name="search" size={64} color={Colors.disabled} />
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              color: Colors.disabled,
              marginTop: 16,
              textAlign: 'center',
            }}>
            Aucun résultat retrouvé
          </Text>
        </View>
      )}
      {!!search && (
        <View>
          {results.length > 0 && (
            <View style={{padding: 16, paddingBottom: 4}}>
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  color: Colors.medium,
                  fontSize: 17,
                }}>
                Résultats
              </Text>
            </View>
          )}
          <FlatList
            refreshing={searching}
            data={results}
            keyExtractor={item => item.kashtag}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: Colors.grey,
                  width: '100%',
                }}
              />
            )}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => handleProfileClick(item)}
                style={{
                  padding: 12,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Avatar size={48} profile={item} />
                <View
                  style={{
                    marginLeft: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flex: 1,
                  }}>
                  <View>
                    <Text style={{fontFamily: 'Inter-Bold', fontSize: 16}}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Inter-Regular',
                        color: Colors.medium,
                        marginTop: 4,
                      }}>
                      ${item.kashtag}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {!search && (
        <View>
          <View style={{padding: 16, paddingBottom: 4}}>
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                color: Colors.medium,
                fontSize: 17,
              }}>
              Mes contacts
            </Text>
          </View>

          <FlatList
            refreshing={syncProfileContacts.loading}
            onRefresh={syncContacts}
            data={syncProfileContacts.value?.data}
            keyExtractor={item => item.kashtag}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: Colors.grey,
                  width: '100%',
                  marginHorizontal: 16,
                }}
              />
            )}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 24,
                  marginVertical: 56,
                  padding: 16,
                }}>
                <Ionicons name="people" size={64} color={Colors.disabled} />
                <Text
                  style={{
                    fontFamily: 'Inter-Semibold',
                    color: Colors.disabled,
                    marginTop: 16,
                    textAlign: 'center',
                  }}>
                  Tes contacts s'afficheront ici, en attendant utilises la barre
                  de recherche
                </Text>
              </View>
            )}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => handleProfileClick(item)}
                style={{
                  padding: 12,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Avatar size={48} profile={item} />
                <View
                  style={{
                    marginLeft: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flex: 1,
                  }}>
                  <View>
                    <Text style={{fontFamily: 'Inter-Bold', fontSize: 16}}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Inter-Regular',
                        color: Colors.medium,
                        marginTop: 4,
                      }}>
                      ${item.kashtag}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          margin: 16,
          right: 0,
        }}>
        <TouchableOpacity
          disabled={selected.length === 0}
          onPress={() =>
            navigation.navigate('SendKash', {type, recipients: selected})
          }
          style={{
            backgroundColor:
              selected.length === 0 ? Colors.disabled : Colors.brand,
            paddingVertical: 8,
            paddingHorizontal: 18,
            borderRadius: 100,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Bold',
              color: 'white',
              fontSize: 16,
              marginRight: 8,
            }}>
            Suivant
          </Text>
          <AntDesign name={'arrowright'} color={'white'} size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Recipients;