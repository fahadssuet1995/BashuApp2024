import { StyleSheet } from "react-native";
import colors from "../../../../config/colors";

const styles = StyleSheet.create({
  user: {
    fontWeight: "bold",
    marginLeft: 2,
    marginTop: -5,
    lineHeight: 15,
    marginRight: 10,
  },
  ago: {
    color: "black",
    marginLeft: 10,
    marginTop: 8,
    marginBottom: 5,
    fontSize: 10,
  },
  username: {
    color: colors.primary,
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 10,
  },
  content: {
    color: "black",
    marginHorizontal: 10,
    marginRight: 40,
    marginLeft: 14,
  },
  topDetails: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
  },
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  stickHeaderContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  stickHeaderNames: {
    flexDirection: "row",
  },
  name: {
    marginRight: 5,
    fontWeight: "bold",
  },
  createdat: {
    color: "grey",
    fontSize: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  number: {
    marginLeft: 3,
    color: "grey",
  },
});

export default styles;
