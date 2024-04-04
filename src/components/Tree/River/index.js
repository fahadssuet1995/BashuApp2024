import React from "react";
import { TouchableOpacity, View } from "react-native";
import ChatRoomLeftContainer from "./LeftContainer";

import styles from "./styles";
import ChartRoomMainContainer from "./MainContainer";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";



const Chatrooms = ({ chatroom }) => {
  const navigation = useNavigation();
  const pushToView = async (id) => {
    await AsyncStorage.setItem("@storage_CurrentDataKey", id);
    navigation.navigate("RiverChatRoom");
  };
  return (
    <TouchableOpacity
      onPress={() => pushToView(chatroom.uuid)}
      style={styles.container}
    >
      <ChatRoomLeftContainer chatroom={chatroom} />
      <ChartRoomMainContainer chatroom={chatroom} />
    </TouchableOpacity>
  );
};

export default Chatrooms;
