import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";
import { _retrieveData } from "../../../../Local";

const ChartRoomMainContainer = ({ chatroom }) => {
  const s = _retrieveData();
  console.warn(s);
  return (
    <View style={styles.main}>
      <TouchableOpacity>
        <View style={styles.topDetails}>
          {String(s) === chatroom.user_a ? (
            <Text style={styles.user}>Creater</Text>
          ) : (
            <Text style={styles.user}>{chatroom.user_a_fullname}</Text>
          )}

          <Text style={styles.ago}>
            {moment(chatroom.created_at).fromNow()}
          </Text>
        </View>
        <Text style={styles.content}>{chatroom.last_message}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChartRoomMainContainer;
