import React from "react";
import { Image } from "react-native";



const ProfilePicture = ({ image, size = 50 }) => (
  <Image
    source={{ uri: image}}
    style={{
      width: size,
      height: size,
      borderRadius: size,
      backgroundColor: "lightgray",
    }}
  />
);

export default ProfilePicture;
