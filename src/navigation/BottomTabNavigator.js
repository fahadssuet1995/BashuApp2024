/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ForestScreen from "../screens/ForestScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProfilePicture from "../components/ProfilePicture";
import TopBarNavigator from "./TopTapNavigator";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Tree"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
      }}
    >
      <BottomTab.Screen
        name="Tree"
        component={TopBarNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="md-chatbubble-ellipses-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Forest"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="md-chatbubbles-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="md-search-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Account"
        component={TabAccountNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="md-person-outline" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}


// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator();

// function TreeNavigator() {
//   return (
//     <TabOneStack.Navigator>
//       <TabOneStack.Screen
//         name="TreeScreen"
//         component={TabOneScreen}
//         options={{
//           headerLeftContainerStyle: {
//             marginLeft: 10,
//           },
//           headerTitle: "Tree",
//           headerLeft: () => <ProfilePicture size={40} />,
//         }}
//       />
//     </TabOneStack.Navigator>
//   );
// }

const TabTwoStack = createStackNavigator();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={ForestScreen}
        options={{
          headerLeftContainerStyle: {
            marginLeft: 10,
          },
          headerTitle: "Forest",
          headerLeft: () => (
            <ProfilePicture
              image={
                "https://playbit.com.na/synch/mp/Marshall/Art/marshall.jpg"
              }
              size={40}
            />
          ),
        }}
      />
    </TabTwoStack.Navigator>
  );
}

const TabAccountStack = createStackNavigator();

function TabAccountNavigator() {
  return (
    <TabAccountStack.Navigator>
      <TabAccountStack.Screen
        name="Account"
        component={ProfileScreen}
        options={{
          headerLeftContainerStyle: {
            marginLeft: 10,
          },
          headerTitle: "Profile",
          headerLeft: () => <ProfilePicture size={40} />,
        }}
      />
    </TabAccountStack.Navigator>
  );
}
