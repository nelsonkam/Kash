import React, {useRef} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Colors from '../../utils/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import {RNCamera} from 'react-native-camera';

function ChooseDocumentType() {
  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 16}}>
      <Text
        style={{
          fontFamily: 'Inter-Bold',
          fontSize: 18,
          textAlign: 'center',
          marginVertical: 32,
          color: Colors.dark,
        }}>
        Choisis un type de pièce
      </Text>

      <TouchableOpacity
        style={{
          borderColor: Colors.border,
          borderWidth: 2,
          borderRadius: 6,
          marginHorizontal: 16,
        }}>
        <View
          style={{
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: Colors.border,
            borderBottomWidth: 2,
          }}>
          <View
            style={{
              height: 56,
              width: 56,
              backgroundColor: Colors.lightGrey,
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AntDesign name={'idcard'} size={28} color={Colors.medium} />
          </View>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: 16,
              color: Colors.dark,
              marginLeft: 8,
            }}>
            Carte d'identité nationale
          </Text>
        </View>
        <TouchableOpacity
          style={{
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 56,
              width: 56,
              backgroundColor: Colors.lightGrey,
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name={'passport'}
              size={28}
              color={Colors.medium}
            />
          </View>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: 16,
              color: Colors.dark,
              marginLeft: 8,
            }}>
            Passeport
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

function ScanDocument() {
  const cameraRef = useRef(null);
  if (true) {
    return (
      <RNCamera
        ref={cameraRef}
        style={{flex: 1}}
        type={RNCamera.Constants.Type.back}
        androidCameraPermissionOptions={{
          title: 'Utiliser ta caméra',
          message: 'Nous avons besoin de ta permission pour utiliser ta caméra',
          buttonPositive: 'Accepter',
          buttonNegative: 'Annuler',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Utiliser ton micro',
          message: 'Nous avons de ta permission pour utiliser ton micro',
          buttonPositive: 'Accepter',
          buttonNegative: 'Annuler',
        }}
      />
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 16}}>
      <Text
        style={{
          fontFamily: 'Inter-Bold',
          fontSize: 18,
          textAlign: 'center',
          marginVertical: 32,
          color: Colors.dark,
        }}>
        Prends une photo de ta pièce
      </Text>
      <View
        style={{
          borderColor: Colors.border,
          borderStyle: 'dashed',
          height: 160,
          borderWidth: 2,
          marginHorizontal: 24,
          marginTop: 8,
        }}></View>
      <View style={{marginHorizontal: 24, marginTop: 48}}>
        <Button>Prendre une photo</Button>
      </View>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          paddingVertical: 10,
          marginVertical: 16,
        }}
        onPress={() => null}>
        <Text style={{fontFamily: 'Inter-Bold', color: Colors.brand}}>
          Choisir un autre type de pièce
        </Text>
      </TouchableOpacity>
    </View>
  );
}
function VerifyKYCDoc() {
  return <ScanDocument />;
}

export default VerifyKYCDoc;
