import * as React from "react";
import { StyleSheet, Image, TouchableOpacity, TextInput, Alert, Button, Platform } from "react-native";

import { Text, View } from "../components/Themed";
import colors from "../config/colors";
import { useNavigation } from "@react-navigation/native";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { SkypeIndicator } from "react-native-indicators";
import { useRef, useState } from "react";
import DropdownAlert from "react-native-dropdownalert";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setData, setFullname, setProfile, setUsername } from "../redux/features/user";
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, database, storage } from "../config/firebase";
import RBSheet from "react-native-raw-bottom-sheet"
import { setDataCalabash, setDataSticks } from "../redux/features/data";
//import { deleteUser } from "firebase/auth/react-native";
import { deleteUser } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { compress } from "../hooks/ImageCompressor";


export default function ProfileScreen() {
  const userdata = useSelector(selectUser)
  const [shouldLoad, setShouldLoad] = useState(false);
  const [change, setChange] = useState({
    name: userdata.fullname,
    profile: '',
    username: `${userdata.username}`
  })
  const updateInfoSheet = useRef()
  const dropdownAlert = useRef();
  const navigation= useNavigation()
  const dispatch = useDispatch()
  const [photoShow, setPhotoShow] = React.useState(null)


  const showdropdownAlert = (msg) => {
    dropdownAlert.current?.alertWithType("error", "Failed", msg);
  }

  // updat account method
  const updateAccount = async () => {
    if (change.name === "" && change.username === "") {
      showdropdownAlert("All fields are required");
    } else {
      setShouldLoad(true);

      const postData = {
        username: change.username !== '' ? change.username : userdata.username,
        fullname: change.name !== '' ? change.name : userdata.fullname,
      }

      await updateDoc(doc(database, `users/${userdata.uid}`), postData)
        .then(() => {
          updateInfoSheet?.current.close()

          dispatch(setUsername(postData.username))
          dispatch(setFullname(postData.fullname))

          setShouldLoad(false)
        })
        .catch(() => {
          updateInfoSheet?.current.close()
          setShouldLoad(false)
          showdropdownAlert("Fatal Error. That is not you but us.");
        })
    }
  };


  // method to allow user to pick image
  const pickImage = async () => {
    // request for permission to access libray
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        return alert('You need to allow permission to contitnue')
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    })

    if (!result.canceled) {
      setPhotoShow(result.uri)
      return await updateData(result.uri)
    }
  }

  const updateData = async (file) => {
    try {
      setShouldLoad(true)
      const uid = userdata.uid
      if (uid !== '') {
        const url = await uploadImage(file, uid)

        if (url) {
          const userDoc = doc(database, `users/${uid}`)
          await updateDoc(userDoc, { profile: url })
            .then(async () => {
              // updating users data
              dispatch(setProfile(url))
              setShouldLoad(false)

            })
            .catch(() => {
              setShouldLoad(false)
              alert('We could not update your picture at the moment, please try again later')
            })
        }
      }
    } catch (error) {
      setShouldLoad(false)
      alert('We could not update your picture at the moment, please try again later')
    }
  }

  // upload image as async 
  async function uploadImage(file, uid) {
    const compressedImg = await compress(file)
    
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        resolve(xhr.response)
      }
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"))
      }
      xhr.responseType = "blob"
      xhr.open("GET", compressedImg.uri, true)
      xhr.send(null)
    })

    // set file ref on firebase
    const fileRef = ref(storage, `files/${uid}/profile`)
    const result = await uploadBytes(fileRef, blob)

    // We're done with the blob, close and release it
    blob.close()

    return await getDownloadURL(fileRef)
  }

  // delete account
  const deleteAccount = async () => {
    setShouldLoad(true)

    // get all the sticks for this user
    const sticks = await getDocs(query(collection(database, 'sticks'), where('user', '==', userdata.uid)))
    if (sticks.docs.length > 0) {
      sticks.docs.forEach(async resdoc => {
        // delete all the sticks for this user
        await deleteDoc(doc(database, `sticks/${resdoc.id}`))
      })
    }

    // get all the calabash for this user
    const calabash = await getDocs(query(collection(database, 'calabash'), where('user', '==', userdata.uid)))
    if (calabash.docs.length > 0) {
      calabash.docs.forEach(async resdoc => {
        // delete all the calabash for this user
        await deleteDoc(doc(database, `calabash/${resdoc.id}`))
      })
    }

    // delete usere's record
    await deleteDoc(doc(database, `users/${userdata.uid}`))
    // deleting user from firebase now
    const user = auth.currentUser
    await deleteUser(user)
      .then(() => {
        alert('Your account was deleted. You can always come back 😊')
        const data = {
          username: '',
          uid: '',
          fullname: '',
          profile: '',
          sticks: 0,
          watching: 0,
          watchers: 0,
          pushToken: ''
        }

        dispatch(setData(data))
        dispatch(setDataSticks([]))
        dispatch(setDataCalabash([]))
        setShouldLoad(false)
        navigation.reset({ index: 0, routes: [{ name: 'WithAcc' }] })
      })
  }

  // sign out users
  const signOut = () => {
    auth.signOut()
      .then(() => {
        const data = {
          username: '',
          uid: '',
          fullname: '',
          profile: '',
          sticks: 0,
          watching: 0,
          watchers: 0,
          pushToken: ''
        }

        dispatch(setData(data))
        dispatch(setDataSticks([]))
        dispatch(setDataCalabash([]))
        navigation.reset({ index: 0, routes: [{ name: 'WithAcc' }] })
      })
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
      <View style={{ width: "100%", zIndex: 10000 }}>
        <DropdownAlert ref={dropdownAlert} />
      </View>



      <View style={styles.container}>
        <ScrollView>
          <View style={[styles.topContainer]}>
            {userdata.profile !== '' && <TouchableOpacity style={styles.imageContainer} onPress={() => pickImage()}>
              <Image style={styles.image} source={{ uri: userdata.profile }} />
            </TouchableOpacity>}

            <View style={styles.userDetails}>
              <Text style={styles.userfullname}>{change.name}</Text>
              <Text style={styles.username}>@{change.username}</Text>
            </View>
          </View>

          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>

            {shouldLoad && <SkypeIndicator
              style={{
                position: "absolute",
                zIndex: 10000
              }}
              size={40}
              color="red"
            />}
          </View>

          <View style={{
            position: 'relative',
            backgroundColor: 'tranparent',
            top: -20,
          }} >
            <Button title="Edit Info" onPress={() => updateInfoSheet?.current.open()} />
          </View>

          <View style={{ height: 40 }} />
          <Text
            style={{
              marginLeft: 22,
              marginBottom: 20,
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            More Info
          </Text>
          <View style={styles.menuItemWrapper}>
            <TouchableOpacity
              onPress={() => navigation.navigate("TermsAndConditions")}
              style={styles.innerMenu}>
              <MaterialCommunityIcons
                style={{ marginLeft: 12 }}
                size={20}
                name="file-document-outline"
              />
              <Text style={styles.menuItemText}>Terms & conditions</Text>
            </TouchableOpacity>
            <MaterialCommunityIcons
              color={colors.primary}
              style={{ alignSelf: "center", right: 40 }}
              size={25}
              name="chevron-right"
            />
          </View>

          <View style={{ height: 10 }} />

          <View style={styles.menuItemWrapper}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Privacy")}
              style={styles.innerMenu}>
              <MaterialIcons
                style={{ marginLeft: 12 }}
                size={20}
                name="privacy-tip"
              />
              <Text style={styles.menuItemText}>Privacy policy</Text>
            </TouchableOpacity>
            <MaterialCommunityIcons
              color={colors.primary}
              style={{ alignSelf: "center", right: 40 }}
              size={25}
              name="chevron-right"
            />
          </View>

          <View style={{ height: 10 }} />

          <View style={styles.menuItemWrapper}>
            <TouchableOpacity
              onPress={() => navigation.navigate("AboutBashu")}
              style={styles.innerMenu}>
              <Ionicons
                style={{ marginLeft: 12 }}
                size={20}
                name="people-outline"
              />
              <Text style={styles.menuItemText}>About Us</Text>
            </TouchableOpacity>
            <MaterialCommunityIcons
              color={colors.primary}
              style={{ alignSelf: "center", right: 40 }}
              size={25}
              name="chevron-right"
            />
          </View>

          <View style={{ height: 10 }} />

          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              onPress={signOut}
              style={{
                backgroundColor: colors.primary,
                padding: 10,
                borderRadius: 100,
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
                marginLeft: 10,
              }}
            >
              <AntDesign name={"logout"} color={"white"} size={15} />
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  alignItems: "center",
                  paddingRight: 6,
                  marginLeft: 6,
                  alignSelf: "center",
                }}
              >
                Log Out
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert('Accounts', 'This action will permanently delete your account. Are you sure?', [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Delete Account', onPress: async () => {
                      await deleteAccount()
                    }
                  },
                ]);
              }}
              style={{
                padding: 10,
                borderRadius: 100,
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
                marginLeft: 10,
                marginTop: 20
              }}
            >
              <Text
                style={{
                  color: "red",
                  fontWeight: "bold",
                  textAlign: "center",
                  alignItems: "center",
                  paddingRight: 6,
                  marginLeft: 6,
                  alignSelf: "center",
                }}
              >
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>


          <View style={{ height: 90 }} />
        </ScrollView>
        <View style={{ padding: 10, bottom: 20 }}>

        </View>
      </View>

      <RBSheet
        ref={updateInfoSheet}
        height={350}
        closeOnDragDown={true}
        openDuration={0}
        customStyles={{
          container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20
          },
          draggableIcon: {
            backgroundColor: 'grey'
          }
        }}
      >
        <View style={{ marginTop: 20 }} />
        <ScrollView>
          <Text
            style={{
              marginLeft: 25,
              marginBottom: 20,
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            Basic Details
          </Text>
          <View style={{ marginLeft: 20 }}>
            <View style={styles.inputContainer}>
              <Feather
                style={styles.inputIcon}
                color={colors.primary}
                name={"user-plus"}
                size={20}
              />
              <View style={{ backgroundColor: "transparent" }}>
                <Text style={{ color: "gray", marginLeft: 14, fontSize: 12 }}>
                  Your fullname
                </Text>
                <TextInput
                  onChangeText={(text) => setChange({ ...change, name: text })}
                  style={styles.inputs}
                  placeholder="Full name"
                  keyboardType="email-address"
                  underlineColorAndroid="transparent"
                  placeholderTextColor={"black"}
                  value={change.name}
                />
              </View>
            </View>

            <View style={{
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {shouldLoad && <SkypeIndicator
                style={{ position: "absolute", zIndex: 1000 }}
                size={40}
                color="red"
              />}
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                color={colors.primary}
                style={styles.inputIcon}
                name={"at-outline"}
                size={20}
              />
              <View style={{ backgroundColor: "transparent" }}>
                <Text style={{ color: "gray", marginLeft: 14, fontSize: 12 }}>
                  Your username
                </Text>
                <TextInput
                  onChangeText={(text) => setChange({ ...change, username: text })}
                  style={styles.inputs}
                  placeholder="Username"
                  placeholderTextColor={"black"}
                  underlineColorAndroid="transparent"
                  value={change.username}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={updateAccount}
              style={[styles.buttonContainer, styles.loginButton]}
            >
              <Text style={styles.loginText}>Update info</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </RBSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    alignSelf: "center",
  },
  imageContainer: {
    borderColor: colors.light,
    borderWidth: 10,
    width: 170,
    height: 170,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  topContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    marginVertical: 20,
  },
  userDetails: {
    marginTop: 10,
  },
  userfullname: {
    fontWeight: "bold",
    color: "black",
    fontSize: 18,
  },
  username: {
    color: colors.primary,
    textAlign: "center",
    marginTop: 5,
  },
  stats: {
    marginVertical: 30,
    flexDirection: "row",
    padding: 3,
  },
  stattext: {
    color: colors.black,
    fontSize: 30,
  },
  stat_block: {
    width: 120,
    alignItems: "center",
    backgroundColor: colors.light,
    padding: 5,
    borderRadius: 10,
  },
  innerMenu: {
    flexDirection: "row",
    padding: 5,
    width: "100%",
  },
  menuItemWrapper: {
    marginLeft: 2,
    marginRight: 10,
    borderRadius: 50,
    flex: 1,
    flexDirection: "row",
  },
  menuItemText: {
    fontSize: 14,
    textAlign: "center",
    alignSelf: "center",
    marginLeft: 20,
  },

  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#EEEEEE",
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 25,
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
    marginTop: -5,
    width: '100%'
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
    width: 150,
    borderRadius: 30,
    alignSelf: "center",
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
    fontSize: 14,
    fontWeight: "bold",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 30,
    textAlign: "center",
    alignItems: "center",
  },
});
