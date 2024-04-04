import { StyleSheet } from "react-native";
import colors from "../../../config/colors";

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: colors.primary,
    padding: 1,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  start_flow: {
    color: "white",
    fontWeight: "bold",
    paddingRight: 5,
  },
});

export default styles;
