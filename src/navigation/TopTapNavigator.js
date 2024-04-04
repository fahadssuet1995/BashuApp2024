import * as React from "react";
import { Text, TouchableOpacity } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ForestScreen from "../screens/ForestScreen";
import TreeScreen from "../screens/TreeScreen";
import colors from "../config/colors";
import {
  Fontisto,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import NotificationScreen from "../screens/Notifications";
import { useDispatch, useSelector } from "react-redux";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { database } from "../config/firebase";
import { selectUser, setNotify } from "../redux/features/user";
import { useFocusEffect } from "@react-navigation/native";
import { addNofity } from "../redux/features/notifications";
import * as Notifications from "expo-notifications"
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createMaterialTopTabNavigator();

export default function TreeTabs() {
  let unsub1;
  let unsub2;
  const userdata = useSelector(selectUser)
  const [hasWatching, setHasWatching] = React.useState(false)
  const dispatch = useDispatch()

  const getNoifications = async () => {
    unsub1 = onSnapshot(collection(database, `users/${userdata.uid}/notifications`), snap => {
      const result = snap.docs.map(doc => {
        const id = doc.id
        const data = doc.data()

        return { id, ...data }
      })


      if (result?.length > 0) {
        result.sort(function compare(a, b) {
          let dateA = new Date(a.date);
          let dateB = new Date(b.date);
          return dateB - dateA;
        })

        dispatch(addNofity(result))
        setHasWatching(true)
      }
    })

    const budge = await Notifications.getBadgeCountAsync()
    dispatch(setNotify(budge))
  }


 
  // listend to react navigation native hooks 
  useFocusEffect(
    React.useCallback(() => {
      getNoifications()
      return () => {
        // removing listeners
        if (unsub1) unsub1()
        if (unsub2) unsub2()
      }
    }, [])
  )


  return (
    <Tab.Navigator
      initialRouteName="Sticks"
      screenOptions={{
        tabBarShowLabel: true,
        tabBarShowIcon: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "grey",
        tabBarIndicatorStyle: { backgroundColor: colors.primary },
        tabBarIndicatorContainerStyle: {
          marginHorizontal: 30,
          paddingHorizontal: 90,
        },
        tabBarStyle: {
          backgroundColor: "#fff",
          borderBottomColor: "#eee",
          borderBottomWidth: 1,
          elevation: 20,
        },
      }}
    >
      <Tab.Screen
        name="Sticks"
        component={TreeScreen}
        options={{
          tabBarLabel: "Tree",
          title: "sasd",
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="palm-tree"
              color={"green"}
              size={28}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarLabel: "Notifications",
          title: "sasd",
          tabBarIcon: () => (
            <TouchableOpacity onPress={() => alert("sdsdssdf")}>
              <TouchableOpacity
                onPress={() => alert("Sdfs")}
                style={{
                  position: "absolute",
                  backgroundColor: colors.primary,
                  zIndex: 1,
                  right: -6,
                  top: -2,
                  borderRadius: 15,
                  width: 16,
                  height: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "white",
                  borderWidth: 1.5,
                }}
              >
                <Text style={{ color: "white", fontSize: 10 }}>
                  {userdata.notifications}
                </Text>
              </TouchableOpacity>
              <MaterialCommunityIcons name="bell" color={"green"} size={24} />
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen
        name="Forest"
        component={ForestScreen}
        options={{
          tabBarLabel: "Forest",
          tabBarIcon: () => (
            <Fontisto name="holiday-village" color={"green"} size={23} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
