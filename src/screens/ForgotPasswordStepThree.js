import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from "react-native";
import DropdownAlert from "react-native-dropdownalert";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../config/colors";
import {
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// import QueryString from "querystring";
import {
  SkypeIndicator,
} from "react-native-indicators";
import { useEffect, useRef, useState } from "react";

export default function ForgotPasswordStepThree({ route }) {
  const navigation = useNavigation();
  const dropdownAlert = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const [shouldLoad, setShouldLoad] = useState(false);
  const [stepText, setStepText] = useState("Forgot your password?")

  const showdropdownAlert = (msg) => {
    dropdownAlert.current?.alertWithType("error", "Failed", msg);
  };


  const onStepOneDoneSubmit = async () => {
    if (password == "" || confirmpassword == "") {
      showdropdownAlert("Please enter new password");
    } else if (password != confirmpassword) {
      showdropdownAlert("Password should match");
    } else {
      setShouldLoad(true);
      try {
        const postData = {
          password: password,
          email: email
        };
        // const req = await axios.post(
        //   "/handler.php?request=forgotPasswordStepTwo",
        //   // QueryString.stringify(postData)
        // );


        // if (req.data.message == "failed") {
        //   showdropdownAlert("Oh no, there was a problem. Please try again later.");
        //   setShouldLoad(false);
        // }

        // if (req.data.message == "success") {
        //   setShouldLoad(false);
        //   alert("Success! You have successfully updated your Basu account password.");
        //   navigation.navigate("SignInScreen");
        // }
      } catch (e) {
        setShouldLoad(false);
      }
    }
  };

  useEffect(() => {
    let { email } = route.params;
    setEmail(email)
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
          <Text style={{ alignSelf: "center", textAlign: "center" }}>Please enter new password for your Bashu account.</Text>
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            style={styles.inputIcon}
            name={"form-textbox-password"}
            size={20}
          />
          <TextInput
            onChangeText={(text) => setPassword(text)}
            style={styles.inputs}
            placeholder="Enter New Password"
            secureTextEntry={true}
            placeholderTextColor={"black"}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            style={styles.inputIcon}
            name={"form-textbox-password"}
            size={20}
          />
          <TextInput
            onChangeText={(text) => setConfirmPassword(text)}
            style={styles.inputs}
            placeholder="Confirm New Password"
            secureTextEntry={true}
            placeholderTextColor={"black"}
            underlineColorAndroid="transparent"
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
    flexDirection: "row",
    alignItems: "center",
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
