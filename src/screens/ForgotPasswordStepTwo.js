import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
} from "react-native";
import DropdownAlert from "react-native-dropdownalert";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../config/colors";
import {
  Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  SkypeIndicator,
} from "react-native-indicators";
import { useEffect, useRef, useState } from "react";

export default function ForgotPasswordStepTwo({ route }) {
  const navigation = useNavigation();
  const dropdownAlert = useRef();

  const [email, setEmail] = useState("");
  const [shouldLoad, setShouldLoad] = useState(false);
  const [stepText, setStepText] = useState("Forgot your password?")
  const [code, setCode] = useState()
  const [inputCode, setInputCode] = useState("")

  const showdropdownAlert = (msg) => {
    dropdownAlert.current?.alertWithType("error", "Failed", msg);
  };

  const onStepOneDoneSubmit = async () => {
    if (inputCode == "") {
      showdropdownAlert("Please enter 4 digits");
    } else if (inputCode != code) {
      showdropdownAlert(`Invalid code. Please check your email (${email}) for a code.`);
    } else {
      setShouldLoad(false);
      try {
        navigation.navigate("ForgotPasswordStepThree", {
          email: email
        });

      } catch (e) {
        setShouldLoad(false);
      }
    }
  };


  useEffect(() => {
    let { email, code } = route.params;
    setEmail(email)
    setCode(code)
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <View style={{ width: "100%", zIndex: 10000 }}>
        <DropdownAlert ref={dropdownAlert} />
      </View>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name={"arrow-left-circle"} size={35} color={"#DB4437"} />
        </TouchableOpacity>

        <Text style={styles.welcomeText}>{stepText}</Text>

        <View style={{ justifyContent: "center", alignItems: "center", marginLeft: 35, marginRight: 35, marginBottom: 20 }}>
          <Text style={{ alignSelf: "center", textAlign: "center" }}>We have sent 4-digits one-time code to {email}. Please enter code to reset password.</Text>
        </View>

        <View style={styles.inputContainer}>

          <TextInput
            onChangeText={(text) => setInputCode(text)}
            style={styles.inputs}
            placeholder="Enter 4 digits"
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            placeholderTextColor={"black"}
          />
        </View>

        {shouldLoad ? (
          <SkypeIndicator
            style={{ position: "absolute", zIndex: 1000 }}
            size={40}
            color="red"
          />
        ) : null}



        <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")} style={[styles.buttonContainer]}>
          <Text style={{ color: "black" }}>I remember my password</Text>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => onStepOneDoneSubmit()}
          style={[styles.buttonContainer, styles.loginButton]}
        >
          <Text style={styles.loginText}>Submit</Text>
        </TouchableOpacity>




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
  }, noticeContainer: {
    borderBottomColor: "#F5FCFF",
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    marginBottom: 20,
    padding: 10,
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#EEEEEE",
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    height: 45,
    marginBottom: 20,
    alignItems: "center",

  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    width: 150,
    textAlign: "center"
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
    display: "none",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 30,
  },
  back: {
    top: 20,
    left: 10,
  },
});
