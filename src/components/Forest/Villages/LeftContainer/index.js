import React from "react";
import { View, Image } from "react-native";


const VillageLeftContainer = ({ village }) => (
  <View>
    <Image
      source={{ uri: village.image }}
      style={{
        width: 80,
        height: 80,
        borderRadius: 10,
      }}
    />
  </View>
);

export default VillageLeftContainer;
