import * as React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import NewStickButton from "../components/StickFeed/NewStickButton";

export default function SticksScreen() {
  return (
    <View style={{ width: "100%" }}>
      <NewStickButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
