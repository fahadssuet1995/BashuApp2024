import React, { useRef, useState } from "react"
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native"
import ProfilePicture from "../components/ProfilePicture"
import colors from "../config/colors"
import { FontAwesome, Ionicons, Entypo } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"

import moment from "moment"
import titles from "../data/titles"
import RBSheet from "react-native-raw-bottom-sheet"
import { useSelector } from "react-redux"
import { selectUser } from "../redux/features/user"
import { addDoc, collection, doc, getDoc, onSnapshot, setDoc, Unsubscribe, updateDoc } from "firebase/firestore"
import { database } from "../config/firebase"
import { sendPushNotification } from "../hooks/Notifications"
import { useFocusEffect } from "@react-navigation/native"




export default function RiverChatRoomScreen({ route, navigation }) {
  const [content, setContent] = useState("")
  const [user, setUser] = useState(null)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const chatReplyInput = useRef()
  const [title, setTitle] = useState("")
  const [search, setSearch] = useState("")
  const selectTitleSheet = useRef
  const [isMessageSent, setisMessageSent] = useState(false)
  const [filtered, setFiltered] = useState(titles)
  const [all, setAll] = useState(titles)
  const userdata = useSelector(selectUser)
  let unsubUserSt;
  const [locked, setLocked] = useState(false)



  // get messages
  const getData = async () => {
    const id = route.params.data.otherUser.uid ? route.params.data.otherUser.uid : route.params.data.otherUser.user
    const data = (await getDoc(doc(database, `users/${id}`))).data()
    if (data) setUser(data)
    
    setLoading(true)
    unsubUserSt = onSnapshot(collection(database, `users/${userdata.uid}/chat/${route?.params?.data.id}/chatroom`), async res => {
      const result = res.docs.map(res => {
        const id = res.id
        const data = res.data()
        return { id, ...data }
      })

      // sorting data in the array
      result.sort((a, b) => {
        let keyA = new Date(a.date), keyB = new Date(b.date)
        // Compare the 2 dates
        if (keyA < keyB) return -1
        if (keyA > keyB) return 1
        return 0
      })

      setData(result)
      setLoading(false)
    })
  }

  const onTitleSelected = (mtitle) => {
    setTitle(mtitle)
    selectTitleSheet.current.close()
  }

  const openSelectTitleSheet = async () => {
    selectTitleSheet.current.open()
  }

  const keyboardVerticalOffset = Platform.OS === "ios" ? 60 : 0

  // adding msg
  const addMessage = async () => {
    if (content === "" || title === "") {
      alert('Please set title and add message.')
    } else {
      setIsSending(true)

      const postDataA = {
        otherUser: {
          uid: route?.params?.data.id,
          profile: route?.params?.data?.otherUser ? route?.params?.data.otherUser.profile : route?.params?.data.profile,
          fullname: route?.params?.data?.otherUser ? route?.params?.data.otherUser.fullname : route?.params?.data.fullname,
          pushToken: route?.params?.data.token ? route?.params?.data.token : null
        },
        user: userdata.uid,
        content: content,
        title: title,
        type: 'sender',
        date: new Date().toUTCString()
      }

      // set data
      addDoc(collection(database, `users/${userdata.uid}/chat/${route?.params?.data.id}/chatroom`), postDataA)
        .then(async (res) => {
          const chatIdContent = {
            id: res.id,
            date: postDataA.date,
            content: postDataA.content,
            title: postDataA.title,
            otherUser: {
              uid: route?.params?.data.id || route?.params?.data.uid,
              profile: route?.params?.data?.otherUser ? route?.params?.data.otherUser.profile : route?.params?.data.profile,
              fullname: route?.params?.data?.otherUser ? route?.params?.data.otherUser.fullname : route?.params?.data.fullname,
              pushToken: route?.params?.data.pushToken ? route?.params?.data.pushToken : user.pushToken
            }
          }

          setContent("")
          setIsSending(false)
          setisMessageSent(true)

          setTimeout(() => {
            setisMessageSent(false)
          }, 1500)

          const notification = {
            to: user.pushToken,
            content: {
              sound: 'default',
              title: title,
              body: `${userdata.fullname} sent you a stick on your river`,
              data: {
                action: 'river stick',
                id: userdata.uid,
                otherUser: {
                  uid: userdata.uid,
                  profile: userdata.profile,
                  fullname: userdata.fullname,
                  pushToken: userdata.pushToken !== '' ? userdata.pushToken : null
                }
              }
            }
          }

          if (userdata.pushToken !== route?.params?.data.token) sendPushNotification(notification)

          //  add chat id
          await getDoc(doc(database, `users/${userdata.uid}/chat/${route?.params?.data.id}`))
            .then(res => {
              if (res.exists()) updateDoc(doc(database, `users/${userdata.uid}/chat/${route?.params?.data.id}`), chatIdContent)
              setDoc(doc(database, `users/${userdata.uid}/chat/${route?.params?.data.id}`), chatIdContent)
            })
        })

      const postDataB = {
        otherUser: {
          uid: userdata.uid,
          profile: userdata.profile,
          fullname: userdata.fullname,
          pushToken: userdata.pushToken !== '' ? userdata.pushToken : null
        },
        user: route?.params?.data.id,
        content: content,
        title: title,
        type: 'reciever',
        date: new Date().toUTCString()
      }

      // also adding the message on the other user's collection
      addDoc(collection(database, `users/${route?.params?.data.id}/chat/${userdata.uid}/chatroom`), postDataB)
        .then(async res => {
          const chatIdContent = {
            chatId: res.id,
            date: postDataB.date,
            content: postDataB.content,
            title: postDataB.title,
            data: {
              action: 'river stick',
              id: userdata.uid,
              otherUser: {
                uid: userdata.uid,
                profile: userdata.profile,
                fullname: userdata.fullname,
                pushToken: userdata.pushToken !== '' ? userdata.pushToken : null
              }
            }
          }

          //  add chat id
          await getDoc(doc(database, `users/${route?.params?.data.id}/chat/${userdata.uid}`))
            .then(res => {
              if (res.exists()) updateDoc(doc(database, `users/${route?.params?.data.id}/chat/${userdata.uid}`), chatIdContent)
              setDoc(doc(database, `users/${route?.params?.data.id}/chat/${userdata.uid}`), chatIdContent)
            })
        })
    }
  }

  // filter user method
  const filterTitle = (text) => {
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = all.filter((item) => {
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
      getData()
      return () => {
        // removing listeners
        if (unsubUserSt) unsubUserSt()
      };
    }, [])
  )

  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 10 }}>
      {isMessageSent ? (
        <View
          style={{
            backgroundColor: colors.primary,
            alignItems: "center",
            padding: 4,
          }}
        >
          <Text style={{ color: "white" }}>Sent</Text>
        </View>
      ) : null}

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          size={"small"}
          color={colors.primary}
        />
      ) : null}


      <FlatList
        style={[{
          height: 50,
          paddingBottom: 50
        }]}
        data={data}
        refreshing={loading}
        onRefresh={getData}
        extraData={data}
        renderItem={({ item } ) => {
          return (
            <View style={{ marginVertical: 10 }}>
              {item.user === userdata.uid && item.type === 'sender' &&
                <View
                  style={{
                    marginLeft: 70,
                    top: 0,
                    marginBottom: 0,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    <View>
                      {/* <TouchableOpacity
                        onPress={() => removeChat(item.id)}
                        style={{ marginTop: -5, flexDirection: "row" }}>
                        <Feather
                          color={colors.black}
                          size={12}
                          name={"trash"}
                          style={{ alignSelf: "center" }}
                        />
                        <Text>delete</Text>
                      </TouchableOpacity> */}

                      <Text
                        style={{
                          color: "black",
                          fontSize: 13,
                          bottom: 3,
                          right: 10,
                          alignSelf: "flex-end",
                        }}
                      >
                        {item.title}
                      </Text>
                      <View
                        style={{
                          backgroundColor: "#F0F0F0",
                          marginRight: 10,
                          borderRadius: 10,
                          padding: 10,
                        }}
                      >
                        <Text style={{ color: "black", marginTop: 5 }}>
                          {item.content}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 10,
                            bottom: 3,
                            marginLeft: 1,
                            marginTop: 5,
                          }}
                        >
                          {moment(item.date).fromNow()}
                        </Text>

                      </View>
                    </View>
                    <View style={{ marginRight: 10, marginTop: 17 }}>
                      <ProfilePicture image={userdata.profile} />
                    </View>
                  </View>
                </View>}
              {/* in this case this will be the chat comming from the other users */}
              {item?.otherUser?.uid === route?.params?.data.id && item.type === 'reciever' && <View style={{ marginLeft: 10, top: 20, marginBottom: 6 }}>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity style={{ marginTop: 17 }} onPress={() => {
                    navigation.navigate('UserPage', {
                      data: {
                        id: route?.params?.data.id,
                        profile: item.otherUser.profile
                      }
                    })
                  }}>
                    <ProfilePicture image={item.otherUser.profile} />
                  </TouchableOpacity>
                  <View style={{ marginTop: -20 }}>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 13,
                        fontWeight: "bold",
                        bottom: 3,
                        marginLeft: 11,
                      }}
                    >
                      {route?.params?.data.fullname}
                    </Text>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 13,
                        bottom: 3,
                        marginLeft: 11,
                      }}
                    >
                      {item.title}
                    </Text>
                    <View
                      style={{
                        backgroundColor: colors.primary,
                        padding: 10,
                        marginRight: 60,
                        marginLeft: 10,
                        borderRadius: 10,
                      }}
                    >
                      <Text style={{ color: "white", marginTop: 5 }}>
                        {item.content}
                      </Text>
                    </View>
                    <View
                      style={{
                        padding: 5,
                        left: 10,
                        flexDirection: "row",
                        alignSelf: "flex-end",
                      }}
                    >

                      <Text
                        style={{
                          color: "black",
                          fontSize: 10,
                          bottom: 3,
                          marginRight: 65,
                        }}
                      >
                        {moment(item.date).fromNow()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>}
            </View>
          )
        }}
      />
      <KeyboardAvoidingView
        keyboardVerticalOffset={keyboardVerticalOffset}
        behavior={Platform.OS === "ios" ? "position" : "height"}
        style={{ zIndex: 1000 }}
      >
        <View
          style={{
            backgroundColor: "white",
            position: "absolute",
            width: "100%",
            height: 120,
            bottom: 20,
            borderTopColor: colors.medium,
            borderTopWidth: 0.5,
            padding: 10,
            zIndex: 20,
          }}
        >
          <View
            style={{
              marginLeft: 10,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              flex: 1,
            }}
          >
            <TouchableOpacity onPress={() => openSelectTitleSheet()}>
              <Text style={styles.fieldText}>Your topic</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  onChangeText={(value) => setTitle(value)}
                  style={styles.titleSelectField}
                  pointerEvents="none"
                  editable={false}
                  placeholderTextColor={"#0A0914"}
                  placeholder="Select topic"
                  keyboardType="default"
                  value={title}
                />

                <Ionicons
                  name={"chevron-down"}
                  color={"#0A0914"}
                  size={20}
                  style={{ marginRight: 10 }}
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
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <ProfilePicture image={userdata.profile} />
            <View
              style={{
                borderColor: colors.medium,
                borderWidth: 1,
                width: 260,
                right: 10,
                marginLeft: 20,
                borderRadius: 50,
                height: 50,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <TextInput
                multiline={true}
                numberOfLines={2}
                ref={chatReplyInput}
                onChangeText={(text) => setContent(text)}
                placeholder="Say something"
                style={{
                  left: 10,
                  width: 200,
                  padding: 4,
                  alignSelf: "center",
                  zIndex: 10000,
                }}
              />
              {!isSending ? (
                <TouchableOpacity
                  onPress={() => addMessage()}
                  style={{ justifyContent: "center", right: 20 }}
                >
                  <FontAwesome
                    name={"send-o"}
                    color={colors.primary}
                    size={20}
                  />
                </TouchableOpacity>
              ) : (
                <ActivityIndicator size={"large"} color={colors.primary} />
              )}
            </View>
          </View>
        </View>

        {/* bottom level */}
        <View style={{ height: 150 }} />

      </KeyboardAvoidingView>
      <RBSheet
        ref={selectTitleSheet}
        height={450}
        openDuration={0}
        customStyles={{
          container: {},
        }}
      >
        <View style={{ marginTop: 20 }} />
        <TextInput multiline={true} value={search} placeholder='Search topic' style={{
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
        />

        <ScrollView>
          {filtered.map((item ) => {
            return (
              <TouchableOpacity key={item.id} onPress={async () => {
                onTitleSelected(item.name)
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
          <TouchableOpacity
            style={{ alignSelf: "center" }}
            onPress={() => selectTitleSheet.current?.close()}
          >
            <Text style={{ color: "red", fontWeight: "bold" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#ffffff",
    marginTop: 10,
  },
  separator: {
    height: 0.5,
    backgroundColor: "#CCCCCC",
  },
  titleSelectField: {
    fontSize: 16,
    color: "#0A0914",
    height: 24,
    width: 140,
  },
  fieldText: {
    height: 20,
    top: 1,
    color: "#787D8B",
    width: 100,
    fontSize: 12,
  },
})
