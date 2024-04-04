import * as React from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import colors from "../config/colors"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  MaterialCommunityIcons,
} from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { useRef } from "react"
import DropdownAlert from "react-native-dropdownalert"
import {
  SkypeIndicator,
} from "react-native-indicators"
import { auth, database } from "../config/firebase"
import { sendPasswordResetEmail } from "firebase/auth"

export default function ForgotPassword() {
  const navigation= useNavigation()
  const [email, setEmail] = useState("")
  const [shouldLoad, setShouldLoad] = useState(false)
  const dropdownAlert = useRef()
  const keyboardVerticalOffset = Platform.OS === "ios" ? 60 : 0

  const showdropdownAlert = (msg) => {
    dropdownAlert.current?.alertWithType("error", "Failed", msg)
  }

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  // create account method
  const sendEmail = async () => {
    if (email === '') {
      showdropdownAlert("All fields are required")
    } else if (!validateEmail(email)) {
      showdropdownAlert("Please enter valid email address")
    } else {
      setShouldLoad(true)
      sendPasswordResetEmail(auth, email)
        .then((res) => {
          setShouldLoad(false)
          alert('We have sent you an email to reset your password. If you do no recieve the email, verify if your exists or contact us. Thank you.')
          navigation.goBack()
        }).catch((e) => {
          setShouldLoad(false)
          if (e.code === 'auth/user-not-found') return alert('The email you entered does not exist in our system.')
        })
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 300, backgroundColor: 'white', height: '100%' }}>

      <KeyboardAwareScrollView enableOnAndroid>
        <View style={{ width: "100%", zIndex: 10000 }}>
          <DropdownAlert ref={dropdownAlert} />
        </View>
        <Text style={styles.welcomeText}>Application on development</Text>
        <Text style={styles.welcomeText}>Reset password</Text>

        {shouldLoad ? (
          <SkypeIndicator
            style={{ position: "absolute", zIndex: 1000 }}
            size={40}
            color="red"
          />
        ) : null}

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            color={colors.primary}
            style={styles.inputIcon}
            name={"email-edit-outline"}
            size={20}
          />
          <TextInput
            onChangeText={(text) => setEmail(text)}
            style={styles.inputs}
            placeholder="Email"
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            placeholderTextColor={"black"}
            autoCapitalize='none'
          />
        </View>

        <TouchableOpacity
          onPress={() => sendEmail()}
          style={[styles.buttonContainer, styles.loginButton]}
        >
          <Text style={styles.loginText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            navigation.goBack()
          }}
          style={[styles.buttonContainer]}
        >
          <Text style={{ color: "black", textAlign: "center" }}>
            Back to login
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
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
  }, noticeContainer: {
    borderBottomColor: "#F5FCFF",
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    marginBottom: 20,
    padding: 10,
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
  loginButton: {
    backgroundColor: colors.primary,
  },
  loginText: {
    color: "white",
    fontSize: 16,
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
    marginVertical: 30,
    textAlign: "center",
    alignItems: "center",
  },
  back: {
    top: 20,
    left: 10,
  },
})
