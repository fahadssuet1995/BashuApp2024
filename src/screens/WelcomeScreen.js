import * as React from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../config/colors";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      style={styles.background}
      source={require("../../assets/bg.png")}
    >
      <View style={styles.topContainer}></View>
      <View style={styles.bottomCotainer}>
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.setItem('newuser', 'yes')
            
            navigation.navigate('Unauth', {
              screen: 'SingUpScreen'
            })}}

          style={styles.buttonaA}>
          <Text style={styles.buttonBText}>Create account</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground >
  )
}

const styles = StyleSheet.create({
  backgroundVideo: {
    width: "100%",
    height: "100%",
  },
  bottomCotainer: {
    position: "absolute",
    bottom: 40,
    flex: 1,
    width: "85%",
    zIndex: 19000,
  },
  buttonaA: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 30,
    color: 'white',
  },
  buttonaB: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 30,
    marginVertical: 10,
    borderColor: colors.primary,
    borderWidth: 1,
    width: 150
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonBText: {
    color: 'white',
    fontSize: 20,
    fontWeight: "bold",
  },
  topContainer: {
    position: "absolute",
    justifyContent: "center",
    width: "100%",
    flex: 1,
    top: 80,
    alignItems: "center",
    zIndex: 190000000,
  },
  logo: {
    width: 80,
    height: 100,
    margin: 0,
  },
  slogan: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 40,
  },
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
