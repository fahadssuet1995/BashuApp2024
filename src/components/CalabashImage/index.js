import React from "react";
import { Image } from "react-native";
const CalalabashImage = ({ image }) => (
  <Image
    source={{ uri: image }}
    style={{
      width: "100%",
      height: 150,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      backgroundColor: "gray",
    }}
  />
);

export default CalalabashImage;
