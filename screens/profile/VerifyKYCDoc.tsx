import React, {useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../utils/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import {RNCamera} from 'react-native-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from '../../utils/api';
import {useAsync} from '../../utils/hooks';
import {AsyncAction} from '../../components/AsyncActionSheet';
import {useNavigation} from '@react-navigation/native';

type ChooseDocumentType = {
  onNext: (type: string) => void;
};

function ChooseDocumentType({onNext}: ChooseDocumentType) {
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
        onPress={() => onNext('id_card')}
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
          onPress={() => onNext('passport')}
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

type ScanDocumentType = {onNext: (photo: any) => void; onBack: () => void};

function ScanDocument({onNext, onBack}: ScanDocumentType) {
  const cameraRef = useRef<RNCamera>(null);
  const width = Dimensions.get('screen').width;
  const [isCameraVisible, showCamera] = useState(false);
  const [photo, setPhoto] = useState<any>();
  const handleSnap = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current?.takePictureAsync(options);
      setPhoto(data);
      showCamera(false);
    }
  };

  if (isCameraVisible) {
    return (
      <View
        style={{
          backgroundColor: 'black',
          flex: 1,
          justifyContent: 'space-around',
        }}>
        <View />
        <RNCamera
          ref={cameraRef}
          style={{height: width * 0.6, width}}
          type={RNCamera.Constants.Type.back}
          androidCameraPermissionOptions={{
            title: 'Utiliser ta caméra',
            message:
              'Nous avons besoin de ta permission pour utiliser ta caméra',
            buttonPositive: 'Accepter',
            buttonNegative: 'Annuler',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Utiliser ton micro',
            message:
              'Nous avons besoin de ta permission pour utiliser ton micro',
            buttonPositive: 'Accepter',
            buttonNegative: 'Annuler',
          }}
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={handleSnap}
            style={{
              width: 72,
              height: 72,
              borderRadius: 100,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons name={'camera'} color={'black'} size={36} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
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
          fontSize: 18,
          textAlign: 'center',
          marginVertical: 32,
          marginTop: 16,
          color: Colors.dark,
        }}>
        Prends une photo de ta pièce
      </Text>
      <View
        style={{
          borderWidth: 2,
          marginHorizontal: 16,
          justifyContent: 'center',
          padding: 8,
          borderColor: Colors.border,
          borderRadius: 8,
          borderStyle: 'dashed',
        }}>
        <Image
          source={{uri: photo?.uri}}
          style={{
            width: width - 96,
            height: (width - 96) * 0.6,
            backgroundColor: Colors.border,
            borderRadius: 8,
          }}
        />
      </View>
      <View style={{marginHorizontal: 24, marginTop: 48}}>
        <Button
          onPress={() => showCamera(true)}
          style={{paddingHorizontal: 32}}>
          Prendre une photo
        </Button>
      </View>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          paddingVertical: 10,
          marginVertical: 16,
        }}
        onPress={onBack}>
        <Text style={{fontFamily: 'Inter-Bold', color: Colors.brand}}>
          Choisir un autre type de pièce
        </Text>
      </TouchableOpacity>
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
          disabled={!photo}
          onPress={() => onNext(photo)}
          style={{
            backgroundColor: !photo ? Colors.disabled : Colors.brand,
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
    </View>
  );
}

function TakeSelfie({onNext}: {onNext: (photo: any) => void}) {
  const cameraRef = useRef<RNCamera>(null);
  const width = Dimensions.get('screen').width;
  const [isCameraVisible, showCamera] = useState(false);
  const [photo, setPhoto] = useState<any>();
  const handleSnap = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.8, base64: true};
      const data = await cameraRef.current?.takePictureAsync(options);
      setPhoto(data);
      showCamera(false);
    }
  };

  if (isCameraVisible) {
    return (
      <View
        style={{
          backgroundColor: 'black',
          flex: 1,
          justifyContent: 'space-around',
        }}>
        <View />
        <RNCamera
          ref={cameraRef}
          style={{flex: 1}}
          type={RNCamera.Constants.Type.front}
          androidCameraPermissionOptions={{
            title: 'Utiliser ta caméra',
            message:
              'Nous avons besoin de ta permission pour utiliser ta caméra',
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
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
          }}>
          <TouchableOpacity
            onPress={handleSnap}
            style={{
              width: 72,
              height: 72,
              borderRadius: 100,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons name={'camera'} color={'black'} size={36} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <>
      <ScrollView
        style={{backgroundColor: 'white'}}
        contentContainerStyle={{
          backgroundColor: 'white',
          padding: 16,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Inter-Bold',
            fontSize: 18,
            textAlign: 'center',
            marginVertical: 32,
            marginTop: 16,
            color: Colors.dark,
          }}>
          Prends un selfie avec ta pièce sous ton menton
        </Text>
        <View
          style={{
            borderWidth: 2,
            marginHorizontal: 16,
            justifyContent: 'center',
            padding: 8,
            borderColor: Colors.border,
            borderRadius: 8,
            borderStyle: 'dashed',
          }}>
          <Image
            source={{uri: photo?.uri}}
            resizeMode={'center'}
            style={{
              width: 198,
              height: 198,
              backgroundColor: Colors.border,
              borderRadius: 8,
            }}
          />
        </View>
        <View style={{marginHorizontal: 24, marginTop: 32, marginBottom: 24}}>
          <Button
            onPress={() => showCamera(true)}
            style={{paddingHorizontal: 32}}>
            Prendre un selfie
          </Button>
        </View>
      </ScrollView>
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
          disabled={!photo}
          onPress={() => onNext(photo)}
          style={{
            backgroundColor: !photo ? Colors.disabled : Colors.brand,
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
    </>
  );
}

type VerificationDocument = {
  type?: string;
  document?: any;
  selfie?: any;
};

function VerifyKYCDoc() {
  const navigation = useNavigation();
  const [verificationDoc, setVerificationDoc] = useState<VerificationDocument>(
    {},
  );
  const uploadDocument = useAsync((id, data) =>
    api.post(`/kash/kyc/${id}/document/`, data, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }),
  );
  const uploadSelfie = useAsync((id, data) =>
    api.post(`/kash/kyc/${id}/selfie/`, data, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }),
  );
  const uploadDocsFn = () => {
    return api
      .post('/kash/kyc/', {document_type: verificationDoc.type})
      .then(res => {
        const doc = res.data;
        const documentData = new FormData();
        const selfieData = new FormData();

        documentData.append('document', {
          name: Math.random().toString().split('.').join('-') + '.jpg',
          type: 'image/jpeg',
          uri:
            Platform.OS === 'ios'
              ? verificationDoc.document?.uri?.replace('file://', '')
              : verificationDoc.document.uri,
        });
        selfieData.append('selfie', {
          name: Math.random().toString().split('.').join('-') + '.jpg',
          type: 'image/jpeg',
          uri:
            Platform.OS === 'ios'
              ? verificationDoc.document?.uri?.replace('file://', '')
              : verificationDoc.document.uri,
        });

        return Promise.all([
          uploadDocument.execute(doc.id, documentData),
          uploadSelfie.execute(doc.id, selfieData),
        ]);
      });
  };

  const uploadDocs = useAsync(uploadDocsFn);

  if (!verificationDoc.type) {
    return (
      <ChooseDocumentType
        onNext={(type: string) =>
          setVerificationDoc({...verificationDoc, type})
        }
      />
    );
  } else if (!verificationDoc.document) {
    return (
      <ScanDocument
        onBack={() => setVerificationDoc({...verificationDoc, type: undefined})}
        onNext={(photo: any) =>
          setVerificationDoc({...verificationDoc, document: photo})
        }
      />
    );
  } else if (!verificationDoc.selfie) {
    return (
      <TakeSelfie
        onNext={(photo: any) => {
          setVerificationDoc({...verificationDoc, selfie: photo});
          uploadDocs.execute().finally(() => {
            setTimeout(() => navigation.goBack(), 2500);
          });
        }}
      />
    );
  } else {
    return (
      <View
        style={{flex: 1, backgroundColor: 'white', justifyContent: 'center'}}>
        <AsyncAction
          statusTexts={{
            loading:
              "Un instant, la sauvegarde de ta pièce d'identité est en cours...",
            error: "Oops, nous n'avons pas pu sauvegarder ta pièce d'identité",
            success:
              "Super, la vérification de ta pièce d'identité est en cours. Nous te notifierons une fois tes informations vérifiées",
          }}
          asyncAction={uploadDocs}
        />
      </View>
    );
  }
}

export default VerifyKYCDoc;
