import AsyncStorage from "@react-native-async-storage/async-storage";

const UserNavigator = async (type, navigation, user) => {
  await AsyncStorage.setItem("@storage_SelectedUserKey", user);
  switch (type) {
    case "sticks":
      navigation.navigate("UserSticks");
      break;
    case "watching":
      navigation.navigate("UserWatchingList");
      break;
    case "watchers":
      navigation.navigate("UserWatchers");
      break;
    case "villages":
      navigation.navigate("UserVillages");
      break;
  }
}

export default UserNavigator;
