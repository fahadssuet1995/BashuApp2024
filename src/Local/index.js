import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocalKeys } from "./Keys";

export const getUserId = async () => {
  let fg= "";
  const userData = (await AsyncStorage.getItem(LocalKeys.UserKey)) || "{}";
  const jsonValue = JSON.parse(userData);
  fg = jsonValue.id;
  return fg;
};

export const _retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem(LocalKeys.UserKey);
    if (value !== null) {
      // We have data!!
      // console.warn(value);
    }
  } catch (error) {
    // Error retrieving data
  }
};
