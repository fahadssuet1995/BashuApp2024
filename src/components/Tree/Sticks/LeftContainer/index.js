import React from "react"
import ProfilePicture from "../../../ProfilePicture"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const LeftContainer = ({ stick, profile }) => {
  const navigation = useNavigation()

  const pushToView = async (id) => {
    await AsyncStorage.setItem("@storage_CurrentDataKey", id)
    navigation.navigate("StickComments")
  }

  return (
    <TouchableOpacity onPress={() => pushToView(stick.id)}>
      {profile !== '' && <ProfilePicture image={profile} size={50} />}
    </TouchableOpacity>
  )
}

export default LeftContainer
