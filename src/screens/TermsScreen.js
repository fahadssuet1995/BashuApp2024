import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../config/colors";
import {
  Entypo,
  AntDesign,
  Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import DropdownAlert from "react-native-dropdownalert";

export default function TermsScreen() {
  const navigation = useNavigation();
  const dropdownAlert  = useRef();

  const showdropdownAlert = (msg ) => {
    dropdownAlert.current?.alertWithType("error", "Failed", msg);
  };


  return (
    <View style={{ flex: 1 }}>
      <View style={{ width: "100%", zIndex: 10000 }}>
        <DropdownAlert ref={dropdownAlert} />
      </View>


      <View style={styles.container}>
        <View style={{ marginTop: 70, justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name={"arrow-left-circle"} size={35} color={"#DB4437"} />
          </TouchableOpacity>

          <Text style={styles.welcomeText}>Bashu Terms and Conditions</Text>
          <Text>Last updated [28 september 2021]</Text>
        </View>

        <ScrollView style={styles.mainContainer}>

          <Text style={{ marginBottom: 15, fontWeight: "bold", color: "black" }}>AGREEMENT TO TERMS</Text>
          <Text style={styles.termsTexts}>These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity you and Bashu Technologies concerning your access to and use of the Bashu App as well as any other media form, media channel, mobile webApp or mobile application related, linked, or otherwise connected thereto (collectively, the “Bashu App”).</Text>
          <Text style={styles.termsTexts}>You agree that by accessing the App, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly prohibited from using the App and you must discontinue use immediately.</Text>
          <Text style={styles.termsTexts}>Supplemental terms and conditions or documents that may be posted on the App from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Terms and Conditions at any time and for any reason.</Text>
          <Text style={styles.termsTexts}>We will alert you about any changes by updating the “Last updated” date of these Terms and Conditions, and you waive any right to receive specific notice of each such change.</Text>
        </ScrollView>

        <View style={styles.orContainer}>
          <View style={{ width: 120, backgroundColor: "black", height: 1 }} />
          <Text style={{ margin: 5 }}>OR</Text>
          <View style={{ width: 120, backgroundColor: "black", height: 1 }} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity>
            <Entypo
              name={"facebook-with-circle"}
              size={50}
              color={"#3b5998"}
            />
          </TouchableOpacity>
          <View style={{ width: 20 }} />
          <TouchableOpacity>
            <Entypo
              name={"google--with-circle"}
              size={50}
              color={"#DB4437"}
            />
          </TouchableOpacity>
          <View style={{ width: 20 }} />
          <TouchableOpacity
            style={{
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 50,
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AntDesign name={"apple1"} size={30} color={"black"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  mainContainer: {
    padding: 15
  }, noticeContainer: {
    borderBottomColor: "#F5FCFF",
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    marginBottom: 20,
    padding: 10,
  },
  termsTexts: {
    marginBottom: 20,
    fontSize: 15
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: "center",
    top: 3,
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 300,
    borderRadius: 30,
  },
  forgotButtonContainer: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 1,
    width: 250,
    color: "black",
    backgroundColor: "red",
  },
  loginButton: {
    backgroundColor: colors.primary,
  },
  loginText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    display: "none",
  },
  orContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    display: "none",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    alignItems: "center",
  },
  back: {
    top: 20,
    left: 10,
  },
});
