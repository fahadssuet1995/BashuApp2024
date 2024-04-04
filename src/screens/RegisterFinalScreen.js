import * as React from "react"
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  Platform,
} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import colors from '../config/colors'
import { useNavigation } from "@react-navigation/native"
import { useRef } from "react"
import DropdownAlert from "react-native-dropdownalert"
import { SkypeIndicator } from "react-native-indicators"
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { database, storage } from '../config/firebase'
import { useDispatch } from "react-redux"
import { setData } from "../redux/features/user"
import { compress } from "../hooks/ImageCompressor"


export default function SignInScreen({ route }) {
  const navigation = useNavigation()
  const dropdownAlert = useRef()
  const [photoShow, setPhotoShow] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const dispatch = useDispatch()

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3]
    })

    if (!result.canceled) {
      setPhotoShow(result.assets[0].uri)
      return await updateData(result.assets[0].uri)
    }
  }


  const updateData = async (file) => {
    try {
      setLoading(true)

      if (route.params.uid) {
        const uid = route.params.uid
        const url = await uploadImage(file, uid)

        if (url) {

          const userDoc = doc(database, `users/${uid}`)
          await updateDoc(userDoc, { profile: url })
            .then(async () => {
              const result = (await getDoc(doc(database, `users/${uid}`))).data()

              if (result) {
                const data = {
                  uid: uid,
                  username: result.username,
                  fullname: result.fullname,
                  profile: url,
                  sticks: result.stick || 0,
                  watching: result.watching || 0,
                  watchers: result.watchers || 0,
                  villages: result.village || 0,
                  pushToken: result.pushToken || '',
                  notifications: 0
                }

                // updating users data
                dispatch(setData(data))
                setLoading(false)

                navigation.reset({
                  index: 0,
                  routes: [{
                    name: 'Authed',
                    state: {
                      routeNames: ['Main'],
                      routes: [{ name: 'Root' }]
                    }
                  }]
                })
              }
            })
            .catch(() => {
              setLoading(false)
              Alert.alert('Oopss', 'We could not create your account at the moment, please try again later', [{ text: 'OK' }])
            })
        }
      }
    } catch (error) {
      setLoading(false)
      Alert.alert('Oopss', 'We could not create your account at the moment, please try again later', [{ text: 'OK' }])
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

  return (
    <View style={{ flex: 1 }}>
      <View style={{ width: "100%", zIndex: 810000 }}>
        <DropdownAlert ref={dropdownAlert} />
      </View>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>
          {!photoShow ? 'Almost there! Upload profile picture' : 'Uploading picture'}
        </Text>

        {loading ? (
          <SkypeIndicator
            style={{ position: "absolute", zIndex: 1000 }}
            size={40}
            color="red"
          />
        ) : null}

        <TouchableOpacity
          style={{
            padding: 10,
            marginBottom: 40,
            backgroundColor: "lightgray",
            borderRadius: 10,
          }}
        >
          <Image
            style={{ width: 200, height: 200, borderRadius: 100 }}
            source={{
              uri: photoShow == "" ? null : photoShow,
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => pickImage()}
          style={[styles.buttonContainer, styles.loginButton]}
        >
          {photoShow === null ? <Text style={styles.loginText}>Select image</Text> :
            <Text style={styles.loginText}>Uploading...</Text>}
        </TouchableOpacity>
      </View>
    </View>
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
    width: 200,
    borderRadius: 30,
  },
  imageContainer: {
    marginBottom: 50,
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
  },
  orContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    // fontWeight: "bold",
    marginVertical: 30,
    textAlign: "center",
  },
  back: {
    top: 20,
    left: 10,
  },
  bottomContainer: {
    bottom: 20,
    position: "absolute",
  },
})
