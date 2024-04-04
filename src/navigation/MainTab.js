import React from 'react';
import {
    View,
    TouchableOpacity
} from 'react-native';
import { createBottomTabNavigator, BottomTabBar } from "@react-navigation/bottom-tabs"
import Svg, { Path } from 'react-native-svg';
import { isIphoneX } from 'react-native-iphone-x-helper';
import UserProfile from "../screens/UserPageScreen"
import UserFavoritesScreen from '../screens/UserPageScreen'
import HomeScreen from '../screens/UserPageScreen'
import DiningScreen from '../screens/UserPageScreen'

import {
    MaterialIcons,
    AntDesign,
    MaterialCommunityIcons,
    Ionicons,
} from "@expo/vector-icons";
import colors from '../config/colors';
const Tab = createBottomTabNavigator();

const TabBarCustomButton = ({ accessibilityState, children, onPress }) => {

    var isSelected = accessibilityState.selected

    if (isSelected) {
        return (
            <View style={{ flex: 1, alignItems: "center" }}>
                <View style={{ flexDirection: 'row', position: 'absolute', top: 0 }}>
                    <View style={{ flex: 1, backgroundColor: "white" }}></View>
                    <Svg
                        width={75}
                        height={61}
                        viewBox="0 0 75 61"
                    >
                        <Path
                            d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
                            fill='white'
                        />
                    </Svg>
                    <View style={{ flex: 1, backgroundColor: 'white' }}></View>
                </View>
                <TouchableOpacity
                    style={{
                        top: -22.5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: colors.primary
                    }}
                    onPress={onPress}>
                    {children}
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    height: 60,
                    backgroundColor: colors.white
                }}
                activeOpacity={1}
                onPress={onPress}
            >
                {children}
            </TouchableOpacity>
        )
    }
}

const CustomTabBar = (props) => {
    if (isIphoneX()) {
        return (
            <View>
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 30,
                        backgroundColor: colors.white
                    }}
                ></View>
                <BottomTabBar
                    {...props.props}
                />
            </View>
        )
    } else {
        return (
            <BottomTabBar
                {...props.props}
            />
        )
    }

}

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    right: 0,
                    borderTopWidth: 0,
                    backgroundColor: "transparent",
                    elevation: 0
                }
            }}
            tabBar={(props) => (
                <CustomTabBar
                    props={props}
                />
            )}
        >

            <Tab.Screen
                name="MenuScredsen"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MaterialIcons name="delivery-dining" size={30} color={"white"} style={{

                            color: focused ? colors.white : colors.secondary, alignSelf: "center", justifyContent: "center"
                        }} />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                        />
                    )
                }}
            />

            <Tab.Screen
                name="DiningScreen"
                component={DiningScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MaterialIcons name="dinner-dining" size={30} color={"white"} style={{

                            color: focused ? colors.white : colors.secondary, alignSelf: "center", justifyContent: "center"
                        }} />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                        />
                    )
                }}
            />

            <Tab.Screen
                name="UserFavoritesScreen"
                component={UserFavoritesScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="heart-outline" size={30} color={"white"} style={{

                            color: focused ? colors.white : colors.secondary, alignSelf: "center", justifyContent: "center"
                        }} />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                        />
                    )
                }}
            />

            <Tab.Screen
                name="User"
                component={UserProfile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AntDesign name="user" size={30} color={"white"} style={{
                            color: focused ? colors.white : colors.secondary
                        }} />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                        />
                    )
                }}
            />
        </Tab.Navigator>
    )
}

export default MainTabs