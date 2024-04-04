import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./WelcomeScreen";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./RegisterScreen";
import RegisterFinalScreen from "./RegisterFinalScreen";
import NewCalabashScreen from "./NewCalabashScreen";
import TermsScreen from "./TermsScreen";
import PrivacyScreen from "./PrivacyScreen";
import ForgotPassword from "./ForgotPassword";
import ForgotPasswordStepTwo from "./ForgotPasswordStepTwo";
import ForgotPasswordStepThree from "./ForgotPasswordStepThree";
import Navigation from "../navigation";
import SplashScreen from "./SplashScreen";


import { useSelector } from "react-redux";
import { selectUser } from "../redux/features/user";

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();
const RootStackNav = createStackNavigator();
const WithAccStack = createStackNavigator();

const RootNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
      <RootStack.Screen name="NewCalabash" component={NewCalabashScreen} />
      <RootStack.Screen name="TermsAndConditions" component={TermsScreen} />
      <RootStack.Screen name="Privacy" component={PrivacyScreen} />
      <RootStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <RootStack.Screen name="ForgotPasswordStepTwo" component={ForgotPasswordStepTwo} />
      <RootStack.Screen name="ForgotPasswordStepThree" component={ForgotPasswordStepThree} />
      <RootStack.Screen name="RegisterFinalScreen" component={RegisterFinalScreen}/>
    </RootStack.Navigator>
  )
}


// if user has an account
const WithAccount = () => {
  return (
    <WithAccStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="SplashScreen" component={SplashScreen} />
      <WithAccStack.Screen name="LoginScreen" component={SignInScreen} />
    </WithAccStack.Navigator>
  )
}

// this stack will hold the main componentts
const Main = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Main" component={Navigation} />
    </MainStack.Navigator>
  )
}

// this stack will hold the main componentts
const Welcome = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
    </MainStack.Navigator>
  )
}

const RootStackScreen = () => {
  const user = useSelector(selectUser)

  return (
    <RootStackNav.Navigator screenOptions={{ headerShown: false }}>
      <RootStackNav.Screen name="WithAcc" component={WithAccount} />
      <RootStackNav.Screen name="Unauth" component={RootNavigator} />
      <RootStackNav.Screen name="Welcome" component={Welcome} />
      {user?.uid !== '' && <RootStackNav.Screen name="Authed" component={Main} />}
    </RootStackNav.Navigator>
  )

}

export default RootStackScreen 
