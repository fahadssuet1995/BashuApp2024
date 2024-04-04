import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
} from "react-native";
import colors from "../config/colors";
import StickFeed from "../components/StickFeed";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/features/user";

export default function UserSticksScreen() {
  const userdate = useSelector(selectUser)

  return (
    <View>
      <StickFeed user={userdate.uid} profile={userdate.profile} route={'My Stick'} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop: 10,
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    marginBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  separator: {
    height: 0.5,
    backgroundColor: "#CCCCCC",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: 0,
  },
  time: {
    fontSize: 11,
    color: "#808080",
    marginTop: 1,
  },
  name: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: "bold",
  },
  username: {
    fontSize: 10,
    color: colors.primary,

    marginTop: -5,
  },
  ago: {
    fontSize: 10,
    marginTop: 8,
    color: "black",
  },
  joined: {
    fontSize: 10,
    color: "gray",
    marginTop: -5,
  },
});
