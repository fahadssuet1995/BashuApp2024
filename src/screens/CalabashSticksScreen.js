import React, { useEffect, useRef, useState } from "react"
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Keyboard,
} from "react-native"
import {
  SkypeIndicator,
} from "react-native-indicators";
import { Text, View } from "../components/Themed"
import colors from "../config/colors"
import DropdownAlert from "react-native-dropdownalert"
import moment from "moment"
import titles from "../data/titles"
import { Ionicons, Entypo } from "@expo/vector-icons"
import RBSheet from "react-native-raw-bottom-sheet"
import { addDoc, collection, doc, getDoc, getDocs, limit, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { database } from "../config/firebase"
import { useDispatch, useSelector } from "react-redux"
import { selectUser } from "../redux/features/user"
import { sendPushNotification } from "../hooks/Notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addForestComment, selectWatching } from "../redux/features/data";


export default function CalabashSticksScreen({ route, navigation }) {
  //const navigation = useNavigation()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(false)
  const [comment, setComment] = useState('')
  const [search, setSearch] = useState('')
  const [title, setTitle] = useState('')
  const [shouldLoad, setShouldLoad] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const dropdownAlert = useRef()
  const commentsRef = useRef()
  const userdata = useSelector(selectUser)
  const [image, setImage] = useState(null)
  const [filtered, setFiltered] = useState(titles)
  const [all, setAll] = useState(titles)
  const [currentCount, setcurrentCount] = useState("0 / 500")
  const dim = Dimensions.get('screen').height
  const [user, setUser] = useState()
  const [tagUser, setTagUser] = useState([]);
  const [tags, setTags] = useState(useSelector(selectWatching));
  const [tagsfiltered, setTagsFiltered] = useState([]);
  const [showTags, setShowTags] = useState(false)
  const dispatch = useDispatch()

  // get commnets for this calabash
  const getData = async () => {
    const user = (await getDoc(doc(database, `users/${route.params.data.user}`))).data()
    if (user) setUser(user)

    const unsub = onSnapshot(collection(database, `calabash/${route.params.data.id}/comments`), snap => {
      const result = snap.docs.map(doc => {
        const id = doc.id
        const data = doc.data()
        return { id, ...data }
      })

      result.sort(function compare(a, b) {
        let dateA = new Date(a.date);
        let dateB = new Date(b.date);
        return dateB - dateA;
      })

      setData(result)
      if (result.length === 0) {
        showdropdownAlert()
      }
      unsub()
    })
  }

  // dropdown aler for info
  const showdropdownAlert = () => {
    dropdownAlert.current?.alertWithType(
      "info",
      "Info",
      "No comments yet. Be the first!"
    )
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


  const openTags = async (text) => {
    if (tags.length > 0) {
      if (text) {
        const newData = tags.filter((item) => {
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

  const setUpTags = (text) => {
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

  // add comment to the cala
  const addComment = async () => {
    if (comment === "" || title === '') {
      alert('Cannot post comment, fields are empty.')
    } else {
      const dateVal = new Date()
      setShouldLoad(true)

      const postData = {
        owner: {
          uid: route?.params?.data.user,
          profile: image
        },
        user: userdata.uid,
        comment: comment,
        calabash: route?.params?.data.id,
        title: title,
        profile: userdata.profile,
        date: dateVal.toUTCString(),
        type: 'calabash',
        mentinos: tags.length > 0 ? tags.length : 0
      }

      addDoc(collection(database, `calabash/${route?.params?.data.id}/comments`), postData)
        .then(async () => {
          // update user's rate
          await updateDoc(doc(database, `calabash/${route?.params?.data.id}`), { comments: route?.params?.data.comments + 1 })
          AsyncStorage.getItem('index')
          .then(index => {
            if(index !== null) dispatch(addForestComment({index: parseInt(index)}))
          })
          
       

          dropdownAlert.current?.alertWithType(
            "success",
            "Success",
            "Stick thrown!"
          )

          if (route?.params.data.user !== userdata.uid) {
            const notification = {
              to: user?.pushToken,
              content: {
                sound: 'default',
                title: `New stick`,
                body: `${userdata.fullname} added a stick on your picture.`,
                data: {
                  title:  route?.params?.data.title,
                  otherUser: userdata,
                  action: 'like calabash',
                  file: route?.params?.data.file,
                  itemId: route?.params?.data.id,
                  description: route?.params?.data.description
                },
                date: new Date().toUTCString()
              }
            }

            sendPushNotification(notification)
            // add notification in the doc
            addDoc(collection(database, `users/${route?.params?.data.user}/notifications`), notification.content)
          }


          if (tagUser.length > 0) {
            tagUser.forEach(async tag => {

              const notification = {
                to: tag?.pushToken,
                content: {
                  sound: 'default',
                  title: `You were tagged`,
                  body: `${userdata.fullname} tagged you on a picture.`,
                  data: {
                    otherUser: userdata,
                    action: 'tag calabash',
                    file: route?.params?.data.file,
                    itemId: route?.params?.data.id,
                    description: route?.params?.data.description
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

          setShouldLoad(false)
          setComment("")
          getData()
        }).catch((e) => {
          setShouldLoad(false)
          alert('Could not post commnet, please try again later.')
        })
    }

  }

  // use effect hook
  useEffect(() => {
    async function getLocked() {
      const locked = await AsyncStorage.getItem('locked')
      if (locked !== null) {
        setTitle(JSON.parse(locked).title)
        setLocked(JSON.parse(locked).locked)
      }
    }

    if (route?.params) {
      getData()
    }

    getLocked()
    getWatchers()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <View style={{ zIndex: 343454353 }}>
        <DropdownAlert ref={dropdownAlert} />
      </View>
      {shouldLoad ? (
        <SkypeIndicator
          style={{
            position: "absolute",
            zIndex: 10000000,
            alignSelf: "center",
            top: 30,
          }}
          size={40}
          color="red"
        />
      ) : null}
      <View style={{ padding: 5, alignItems: "center" }}>
        <View
          style={{
            padding: 4,
          }}
        >
          {route?.params?.data?.title && <Text style={styles.contentHeader}>{route?.params?.data?.title}</Text>}

          {route?.params?.data?.file && <Image
            style={{ width: 350, height: 300, borderRadius: 15 }}
            source={{
              uri: route?.params?.data.file
            }}
          />}
          {route?.params?.data?.description && <Text style={{
            marginVertical: 10,
            fontSize: 15
          }}>{route?.params?.data?.description}</Text>}
        </View>
      </View>
      <FlatList
        style={styles.root}
        data={data}
        refreshing={loading}
        onRefresh={() => getData()}
        extraData={data}
        ItemSeparatorComponent={() => {
          return <View style={styles.separator} />
        }}
        renderItem={({ item }) => {
          return (
            <View>
              <View style={styles.container}>
                <TouchableOpacity onPress={() => { }}>
                  <Image
                    style={styles.image}
                    source={{ uri: item.profile }}
                  />
                </TouchableOpacity>
                <View style={styles.content}>
                  <View style={styles.contentHeader}>
                    <Text style={styles.name}>{item.title}</Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 10,
                      color: colors.primary,
                      marginTop: -8,
                      marginBottom: 5,
                    }}
                  >
                    @{userdata.username}
                  </Text>
                  <Text>{item.comment}</Text>
                  {item.date && <Text style={styles.time}>
                    {moment(item.date).fromNow()}
                  </Text>}
                </View>
              </View>
            </View>
          )
        }}
      />

      <View
        style={{
          padding: 10,
          top: 10,
          width: "100%",
        }}
      >
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
      </View>

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
              }}> {title !== '' ? title : 'Select text'}</Text>
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

            {userdata.profile !== '' && <Image source={{ uri: userdata.profile }} style={{
              height: 40,
              width: 40,
              marginRight: 20,
              borderRadius: 50
            }} />}
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
            onChangeText={(text) => setUpTags(text)}
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
            marginLeft: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 20

          }}
            onChangeText={(text) => filterTitle(text)}
          />

          <ScrollView>
            {filtered.map((item) => {
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
          {tagsfiltered.map((item) => {
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
    marginHorizontal: 25,
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
    fontSize: 13,
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
    width: 140,
  },
})
