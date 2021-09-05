import useSWRNative from "@nandorojo/swr-react-native";
import React from "react"
import { useState } from "react";
import {View, Text, ActivityIndicator} from "react-native";
import Button from "../../components/Button";
import Input from "../../components/Input";
import api, { fetcher } from "../../utils/api";
import Colors from "../../utils/colors";
import { useAsync } from "../../utils/hooks";
import toast from "../../utils/toast";

export default function PromoCode() {
  const profileQuery = useSWRNative(`/kash/profiles/current/`, fetcher);
  const applyCode = useAsync((code) => api.post(`/kash/profiles/current/promo/apply/`, {code}))
  const [code, setCode] = useState("");
  const balance = profileQuery.data?.promo_balance;

  const handleApply = () => {
    applyCode.execute(code).then(() => {
      profileQuery.mutate();
      toast.success("Code appliqué", '');
      setCode("");
    }).catch((err) => {
      if (err.response) {
        toast.error("Une erreur est survenue", "Votre code promo ne peut être appliqué")
      }
    })
  }
  
  return (
    <View style={{flex: 1, backgroundColor: "white"}}>
      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomColor: Colors.border, borderBottomWidth: 1}}>
        <Text style={{color: Colors.medium, fontFamily: "Inter-Medium", fontSize: 16}}>Solde promo</Text>
        <Text style={{color: "black", fontFamily: "Inter-Bold", fontSize: 16}}>{balance ? balance + " FCFA" : "0 FCFA"}</Text>
      </View>
      <View style={{padding: 16, paddingTop: 8}}>
        <Input value={code} label="Code promo" description="Veuillez saisir un code promo." onChangeText={text => setCode(text.toUpperCase())} />
        <Button loading={applyCode.loading} onPress={handleApply} style={{marginTop: 8}}>Appliquer</Button>
      </View>
    </View>
  )
}