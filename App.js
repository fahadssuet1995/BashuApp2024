import 'react-native-gesture-handler'
import * as React from 'react'
import 'react-native-reanimated'
import { NavigationContainer } from "@react-navigation/native"
import RootStackScreen from './src/screens/RootStackScreen'
import { Provider } from "react-redux"
import { store } from "./src/redux/store"
import { StatusBar } from "expo-status-bar"

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style='dark' />
        <RootStackScreen />
      </NavigationContainer>
    </Provider>
  )
}