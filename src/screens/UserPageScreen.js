import * as React from "react"
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
} from "react-native"
import { StyleSheet, Text, Image } from "react-native"
import { Tabs } from "react-native-collapsible-tab-view"
import StickFeed from "../components/StickFeed"
import colors from "../config/colors"
import { useEffect, useRef, useState } from "react"
import {
  AntDesign,
  Feather,
} from "@expo/vector-icons"
import Calabash from "../components/Tree/Calabash"
// import QueryString from "querystring"
import DropdownAlert from "react-native-dropdownalert"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  SkypeIndicator,
} from "react-native-indicators"
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, setDoc, updateDoc, Unsubscribe } from "firebase/firestore"
import { database } from "../config/firebase"
import { useDispatch, useSelector } from "react-redux"
import { selectUser, setWatching } from "../redux/features/user"
import { sendPushNotification } from "../hooks/Notifications"
import { useFocusEffect } from "@react-navigation/native"
import UserNavigator from "../Utils/UserNavigate"

const HEADER_HEIGHT = 160

const Header = (route, navigation) => {
  const [userdata, setUserData] = useState({
    profile: '',
    fullname: '',
    username: '',
    pushToken: '',
    sticks: 0,
    watching: 0,
    watchers: 0
  })
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isWatching, setIsWatching] = useState(false)
  const currUser = useSelector(selectUser)
  const [stopwatching, setStopWatching] = useState(false)
  const [startwatching, setStartWatching] = useState(false)
  const dispatch = useDispatch()

  // check usre who are watching
  const checkIfWatching = async () => {
    const watching = (await getDoc(doc(database, `users/${currUser.uid}/watching/${route?.params?.data.id}`)))
    if (watching.exists()) setIsWatching(true)
  }

  // start watching
  const watchUser = async () => {
    setStartWatching(true)

    const postDataA = {
      user: route?.params?.data.id,
      date: new Date().toUTCString(),
      profile: userdata.profile,
      fullname: userdata.fullname,
      username: userdata.username,
      token: userdata?.pushToken ? userdata?.pushToken : ''
    }

    const postDataB = {
      user: currUser.uid,
      date: new Date().toUTCString(),
      profile: currUser.profile,
      fullname: currUser.fullname,
      username: currUser.username,
      token: currUser?.pushToken ? currUser?.pushToken : ''
    }

    // add docs watching
    setDoc(doc(database, `users/${currUser.uid}/watching/${route?.params?.data.id}`), postDataA)
      .then(async () => {
        // update users data
        await updateDoc(doc(database, `users/${currUser.uid}`), { watching: currUser.watching + 1 })
        // set document on the other user 
        await setDoc(doc(database, `users/${route?.params?.data.id}/watchers/${currUser.uid}`), postDataB)
        await updateDoc(doc(database, `users/${route?.params?.data.id}`), { watchers: userdata.watchers + 1 })

        dispatch(setWatching(currUser.watching + 1))
        setStartWatching(false)
        setIsWatching(true)

        await AsyncStorage.setItem('watching', 'yes')

        setUserData({ ...userdata, watchers: userdata.watchers + 1 })

        const notification = {
          to: userdata.pushToken,
          content: {
            sound: 'default',
            title: `New watcher`,
            body: `${currUser.fullname} started watching you.`,
            data: {
              id: currUser.uid,
              otherUser: currUser,
              action: 'new watch'
            },
            date: new Date().toUTCString()
          }
        }

        sendPushNotification(notification)
        // add notification in the doc
        addDoc(collection(database, `users/${route?.params?.data.id}/notifications`), notification.content)
      })
  }

  // start watching
  const stopWatchingUser = async () => {
    setStopWatching(true)
    // add docs watching
    deleteDoc(doc(database, `users/${currUser.uid}/watching/${route?.params?.data.id}`))
      .then(async () => {
        // delete document from the other user 
        await deleteDoc(doc(database, `users/${route?.params?.data.id}/watchers/${currUser.uid}`))
        const watching = currUser.watching !== 0 ? currUser.watching - 1 : 0
        const otherWacthing = userdata.watchers !== 0 ? userdata.watchers - 1 : 0
        // update users data
        await updateDoc(doc(database, `users/${currUser.uid}`), { watching: watching })
        await updateDoc(doc(database, `users/${route?.params?.data.id}`), { watchers: otherWacthing })

        setUserData({ ...userdata, watchers: otherWacthing })

        await AsyncStorage.setItem('watching', 'no')

        dispatch(setWatching(watching))
        setStopWatching(false)
        setIsWatching(false)
        navigation.goBack()
      })
  }


  // innit chat
  const initChatRoom = async (item) => {
    navigation.navigate("RiverChatRoom", { data: { ...item, id: route?.params?.data.id } });
  }

  useEffect(() => {
    async function getUser(id) {
      const result = (await getDoc(doc(database, `users/${id}`))).data()
      if (result) setUserData(result);
    }

    if (route?.params?.data?.watchers) {
      setUserData(route?.params?.data)
    } else {
      getUser(route?.params?.data.id)
    }

    checkIfWatching()
  }, [])


  return (
    <View style={styles.header}>
      {userdata &&
        <View
          style={{
            padding: 10,
            marginTop: 15,
            flexDirection: "row",
            left: 6,
          }}
        >
          {userdata.profile !== '' ? <TouchableOpacity onPress={() =>
            navigation.navigate('ViewPhoto', { photo: userdata.profile, name: userdata.fullname })}><Image style={styles.image} source={{ uri: userdata.profile }} />
          </TouchableOpacity> : <View style={styles.image} />}

          <View style={{ marginLeft: 18, justifyContent: "center" }}>
            <View style={{}}>
              <Text style={{ fontWeight: "bold", left: 0, color: "black" }}>
                {userdata.fullname}
              </Text>
              <Text style={{ color: colors.primary, fontSize: 10, top: -2 }}>
                @{userdata.username}
              </Text>
            </View>

            <View style={{ flexDirection: "row", left: -5, marginBottom: 10 }}>
              <TouchableOpacity
                onPress={() => UserNavigator("sticks", navigation, route?.params.data.id)}
                style={{ top: 10, alignItems: "center" }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: colors.primary,
                    fontSize: 15,
                    textAlign: "center",
                  }}
                >
                  {userdata.sticks}
                </Text>
                <Text style={{ left: 5, fontSize: 12 }}>Sticks</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ top: 10, alignItems: "center", left: 20 }}
                onPress={() => navigation.navigate("UserWatchingList", { user: route?.params.data.id })}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: colors.primary,
                    fontSize: 15,
                  }}
                >
                  {userdata.watching}
                </Text>
                <Text style={{ left: 5, fontSize: 12 }}>Watching</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("UserWatchers", { user: route?.params.data.id })}
                style={{ top: 10, left: 40, alignItems: "center" }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: colors.primary,
                    fontSize: 15,
                  }}
                >
                  {userdata.watchers}
                </Text>
                <Text style={{ left: 5, fontSize: 12 }}>Watchers</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 15, flexDirection: "row" }}>
              {isWatching ? (
                <>
                  <TouchableOpacity
                    onPress={() => stopWatchingUser()}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.primary,
                      padding: 5,
                      borderRadius: 50,
                      alignItems: "center",
                      width: 130,
                      height: 30,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Feather
                        style={{ marginLeft: 0, alignSelf: "center" }}
                        name={"eye-off"}
                        size={15}
                        color={colors.primary}
                      />
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: colors.primary,
                          marginLeft: 5,
                          alignSelf: "center",
                        }}
                      >
                        Stop watching
                      </Text>
                      {stopwatching ? (
                        <ActivityIndicator
                          style={{ marginLeft: 5 }}
                          color={colors.primary}
                          size={"small"}
                        />
                      ) : null}
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => initChatRoom(userdata)}
                    style={{
                      backgroundColor: colors.primary,
                      padding: 5,
                      borderRadius: 50,
                      alignItems: "center",
                      width: 100,
                      height: 30,
                      marginLeft: 4,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <AntDesign
                        style={{
                          marginLeft: -3,
                          marginRight: 5,
                          alignSelf: "center",
                        }}
                        color={"white"}
                        size={15}
                        name={"message1"}
                      />
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "white",
                          alignSelf: "center",
                        }}
                      >
                        Start flow
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => watchUser()}
                  style={{
                    backgroundColor: colors.primary,
                    padding: 5,
                    borderRadius: 50,
                    alignItems: "center",
                    width: 140,
                    height: 30,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Feather
                      style={{ marginLeft: -8 }}
                      name={"eye"}
                      size={20}
                      color={"white"}
                    />
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        marginLeft: 5,
                      }}
                    >
                      Watch
                    </Text>

                    {startwatching ? (
                      <ActivityIndicator
                        style={{ marginLeft: 5 }}
                        color={"white"}
                        size={"small"}
                      />
                    ) : null}
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>}
    </View>
  )
}


export default function UserPageScreen({ route, navigation }) {
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isWatching, setIsWatching] = useState(false)
  const dropdownAlert = useRef()
  const currUser = useSelector(selectUser)
  const [userdata, setUserData] = useState({
    profile: '',
    fullname: '',
    username: '',
    pushToken: '',
    sticks: 0,
    watching: 0,
    watchers: 0
  })
  let unsub;




  // check usre who are watching
  const checkIfWatching = async () => {
    const docQuery = doc(database, `users/${currUser.uid}/watching/${route?.params?.data.id}`)
    unsub = onSnapshot(docQuery, snap => {
      if (snap.data()?.user) setIsWatching(true)
    })
  }


  // listend to react navigation native hooks 
  useFocusEffect(
    React.useCallback(() => {
      async function getUser(id) {
        const result = (await getDoc(doc(database, `users/${id}`))).data()
        if (result) setUserData(result);
      }

      if (route?.params?.data?.watchers) {
        setUserData(route?.params?.data)
      } else {
        getUser(route?.params?.data.id)
      }
      checkIfWatching()

      return () => {
        // removing listeners
        if (unsub) unsub()
      }
    }, [])
  )

  return (
    <Tabs.Container
      HeaderComponent={() => Header(route, navigation)}
      headerHeight={HEADER_HEIGHT}
    >
      <Tabs.Tab name="Sticks">
        <Tabs.ScrollView>
          {shouldLoad ? (
            <SkypeIndicator
              style={{ position: "absolute", zIndex: 1000 }}
              size={40}
              color="red"
            />
          ) : null}
          <View style={{ zIndex: 343454353 }}>
            {/*<DropdownAlert ref={dropdownAlert} />*/}
          </View>
          {isWatching ? <StickFeed user={route?.params?.data.id} profile={userdata.profile} route='User Page' /> :
            <Text style={{
              textAlign: 'center',
              marginTop: 100,
            }}>You can only view stick when watching {currUser.fullname}</Text>}
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="Calabash">
        <Tabs.ScrollView>
          <View style={{ padding: 5 }}>
            {isWatching ? <Calabash user={route?.params?.data} /> :
              <Text style={{
                textAlign: 'center',
                marginTop: 100,
              }}>You can only view pictures when watching {currUser.fullname}</Text>}
          </View>
        </Tabs.ScrollView>
      </Tabs.Tab>
    </Tabs.Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  box: {
    height: 250,
    width: "100%",
  },
  boxA: {
    backgroundColor: "white",
  },
  boxB: {
    backgroundColor: "#D8D8D8",
  },
  header: {
    height: 145,
    width: "100%",
    backgroundColor: colors.white,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  newStickContainer: {
    flexDirection: "row",
    padding: 15,
  },

  stickInput: {
    height: 80,
    maxHeight: 300,
  },
  inputsContainer: {
    marginLeft: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.primary,
    padding: 7,
    width: 280,
    backgroundColor: colors.light,
  },
  fieldText: {
    height: 20,
    top: 1,
    color: "#787D8B",
    width: 100,
    fontSize: 12,
  },
  titleSelectField: {
    fontSize: 16,
    color: "#0A0914",
    height: 24,
    width: 140,
  },
})
