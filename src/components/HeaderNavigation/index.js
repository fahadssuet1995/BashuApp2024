import React from "react";
import {
  View,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const MainHeaderButtons = () => {
  const navigation = useNavigation();

  const pushToSearchView = async () => {
    navigation.navigate("Search");
  };

  return (
    <View
      style={{
        marginRight: 10,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.2}
        onPress={() => pushToSearchView()}
        style={{ right: 10, borderRadius: 50, borderWidth: 1, borderColor: "green", padding: 5}}
      >
        <Ionicons name={"search-sharp"} size={20} color={"green"} />
      </TouchableOpacity>
    </View>
  );
};

export default MainHeaderButtons;
