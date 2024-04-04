import * as React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import colors from "../config/colors";
import { useFocusEffect } from "@react-navigation/native";
import { auth, database } from "../config/firebase";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, getDocs } from "firebase/firestore";
import { setData, setWatching } from "../redux/features/user";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function WelcomeScreen({ navigation } ) {
  const dispatch = useDispatch()
  // listen to react navigation native hooks
  useFocusEffect(
    React.useCallback(() => {
      checkUser()
      return () => {
      }
    }, [])
  )



  // check user method
  const checkUser = async () => {
    const data = await AsyncStorage.getItem('newuser')

    if (data !== null && data === 'no') {
      const unsubUser = onAuthStateChanged(auth, async user => {

        if (user) {

          const docRef = doc(database, `users/${user.uid}`)
          const result  = (await getDoc(docRef)).data()

          if (result) {
            // set driver data
            const data = {
              username: result.username,
              uid: user.uid,
              fullname: result.fullname,
              profile: result.profile,
              sticks: result.stick || 0,
              watching: result.watching || 0,
              watchers: result.watchers || 0,
              villages: result.villages || 0,
              pushToken: result.pushToken || '',
            }

            dispatch(setData(data))

            // navigate to request since it is a driver logged in
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
          } else {
            navigation.navigate('LoginScreen')
          }
        } else {
          navigation.navigate('LoginScreen')
        }
        unsubUser()
      })
    } else if (data !== null && data === 'yes') {
      navigation.navigate('LoginScreen')
    } else {
      navigation.navigate('Welcome', { params: { screen: 'WelcomeScreen' } })
    }
  }

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center'
    }}>
      <ActivityIndicator color={colors.primary} size='large' />
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundVideo: {
    width: "100%",
    height: "100%",
  },
  bottomCotainer: {
    bottom: 0,
    position: "absolute",
    padding: 20,
    flex: 1,
    width: "100%",
    zIndex: 19000,
  },
  buttonaA: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 30,
  },
  buttonaB: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 30,
    marginVertical: 10,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonBText: {
    color: colors.primary,
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
    width: 150,
    height: 150,
    margin: 0,
  },
  slogan: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
});
