import { StyleSheet } from "react-native";
import colors from "../../../../config/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  stickHeaderNames: {
    flexDirection: "row",
  },
  stickHeaderContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  name: {
    marginRight: 5,
    fontWeight: "bold",
  },
  username: {
    marginRight: 5,
    color: colors.primary,
  },
  createdat: {
    color: "grey",
    fontSize: 10,
  },
  content: {
    lineHeight: 19,
    marginTop: 4,
  },
  image: {
    height: 200,
    width: "100%",
    resizeMode: "cover",
    borderRadius: 15,
    overflow: "hidden",
    marginVertical: 10,
  },
});

export default styles;
