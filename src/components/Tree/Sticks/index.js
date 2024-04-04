import React from "react";
import { View } from "react-native";
import LeftContainer from "./LeftContainer";
import MainContainer from "./MainContainer";
import styles from "./styles";

const Sticks = ({ stick, profile, route }) => {

  return (
    <View style={styles.container}>
      <LeftContainer stick={stick} profile={profile} />
      <MainContainer stick={stick} />
    </View>
  );
};

export default Sticks;
