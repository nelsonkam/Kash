import useSWRNative from "@nandorojo/swr-react-native";
import React from "react"
import { Share, Text, View } from "react-native"
import Button from "../../components/Button";
import { fetcher } from "../../utils/api";
import Colors from "../../utils/colors";


export default function ReferralProgram() {
  const profileQuery = useSWRNative(`/kash/profiles/current/`, fetcher);

  const code = profileQuery.data?.referral_code;

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: 'white',
          height: 360,
          padding: 16,
          paddingTop: 32,
          paddingBottom: 48,
        }}>
        <View >
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              color: Colors.dark,
              fontSize: 18,
            }}>
            Invites tes potes sur Kash
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              color: Colors.medium,
              fontSize: 16,
              marginTop: 12,
            }}>
            Utilises ce code d'invitation pour inviter tes potes à utiliser Kash.
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              color: Colors.medium,
              fontSize: 16,
              marginTop: 8,
            }}>
            À chaque fois que quelqu'un s'inscrit avec ton code d'invitation et crée une carte, tu gagnes <Text style={{ fontFamily: "Inter-Bold" }}>500 FCFA</Text>.
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
            REF-{code}
          </Text>
        </View>
        <Button
          onPress={() => {
            Share.share({
              message: `Crée des cartes prépayées illimitées et profites d'un bonus de 1000 FCFA en téléchargeant l'application Kash sur: https://kashafrica.app.link/EKgDUkI0Hfb et en utilisant le code d'invitation suivant: *REF-${code}*`,
            });
          }}>
          Partager
        </Button>
      </View>
    </View>
  )
}