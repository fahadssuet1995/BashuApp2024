import RiverFeed from "../components/RiverFeed"
import * as React from "react"
import {
  Alert,
  Dimensions,
  Keyboard,
  Pressable,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import * as Device from 'expo-device'
import { StyleSheet, Text, Image } from "react-native"
import { FlatList, Tab, Tabs } from "react-native-collapsible-tab-view"
import StickFeed from "../components/StickFeed"
import colors from "../config/colors"
import { FC, useEffect, useRef, useState } from "react"
import {
  Ionicons, Entypo
} from "@expo/vector-icons"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import Calabash from "../components/Tree/Calabash"
import DropdownAlert from "react-native-dropdownalert"
import {
  SkypeIndicator,
} from "react-native-indicators"
import RBSheet from "react-native-raw-bottom-sheet"
import * as Notifications from "expo-notifications"
import UserNavigator from "../Utils/UserNavigate"
import { useDispatch, useSelector } from "react-redux"
import { selectUser, setNotify, setPushtoken, setSticks } from "../redux/features/user"
import { addDoc, collection, doc, getDoc, getDocs, limit, onSnapshot, query, Unsubscribe, updateDoc, where } from "firebase/firestore"
import { database } from "../config/firebase"
import { registerForPushNotifications, sendPushNotification } from '../hooks/Notifications'
import { addStick, selectLoading, selectWatching, setDataSticks } from "../redux/features/data"
import titles from "../data/titles"
import { ScrollView } from "react-native-gesture-handler"
import AsyncStorage from "@react-native-async-storage/async-storage"

const HEADER_HEIGHT = 120


const Header = () => {
  const navigation  = useNavigation()
  const userdata = useSelector(selectUser)


  return (
    <View style={styles.header}>
      <View
        style={{
          padding: 10,
          marginTop: 15,
          flexDirection: "row",
          left: 6,
        }}
      >
        {userdata.profile !== '' && <TouchableOpacity activeOpacity={.4} onPress={() => navigation.navigate("ProfileScreen")}>
          <Image style={styles.image} source={{ uri: userdata.profile }} />
        </TouchableOpacity>}

        <View style={{ marginLeft: 18, justifyContent: "center" }}>
          <View style={{}}>
            <Text style={{ fontWeight: "bold", left: 0, color: "black" }}>
              {userdata.fullname}
            </Text>
            <Text style={{ color: colors.primary, fontSize: 10, top: -2 }}>
              @{userdata.username}
            </Text>
          </View>

          <View style={{
            flexDirection: "row",
            marginBottom: 10,
            justifyContent: 'space-between',
            width: '80%'
          }}>
            <TouchableOpacity
              onPress={() => UserNavigator("sticks", navigation, userdata.uid)}
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
              onPress={() => navigation.navigate("UserWatchingList", { user: userdata.uid })}
              style={{
                zIndex: 129990,
                top: 10,
                alignItems: "center",
              }}
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
              onPress={() => navigation.navigate("UserWatchers", { user: userdata.uid })}
              style={{ top: 10, alignItems: "center" }}
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


          <View style={{
            flexDirection: "row",
            position: 'absolute',
            top: 2,
            left: 138
          }}>
          </View>
        </View>
      </View>
    </View>
  )
}


export default function TreeScreen() {
  const [stick, setStick] = useState("")
  const [title, setTitle] = useState("")
  const [search, setSearch] = useState("")
  const userdata = useSelector(selectUser)
  const [shouldLoad, setShouldLoad] = useState(false)
  const dropdownAlert  = useRef()
  const commentsRef = useRef()
  const tagsRef = useRef()
  const navigation  = useNavigation()
  const [currentCount, setcurrentCount] = useState("0 / 500")
  const dispatch = useDispatch()
  const notificationListener  = React.useRef()
  const responseListener  = React.useRef()
  let unsubUserSt;
  const dataLoading = useSelector(selectLoading)
  const [filtered, setFiltered]  = useState(titles)
  const [all, setAll]  = useState(titles)
  const [showTitle, setShowTitle] = useState(false)
  const [locked, setLocked] = useState(false)
  const dim = Dimensions.get('screen').height
  const [tagUser, setTagUser] = useState([]);
  const [tags, setTags]  = useState(useSelector(selectWatching));
  const [tagsfiltered, setTagsFiltered]  = useState([]);
  const [showTags, setShowTags] = useState(false)
  const [dimHeight, setDimHeight] = useState(150)




  // get user's sticks
  const getUserData = () => {
    unsubUserSt = onSnapshot(query(collection(database, `sticks`), where('user', '==', userdata.uid)), res => {
      const sticks  = res.docs.map(doc => {
        const id = doc.id
        const data = doc.data()
        return { id, ...data }
      })

      sticks.sort(function compare(a , b ) {
        let dateA = new Date(a.date);
        let dateB = new Date(b.date);
        return dateB - dateA;
      })

      dispatch(setDataSticks(sticks))
      dispatch(setSticks(sticks.length))
    })
  }


  // listend to react navigation native hooks
  useFocusEffect(
    React.useCallback(() => {
      async function getLocked() {
        const locked = await AsyncStorage.getItem('locked')
        if (locked !== null) {
          setTitle(JSON.parse(locked).title)
          setLocked(JSON.parse(locked).locked)
        }
      }

      getLocked()
      getUserData()
      return () => {
        // removing listeners
        if (unsubUserSt) unsubUserSt()
      }
    }, [])
  )

  // filter user method
  const filterTitle = (text ) => {
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = all.filter((item ) => {
        const itemData = item.name
          ? item.name.toUpperCase()
          : ''.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
      })

      setFiltered(newData)
      setSearch(text)
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFiltered(all)
      setSearch(text)
    }
  }

  // use effect to fire some action on the go
  useEffect(() => {
    async function getLocked() {
      const locked = await AsyncStorage.getItem('locked')
      if (locked !== null) {
        setTitle(JSON.parse(locked).title)
        setLocked(JSON.parse(locked).locked)
      }
    }

    // AsyncStorage.removeItem('notifications')
    // notificaiton set up
    const notificationSettUp = () => {
      // AsyncStorage.removeItem('notifications')
      registerForPushNotifications().then((token ) => {

        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        })

        if (userdata.pushToken === '' || userdata.pushToken === undefined) {
          dispatch(setPushtoken(token))
          // updating data on firestore
          updateDoc(doc(database, `users/${userdata.uid}`), { pushToken: token })
        }

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(async response => {
          const budge = await Notifications.getBadgeCountAsync()
          //decreasing the badge count
          await Notifications.setBadgeCountAsync(budge - 1)

          dispatch(setNotify(userdata.notifications > 0 ? userdata.notifications - 1 : userdata.notifications))

          switch (response?.notification?.request.content.data.action) {
            case 'like stick':
              navigation.navigate('StickComments', {
                data: {
                  id: response?.notification?.request?.content.data.itemId,
                  content: response?.notification?.request?.content.data.content,
                  title: response?.notification?.request?.content.data.title,
                  otherUser: response?.notification?.request?.content.data.otherUser,
                }
              })
              break
            case 'like calabash':
              navigation.navigate('CalabashSticks', {
                data: {
                  id: response?.notification?.request?.content.data.itemId,
                  description: response?.notification?.request?.content.data.description,
                  title: response?.notification?.request?.content.data.title,
                  file: response?.notification?.request?.content.data.file,
                  user: userdata.uid
                }
              })
              break

            case 'new watch':
              navigation.navigate('UserPage', {
                data: {
                  id: response?.notification?.request?.content.data.id,
                }
              })
              break

            case 'tag calabash':
              navigation.navigate('CalabashSticks', {
                data: {
                  id: response?.notification?.request?.content.data.itemId,
                  description: response?.notification?.request?.content.data.content,
                  title: response?.notification?.request?.content.data.title,
                  file: response?.notification?.request?.content.data.file,
                  user: userdata.uid
                }
              })
              break


            case 'river stick':
              navigation.navigate('RiverChatRoom', {
                data: {
                  id: response?.notification?.request?.content.data.id,
                  otherUser: response?.notification?.request.content.data.otherUser
                }
              })
              break

            case 'stick tag':
              navigation.navigate('StickComments', {
                data: {
                  id: response?.notification?.request?.content.data.itemId,
                  content: response?.notification?.request?.content.data.content,
                  title: response?.notification?.request?.content.data.title,
                  otherUser: response?.notification?.request?.content.data.otherUser
                }
              })
              break
          }
        })

        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener((notification ) => {
          dispatch(setNotify(userdata.notifications + 1))
        })

        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current)
          Notifications.removeNotificationSubscription(responseListener.current)
        }
      })
    }

    if (Device.isDevice) {
      notificationSettUp()
    }

    getLocked()
    getWatchers()
  }, [])



  const showdropdownAlert = (msg ) => {
    dropdownAlert.current?.alertWithType(
      "error",
      msg
    )
  }

  const showSuccess = (msg ) => {
    dropdownAlert.current?.alertWithType(
      "success",
      msg
    )
  }



  // method that will be used to throw a stick
  const onThrowStick = async () => {
    if (title === "") {
      Alert.alert("Error", "Please select topic")
    } else if (stick === "") {
      Alert.alert("Error", "Stick content is empty")
    } else {
      setShouldLoad(true)

      const postData = {
        user: userdata.uid,
        title: title,
        content: stick,
        type: "stick",
        mentinos: tags.length > 0 ? tags.length : 0,
        date: new Date().toUTCString(),
        profile: userdata.profile,
        likes: 0,
        comments: 0,
        likesId: '',
        commentsId: '',
        username: userdata.username
      }

      await addDoc(collection(database, `sticks`), postData)
        .then((res) => {
          updateDoc(doc(database, `users/${userdata.uid}`), { sticks: userdata.sticks + 1 })
          dispatch(setSticks(userdata.sticks + 1))

          showSuccess('Your stick was thrown with success.')

          if (tagUser.length > 0) {
            tagUser.forEach(async tag => {
              const notification = {
                to: tag?.pushToken,
                content: {
                  sound: 'default',
                  title: `You were tagged`,
                  body: `${userdata.fullname} tagged you on a stick.`,
                  data: {
                    otherUser: userdata,
                    action: 'stick tag',
                    itemId: res.id,
                    title: title,
                    content: stick
                  },
                  date: new Date().toUTCString()
                }
              }

              if (tag.uid !== userdata.uid) {
                sendPushNotification(notification)
                await addDoc(collection(database, `users/${tag.uid}/notifications`), notification.content)
              }
            })
          }

          // reset tags
          setTagUser([])

          setStick("")
          setShouldLoad(false)
        })
    }
  }

  const getWatchers = async () => {
    const data = (await getDocs(query(collection(database, `users/${userdata.uid}/watchers`), limit(100))))

    const result = data.docs.map(doc => {
      const id = doc.id
      const data = doc.data()
      return { ...data, id }
    })

    setTags(result)
    setTagsFiltered(result)
  }


  const openTags = async (text ) => {
    if (tags.length > 0) {
      if (text) {
        const newData = tags.filter((item ) => {
          const itemData = item.username
            ? item.username.toUpperCase()
            : ''.toUpperCase()
          const textData = text.split('@')[1].toUpperCase()
          return itemData.indexOf(textData) > -1
        })

        setTagsFiltered(newData)
        setShowTags(true)
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with masterDataSource
        setTagsFiltered(tags)
        setShowTags(false)
      }
    } else {
      const data = (await getDocs(query(collection(database, 'users'), limit(100))))

      const result = data.docs.map(doc => {
        const id = doc.id
        const data = doc.data()
        return { ...data, id }
      })

      setTags(result)
      setTagsFiltered(result)
      setShowTags(true)
    }
  }


  const setUpTags = (text ) => {
    let index;
    const arr = text.split(' ').map((val, i) => {
      if (val.includes('@')) return index = i
    })

    if (index === 0) {
      openTags(text)
    } else {
      index && text.split(' ')[text.split(' ').length - 1] === text.split(' ')[index]
        ? openTags(text.split(' ')[index])
        : setShowTags(false)
    }


    setStick(text)
    let count = text.length;
    let appendCount = count + " / 500";
    setcurrentCount(appendCount);
  }


  return (
    <Tabs.Container
      renderHeader={() => <Header title="Stick" />}
      headerHeight={HEADER_HEIGHT}
    // optional
    >
      <Tabs.Tab name="Sticks">
        <Tabs.ScrollView>
          {shouldLoad || dataLoading ? (
            <SkypeIndicator
              style={{
                position: "absolute",
                zIndex: 10000000,
                alignSelf: "center",
                left: 180,
                top: 20
              }}
              size={40}
              color="#5d8ecf"
            />
          ) : null}

          <SafeAreaView>
            <View style={{ zIndex: 343454353 }}>
             
            </View>


            <View style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 20
            }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Select Topic</Text>

              <TouchableOpacity onPress={() => {
                commentsRef.current.open()
                setDimHeight(150)
              }} style={{
                margin: 10,
                marginBottom: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Text style={{
                  fontSize: 14
                }}> {title !== '' ? title : 'Select topic'}</Text>
                <Ionicons
                  name={"chevron-down"}
                  color={"#0A0914"}
                  size={20}
                  style={{
                    marginLeft: 10
                  }}
                />

                <Entypo
                  onPress={async () => {
                    if (locked) {
                      await AsyncStorage.setItem('locked', JSON.stringify({ title: '', locked: false }))
                        .then(() => {
                          setLocked(false)
                        })
                    } else {
                      if (title !== '') {
                        await AsyncStorage.setItem('locked', JSON.stringify({ title: title, locked: true }))
                          .then(() => {
                            setLocked(true)
                          })
                      }
                    }
                  }}
                  name={locked ? "lock" : "lock-open"}
                  color={locked ? colors.medium : colors.primary}
                  size={20}
                  style={{
                    marginLeft: 10
                  }}
                />
              </TouchableOpacity>
            </View>

            <TextInput multiline={true} placeholder='Say something' style={{
              width: '90%',
              height: 100,
              marginHorizontal: 20,
              marginTop: 15,
              borderWidth: 2,
              borderColor: colors.primary,
              borderRadius: 5,
              padding: 20,
            }}
              value={stick}
              onChangeText={(text ) => setUpTags(text)}
            />

            <Text style={{
              marginLeft: 20,
              fontSize: 12,
              marginTop: 5,
              color: colors.primary
            }}>{currentCount}</Text>

            <TouchableOpacity
              onPress={() => {
                onThrowStick()
                commentsRef.current.close()
              }}
              style={{
                position: "relative",
                backgroundColor: colors.primary,
                padding: 5,
                width: 100,
                borderRadius: 5,
                marginLeft: 250,
                marginTop: -15,
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  alignSelf: "center",
                }}
              >
                Throw stick
              </Text>
            </TouchableOpacity>


            {showTags &&
              <FlatList style={{
                position: 'absolute',
                right: 20,
                left: 20,
                top: 230,
                height: 280
              }}>
                <Text style={{
                  fontSize: 15,
                  marginLeft: 20,
                  fontWeight: 'bold'
                }}>Tag your watchers</Text>
                {
                  tagsfiltered.map((item ) => {
                    return (
                      <TouchableOpacity key={item.id} onPress={async () => {
                        setTagUser([...tagUser, { user: item.username, uid: item.id, pushToken: item.token }])
                        const content = stick.split(' ')
                        content[content.length - 1] = tagUser[tagUser.length - 1]?.user ?
                          `${tagUser[tagUser.length - 1].user} ` : `${item.username} `

                        setStick(content.join(' '))
                        setShowTags(false)
                      }} style={{
                        height: 25,
                        marginHorizontal: 20,
                        marginVertical: 15
                      }}>
                        <View style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          marginLeft: 5,
                          alignItems: 'center',
                        }}>
                          <Image source={{ uri: item?.profile }} style={{
                            width: 40,
                            height: 40,
                            borderRadius: 50,
                            marginRight: 10,
                            backgroundColor: 'lightgrey'
                          }} />
                          <Text>{item.username}</Text>
                        </View>

                      </TouchableOpacity>
                    )
                  })
                }</FlatList>}
            {!showTags && <StickFeed user={userdata.uid} profile={userdata?.profile} route='Tree Screen' />}
          </SafeAreaView>
        </Tabs.ScrollView>

        <RBSheet
          ref={commentsRef}
          height={dim - 150}
          closeOnDragDown={true}
          openDuration={0}
          onClose={() => {
            setShowTitle(false)
          }}
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


          {!showTags && <TextInput multiline={true} value={search} placeholder='Search topic' style={{
            width: '90%',
            marginHorizontal: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 20

          }}
            onChangeText={(text ) => filterTitle(text)}
          />}

          <ScrollView>
            {filtered.map((item ) => {
              return (
                <TouchableOpacity key={item.id} onPress={async () => {
                  setTitle(item.name)
                  commentsRef?.current.close()
                  if (locked) {
                    await AsyncStorage.setItem('locked', JSON.stringify({ title: item.name, locked: true }))
                      .then(() => {
                        setLocked(true)
                      })
                  }
                }} style={{
                  height: 25,
                  marginHorizontal: 20,
                  marginVertical: 5
                }}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>

          <View style={{
            marginBottom: 35
          }}>
          </View>
        </RBSheet>
      </Tabs.Tab>



      <Tabs.Tab name="Calabash">
        <Tabs.ScrollView>
          <View style={{ padding: 5 }}>
            <Calabash user={userdata} />
          </View>
        </Tabs.ScrollView>

        {shouldLoad || dataLoading ? (
          <SkypeIndicator
            style={{
              position: "absolute",
              zIndex: 10000000,
              alignSelf: "center",
              left: 180,
              top: 30
            }}
            size={40}
            color="red"
          />
        ) : null}

        <TouchableOpacity
          onPress={() => navigation.navigate('NewCalabash')}
          style={{
            position: "absolute",
            bottom: 30,
            right: 20,
            backgroundColor: colors.primary,
            padding: 5,
            borderRadius: 100,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name={"add-circle"} color={"white"} size={30} />
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              alignItems: "center",
              paddingRight: 5,
            }}
          >
            Add Image
          </Text>
        </TouchableOpacity>
      </Tabs.Tab>

      <Tabs.Tab name="River">
        <Tabs.ScrollView>
          <RiverFeed user={userdata.uid} />
        </Tabs.ScrollView>

        <TouchableOpacity
          onPress={() => navigation.navigate("NewRiverFlow")}
          style={{
            position: "absolute",
            bottom: 30,
            right: 20,
            backgroundColor: colors.primary,
            padding: 5,
            borderRadius: 100,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name={"add-circle"} color={"white"} size={30} />
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              alignItems: "center",
              paddingRight: 5,
            }}
          >
            Start Flow
          </Text>
        </TouchableOpacity>
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
    height: HEADER_HEIGHT,
    width: "100%",
    backgroundColor: colors.white,
    elevation: 15,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 100,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  newStickContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },

  stickInput: {
    padding: 10,
  },
  inputsContainer: {
    marginLeft: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.primary,
    padding: 10,
    width: "90%",
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

