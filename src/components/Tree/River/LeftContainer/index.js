import React from "react";
import { View } from "react-native";
import ProfilePicture from "../../../ProfilePicture";


const ChatRoomLeftContainer = ({ chatroom }) => (
  <View>
    <ProfilePicture image={chatroom.user_b_profile} size={50} />
  </View>
);

export default ChatRoomLeftContainer;
