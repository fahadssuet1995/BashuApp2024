import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./SplashScreen";

const SplashStack = createStackNavigator();

const SplashScreenStack = () => (
  <SplashStack.Navigator screenOptions={{headerShown: false}}>
    <SplashStack.Screen name="SplashScreen" component={SplashScreen} />
  </SplashStack.Navigator>
);

export default SplashScreenStack;
