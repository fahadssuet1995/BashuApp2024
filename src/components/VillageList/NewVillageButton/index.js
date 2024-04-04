import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";

const NewVillageButton = () => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate("NewStick");
  };
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.button}
      onPress={onPress}
    >
      <Ionicons name={"add-circle"} size={30} color={"white"} />
      <Text style={styles.start_flow}>Create Village</Text>
    </TouchableOpacity>
  );
};

export default NewVillageButton;
