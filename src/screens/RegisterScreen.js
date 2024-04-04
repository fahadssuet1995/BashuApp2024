import * as React from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable
} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import colors from "../config/colors"
import {
  MaterialCommunityIcons,
  Entypo,
  AntDesign,
  Feather,
} from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { useRef } from "react"
import DropdownAlert from "react-native-dropdownalert"
import {
  SkypeIndicator,
} from "react-native-indicators"
import { auth, database } from "../config/firebase"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function SignInScreen() {
  const navigation= useNavigation()
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [confirm, setConfirm] = useState("")
  const [password, setPassword] = useState("")
  const [shouldLoad, setShouldLoad] = useState(false)
  const dropdownAlert = useRef()
  const keyboardVerticalOffset = Platform.OS === "ios" ? 60 : 0
  const [showpwd, setShowPwd] = useState(false)


  
  const showdropdownAlert = (msg) => {
    dropdownAlert.current?.alertWithType("error", "Failed", msg)
  }

  // generate the userename
  const createUserName = (fullname) => {
    const random = (Math.floor(Math.random() * 3319) + 1)
    return `_${fullname.split(' ')[0].slice(0, 3)}${String(random)}`
  }

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  // create account method
  const creatAccount = async () => {
    if (fullname === '' || email === '' || password === '' || confirm === '') {
      showdropdownAlert("All fields are required")
    } else if (!validateEmail(email)) {
      showdropdownAlert("Please enter valid email address")
    } else {
      if (password !== confirm) return showdropdownAlert("Password do not match")
      setShouldLoad(true)
      try {
        const postData = {
          username: createUserName(fullname),
          fullname: fullname,
          email: email,
          profile: '',
          sticks: 0,
          watching: 0,
          watchers: 0,
          villages: 0,
          calabash: 0,
          date: new Date().toUTCString()
        }

        createUserWithEmailAndPassword(auth, postData.email, confirm)
          .then((res) => {
            addUser(res, postData)
            sendEmailVerification(res.user)
              .then(() => alert('If your email exists you will recieve an email from us, to verify your email. Thank you.'))
          }).catch((e) => {
            setShouldLoad(false)
            Alert.alert(e.code, e.message, [{ text: 'OK' }])
          })
      } catch (e) {
        setShouldLoad(false)
      }
    }
  }


  const addUser = (res, data) => {
    setDoc(doc(database, `users/${res.user.uid}`), data)
      .then(() => {
        setShouldLoad(false)
        navigation.navigate("RegisterFinalScreen", { uid: res.user.uid })
      })
      .catch(() => {
        Alert.alert('Oopss', 'We could not create your account at the moment, please try again later', [{ text: 'OK' }])
      })
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ width: "100%", zIndex: 10000 }}>
        <DropdownAlert ref={dropdownAlert} />
      </View>
      <KeyboardAvoidingView
        keyboardVerticalOffset={keyboardVerticalOffset}
        behavior={Platform.OS === "ios" ? "height" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.welcomeText}>Lets get you started...</Text>

          <View style={styles.inputContainer}>
            <Feather
              style={styles.inputIcon}
              color={colors.primary}
              name={"user-plus"}
              size={20}
            />
            <TextInput
              onChangeText={(text) => setFullname(text)}
              style={styles.inputs}
              placeholder="Full name(s)"
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

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              color={colors.primary}
              style={styles.inputIcon}
              name={"email-edit-outline"}
              size={20}
            />
            <TextInput
              autoCapitalize="none"
              onChangeText={(text) => setEmail(text)}
              style={styles.inputs}
              placeholder="Email"
              keyboardType="email-address"
              underlineColorAndroid="transparent"
              placeholderTextColor={"black"}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              color={colors.primary}
              style={styles.inputIcon}
              name={"form-textbox-password"}
              size={20}
            />
            <TextInput
              onChangeText={(text) => setPassword(text)}
              style={styles.inputs}
              placeholder="Password"
              secureTextEntry={!showpwd}
              placeholderTextColor={"black"}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
            {password !== '' && <Pressable onPress={() => setShowPwd(!showpwd)}>
              <Text style={{ marginRight: 15 }}>{!showpwd ? 'show' : 'hide'}</Text>
            </Pressable>}
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              color={colors.primary}
              style={styles.inputIcon}
              name={"form-textbox-password"}
              size={20}
            />
            <TextInput
              onChangeText={(text) => setConfirm(text)}
              style={styles.inputs}
              secureTextEntry={!showpwd}
              placeholder="Confirm Password"
              placeholderTextColor={"black"}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />

            {confirm !== '' && <Pressable onPress={() => setShowPwd(!showpwd)}>
              <Text style={{ marginRight: 15 }}>{!showpwd ? 'show' : 'hide'}</Text>
            </Pressable>}
          </View>

          <View style={styles.noticeContainer}>
            <View>
              <Text>By creating an account, you agree to our </Text><TouchableOpacity onPress={() => navigation.navigate("TermsAndConditions")}><Text style={{ color: colors.primary }}>Terms & conditions</Text><Text>AND</Text></TouchableOpacity><TouchableOpacity onPress={() => navigation.navigate("Privacy")}><Text style={{ color: colors.primary }}>Privacy Policy.</Text></TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => creatAccount()}
            style={[styles.buttonContainer, styles.loginButton]}
          >
            <Text style={styles.loginText}>Create account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              const data = await AsyncStorage.getItem('newuser')
              if (data !== null && data === 'yes') {
                await AsyncStorage.setItem('newuser', 'no')
                navigation.navigate('WithAcc', { params: { screen: 'LoginScreen' } })
              } else {
                navigation.goBack()
              }
            }}
            style={[styles.buttonContainer]}
          >
            <Text style={{ color: "black", textAlign: "center" }}>
              Already have any account? Login now
            </Text>
          </TouchableOpacity>

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
      </KeyboardAvoidingView >
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
