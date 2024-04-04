import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  user: {
    fontWeight: "bold",
  },
  ago: {
    color: "#808080",
    fontSize: 11,
  },
  content: {
    color: "black",
    marginHorizontal: 10,
  },
  topDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 4,
    width: "100%",
    alignItems: "center",
    padding: 5,
  },
  main: {
    flex: 1,
  },
});

export default styles;
