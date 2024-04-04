import React, { useEffect, useRef, useState } from "react"
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native"
import {
  Ionicons, Entypo
} from "@expo/vector-icons"
// import QueryString from "querystring"
import { Text, View } from "../components/Themed"
import colors from "../config/colors"
import titles from "../data/titles"
import DropdownAlert from "react-native-dropdownalert"
import moment from "moment"


import RBSheet from "react-native-raw-bottom-sheet"
import { ScrollView } from "react-native-gesture-handler"

import { useSelector } from "react-redux"
import { selectUser } from "../redux/features/user"
import { addDoc, collection, doc, getDoc, getDocs, limit, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { database } from "../config/firebase"
import StickReplyItem from "../components/StickReply/Item"
import { sendPushNotification } from "../hooks/Notifications"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { selectWatching } from "../redux/features/data"

//import { useNavigation } from "@react-navigation/native"




export default function StickCommentsScreen({ route } ) {
  const [search, setSearch] = useState('')
  const [showNoSticksMessage, setShowNoSticksMessage] = useState(false)
  const [shouldShowIndicator, setShouldShowIndicator] = useState(false)
  const [comment, setComment] = useState("")
  const [title, setTitle] = useState("")
  const [mentionTarget, setMentionTarget] = useState(0)
  const [shouldLoad, setShouldLoad] = useState(false)
  const dropdownAlert = useRef(null)
  const userdata = useSelector(selectUser)
  const [data, setData]  = useState(null)
  const [owner, setOwner]  = useState(null)
  const [showTitle, setShowTitle] = useState(false)
  const [filtered, setFiltered]  = useState(titles)
  const [all, setAll]  = useState(titles)
  const commentsRef = useRef()
  const [locked, setLocked] = useState(false)
  const [currentCount, setcurrentCount] = useState("0 / 500")
  const dim = Dimensions.get('screen').height
  const [tagUser, setTagUser] = useState([]);
  const [tags, setTags]  = useState(useSelector(selectWatching));
  const [tagsfiltered, setTagsFiltered]  = useState([]);
  const [showTags, setShowTags] = useState(false)


  // get stick data
  const getData = async (data ) => {
    setShouldShowIndicator(true)

    const unsub = onSnapshot(collection(database, `sticks/${data.id}/comments`), snap => {
      const result  = snap.docs.map(doc => {
        const id = doc.id
        const data = doc.data()
        return { id, ...data }
      })

      result.sort(function compare(a , b ) {
        let dateA = new Date(a.date);
        let dateB = new Date(b.date);
        return dateB - dateA;
      })

      setData(result)
      setShouldShowIndicator(false)
      unsub()
    })
  }

  // add comment to the cala
  const addComment = async () => {

    if (comment === "" || title === '') {
      alert('Cannot post comment, fields are empty.')
    } else {

      const postData = {
        user: userdata.pushToken,
        comment: comment,
        stick: route?.params?.data.id,
        owner: {
          uid: route?.params?.data.user,
          profile: route?.params?.data.profile
        },
        title: title,
        mentions: mentionTarget,
        type: 'stick',
        profile: userdata.profile,
        date: new Date().toUTCString(),
        mentinos: tags.length > 0 ? tags.length : 0,
        username: userdata.username
      }

      addDoc(collection(database, `sticks/${route?.params?.data.id}/comments`), postData)
        .then(async () => {
          const comments = route?.params?.data.comments
          // update stikc comment 
          await updateDoc(doc(database, `sticks/${route?.params?.data.id}`), { comments: comments + 1 })

          const notification = {
            to: owner.pushToken,
            content: {
              sound: 'default',
              title: `New stick`,
              body: `${userdata.fullname} commented on your stick.`,
              data: {
                otherUser: userdata,
                action: 'like stick',
                itemId: route?.params?.data.id,
                title: title,
                content: route?.params?.data.content,
                profile: route?.params?.data.profile
              },
              date: new Date().toUTCString()
            }
          }


          if (userdata.uid !== route?.params?.data.user) {
            sendPushNotification(notification)
            // add notification in the doc
            addDoc(collection(database, `users/${route?.params?.data.user}/notifications`), notification.content)
          }

          setShouldLoad(false)

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
                    itemId: route?.params?.data.id,
                    title: title,
                    content: route?.params?.data.content
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

          setComment("")
          getData(route?.params?.data)
        }).catch((e) => {
          alert('Could not post commnet, please try again later.')
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
      const data = (await getDocs(query(collection(database, `users/${userdata.uid}/watchers`), limit(100))))

      const result = data.docs.map(doc => {
        const id = doc.id
        const data = doc.data()
        return { ...data, id }
      })

      if (result.length > 0) {
        setTags(result)
        setTagsFiltered(result)
        setShowTags(true)
      } else {
        alert('No watchers on your list yet.')
      }
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


    setComment(text)
    let count = text.length;
    let appendCount = count + " / 500";
    setcurrentCount(appendCount);
  }


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

  useEffect(() => {
    async function getLocked() {
      const locked = await AsyncStorage.getItem('locked')
      if (locked !== null) {
        setTitle(JSON.parse(locked).title)
        setLocked(JSON.parse(locked).locked)
      }
    }

    if (route?.params?.data) {
      setData(route?.params?.data)
      getData(route?.params?.data)
    } else if (route?.params) {
      getData(route?.params?.id)
    }

    async function getOwner() {
      const uid = route?.params?.data.user ? route?.params?.data.user : route?.params?.data?.otherUser?.uid
      const data = (await getDoc(doc(database, `users/${uid}`))).data()
      if (data) setOwner(data)
      setShouldLoad(false)
    }

    if (route?.params?.data) getOwner()
    getLocked()
    getWatchers()
  }, [])


  return (
    <View style={{ flex: 1 }}>
      {shouldLoad &&
        <View
          style={{
            backgroundColor: colors.primary,
            alignItems: "center",
            padding: 3,
            marginBottom: 2,
            position: "absolute",
            zIndex: 10000,
            width: "100%",
          }}
        >
          <Text style={{ color: "white", fontSize: 10 }}>Throwing...</Text>
        </View>}

      {owner || userdata ? (
        <View>
          <View
            style={{
              marginLeft: 15,
              width: "100%",
              flexDirection: "row",
              marginRight: 25,
              margin: 5,
              marginTop: 10,
            }}
          >
            <Image
              source={{ uri: owner ? owner.profile : data?.profile }}
              style={{
                backgroundColor: "gray",
                borderRadius: 50,
                width: 50,
                height: 50,
                alignSelf: "center",
              }}
            />
            <View style={{ marginLeft: 18, alignSelf: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontWeight: "bold" }}>{owner ? owner.fullname : userdata.fullname}</Text>
                <Text
                  style={{
                    color: colors.primary,
                    marginLeft: 5,
                    fontSize: 10,
                    alignSelf: "center",
                  }}
                >
                  @{owner ? owner.username : userdata.username}
                </Text>
              </View>
              <Text style={{ fontSize: 10, color: "gray", marginTop: 5 }}>
                Thrown {moment(route?.params?.data ? route?.params?.data.date : route?.params?.date).fromNow()}
              </Text>
            </View>
          </View>
          <View style={{ marginLeft: 13, padding: 5 }}>
            <Text style={{
              fontWeight: 'bold',
              marginBottom: 10
            }}>{route?.params?.data ? route?.params?.data.title : route?.params?.title}</Text>
            <Text>{route?.params?.data ? route?.params?.data.content : route?.params?.content}</Text>
          </View>
          <View
            style={{
              height: 0.2,
              backgroundColor: "lightgray",
              marginTop: 5,
            }}
          />
        </View>
      ) : null}

      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        {shouldShowIndicator ? (
          <ActivityIndicator
            style={{ marginTop: 20 }}
            size={30}
            color={colors.primary}
          />
        ) : null}
        {showNoSticksMessage ? (
          <Text style={{ marginTop: 10 }}>
            No sticks thrown yet. Be first to throw!
          </Text>
        ) : null}
      </View>

      <View style={{ zIndex: 343454353 }}>
        <DropdownAlert ref={dropdownAlert} />
      </View>

      <FlatList
        data={data}
        extraData={data}
        style={[{ marginHorizontal: 10 }]}
        refreshing={shouldLoad}
        onRefresh={() => getData(route?.params)}
        ItemSeparatorComponent={() => {
          return <View style={{ height: 0.5, marginHorizontal: 10, backgroundColor: "#CCCCCC" }} />
        }}
        renderItem={({ item }) => <StickReplyItem item={item} />}
      />

      <View style={{ height: 60 }} />

      <TouchableOpacity
        onPress={() => {
          commentsRef?.current?.open()
          setShowTitle(true)
        }}
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
          Add stick
        </Text>
      </TouchableOpacity>

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

        {showTitle && <ScrollView>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <TouchableOpacity onPress={() => setShowTitle(!showTitle)} style={{
              margin: 10,
              marginHorizontal: 20,
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

            <Image source={{ uri: userdata.profile }} style={{
              height: 40,
              width: 40,
              marginRight: 20,
              borderRadius: 50
            }} />
          </View>


          <TextInput multiline={true} value={comment} placeholder='Write your stick' style={{
            width: '90%',
            height: 150,
            marginHorizontal: 20,
            borderWidth: 2,
            borderColor: colors.primary,
            borderRadius: 5,
            padding: 20
          }}
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
              addComment()
              commentsRef?.current?.close()
            }}
            style={{
              position: "relative",
              backgroundColor: colors.primary,
              padding: 5,
              width: 100,
              borderRadius: 5,
              marginLeft: 290,
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              Throw stick
            </Text>
          </TouchableOpacity>
        </ScrollView>}

        {!showTitle && <>
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
                  setTitle(item.name)
                  setShowTitle(!showTitle)

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
        </>}

        {showTags && <ScrollView style={{
          height: 350,
          marginHorizontal: 20,
          borderRadius: 20,
          marginBottom: 40
        }}>
          <Text style={{
            fontSize: 15,
            marginLeft: 20,
            fontWeight: 'bold'
          }}>Tag your watchers</Text>
          {tagsfiltered.map((item ) => {
            return (
              <TouchableOpacity key={item.id} onPress={async () => {
                setTagUser([...tagUser, { user: item.username, uid: item.id, pushToken: item.token }])
                const content = comment.split(' ')
                content[content.length - 1] = tagUser[tagUser.length - 1]?.user ?
                  `@${tagUser[tagUser.length - 1].user} ` : `@${item.username} `

                setComment(content.join(' '))
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
                  <Image source={{ uri: item.profile }} style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    marginRight: 10,
                  }} />
                  <Text>@{item.username}</Text>
                </View>

              </TouchableOpacity>
            )
          })}
        </ScrollView>}

        <View style={{
          marginBottom: 35
        }}>


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
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  separator: {
    height: 0.5,
    backgroundColor: "#CCCCCC",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: 0,
  },
  time: {
    fontSize: 11,
    color: "#808080",
    marginTop: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
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
  },
  wrapcontainer: {
    paddingRight: 16,
    paddingVertical: 12,
    alignItems: "flex-start",
  },
})
