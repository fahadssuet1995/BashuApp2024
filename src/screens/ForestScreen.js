import React, { useState, useEffect, useRef, useCallback } from "react"
import {
  SafeAreaView, TouchableOpacity, Text, ScrollView, TextInput, View, Image, FlatList, ActivityIndicator, Dimensions, Keyboard, Alert
} from "react-native"
import {
  Ionicons, Entypo
} from "@expo/vector-icons"
import colors from "../config/colors"
import AsyncStorage from "@react-native-async-storage/async-storage"
import DropdownAlert from "react-native-dropdownalert"
import { useDispatch, useSelector } from "react-redux"
import { selectUser, setSticks } from "../redux/features/user"
import { addDoc, collection, doc, updateDoc, getDocs, where, query, orderBy, limit } from "firebase/firestore"
import { database } from "../config/firebase"
import { addForestStick, addStick, selectForestStick, selectWatching, setForestStick } from "../redux/features/data"
import RBSheet from "react-native-raw-bottom-sheet"
import titles from "../data/titles"
import Villages from "../components/Forest"
import { sendPushNotification } from "../hooks/Notifications"
import { useFocusEffect } from "@react-navigation/native"
import { store } from "../redux/store"



export default function ForestScreen({ navigation, route }) {
  const [currentCount, setcurrentCount] = useState("0 / 500")
  const commentsRef = useRef()
  const [locked, setLocked] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const dropdownAlert = useRef(null)
  const userdata = useSelector(selectUser)
  const [mentionTarget, setMentionTarget] = useState(0)
  const dispatch = useDispatch()
  const [stick, setStick] = useState("")
  const [title, setTitle] = useState("")
  const [all, setAll] = useState(titles)
  const [filtered, setFiltered] = useState(titles)
  const [search, setSearch] = useState("")
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [tagsLoader, setTagsLoader] = useState(false)
  const dim = Dimensions.get('screen').height
  const [tagUser, setTagUser] = useState([]);
  const [tags, setTags] = useState(useSelector(selectWatching));
  const [tagsfiltered, setTagsFiltered] = useState([]);
  const [showTags, setShowTags] = useState(false)
  const [focus, setFocus] = useState(false)
  const forestSticks = useSelector(selectForestStick)
  const [local, setLocal] = useState([])

  // this is to get data for the current user
  const getUsersData = async (refresh) => {
    setIsLoading(true)
    // get current users calabash and the the user's part of the watching list
    const calabashDocs = (await getDocs(query(collection(database, `calabash`)
      , where('showontree', '==', true)
      , where('user', 'in', [userdata.uid])
      , orderBy('date', 'asc'))))


    const calabash = calabashDocs.docs.map(resdoc => {
      const id = resdoc.id
      const data = resdoc.data()
      return { id, ...data }
    })

    // get current users stick and the the user's part of the watching list
    const stickDocs = (await getDocs(query(collection(database, `sticks`),
      where('user', 'in', [userdata.uid])
      , orderBy('date', 'asc'))))

    // get sticks
    const sticks = stickDocs.docs.map(resdoc => {
      const id = resdoc.id
      const data = resdoc.data()
      return { id, ...data }
    })

    const newDocs = sticks.concat(calabash)

    newDocs.sort(function compare(a, b) {
      let dateA = new Date(a.date);
      let dateB = new Date(b.date);
      return dateB - dateA;
    })

    dispatch(setForestStick(newDocs))
    setIsLoading(false)
  }

  // this gets all the users
  const getWatching = async (refresh) => {
    console.log(forestSticks)
    const data = (await getDocs(collection(database, `users/${userdata.uid}/watching`))).docs
    setIsLoading(true)

    if (data.length > 0) {
      let calData = []
      let stickData = []

      data.map(async (doc, i) => {
        // get current users calabash and the the user's part of the watching list
        const calabashDocs = (await getDocs(query(collection(database, `calabash`)
          , where('showontree', '==', true)
          , where('user', 'in', [doc.data().user])
          , orderBy('date', 'asc'))))

        const calabash = calabashDocs.docs.map(resdoc => {
          const id = resdoc.id
          const data = resdoc.data()
          return { id, ...data }
        })

        calData.unshift(...calabash)

        // get current users stick and the the user's part of the watching list
        const stickDocs = (await getDocs(query(collection(database, `sticks`),
          where('user', 'in', [doc.data().user])
          , orderBy('date', 'asc'))))

        // get sticks
        const sticks = stickDocs.docs.map(resdoc => {
          const id = resdoc.id
          const data = resdoc.data()
          return { id, ...data }
        })

        stickData.unshift(...sticks)

        // at this point the array is now completed
        if (i === data.length - 1) {
          // get current users calabash and the the user's part of the watching list
          const calabashDocs = (await getDocs(query(collection(database, `calabash`)
            , where('showontree', '==', true)
            , where('user', 'in', [userdata.uid])
            , orderBy('date', 'asc'))))

          const calabash = calabashDocs.docs.map(resdoc => {
            const id = resdoc.id
            const data = resdoc.data()
            return { id, ...data }
          })

          calData.unshift(...calabash)

          // get current users stick and the the user's part of the watching list
          const stickDocs = (await getDocs(query(collection(database, `sticks`),
            where('user', 'in', [userdata.uid])
            , orderBy('date', 'asc'))))

          // get sticks
          const sticks = stickDocs.docs.map(resdoc => {
            const id = resdoc.id
            const data = resdoc.data()
            return { id, ...data }
          })

          stickData.unshift(...sticks)

          const newDocs = stickData.concat(calData)

          newDocs.sort(function compare(a, b) {
            let dateA = new Date(a.date);
            let dateB = new Date(b.date);
            return dateB - dateA;
          })

          dispatch(setForestStick(newDocs))
          setIsLoading(false)
        }
      })
    } else {
      getUsersData(refresh)
    }
  }


  const showSuccess = (msg) => {
    Alert.alert(
      "Success",
      msg,
    )
  }


  // const addUsername = (arr: any[]) => {
  //   const profileD = 'https://firebasestorage.googleapis.com/v0/b/bashuapp-ae9c2.appspot.com/o/files%2Fx4yDpV0cL3MzNgyCh3WG7PMnO623%2Fprofile?alt=media&token=b231a9c1-46ca-48d8-aa2b-12d402e1b746'
  //   arr.forEach(async data => {
  //     if (data.user === userdata.uid) {
  //       updateDoc(doc(database, `calabash/${data.id}`), { profile: profileD })
  //     }
  //   })
  // }


  const setNotification = (res) => {
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

        showSuccess('Your stick was thrown with success.')
      })

      // reset tags
      setTagUser([])
    }
  }


  // method that will be used to throw a stick
  const onThrowStick = async () => {
    if (title === "") {
      alert("Please select topic")
    } else if (stick === "") {
      alert("Stick content required.")
    } else {
      setIsLoading(true)

      const postData = {
        user: userdata.uid,
        title: title,
        content: stick,
        type: "stick",
        mentions: tags.length > 0 ? tags.length : 0,
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
          dispatch(addForestStick(postData))

          setNotification(res)

          setStick("")
          setTitle("")
          setIsLoading(false)

          showSuccess('Stick posted with success')
        })
        .catch(e => { })
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

  useEffect(() => {
    getWatchers()
    getWatching()
  }, [])


  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('watching')
        .then(watching => {
          if (watching !== null) {
            getWatchers()
            getWatching()

            setTimeout(async () => {
              await AsyncStorage.removeItem('watching')
            }, 5000);
          }
        })


      async function getLocked() {
        const locked = await AsyncStorage.getItem('locked')
        if (locked !== null) {
          setTitle(JSON.parse(locked).title)
          setLocked(JSON.parse(locked).locked)
        }
      }

      getLocked()
    }, [])
  )

  const getWatchers = async () => {
    const data = (await getDocs(query(collection(database, `users/${userdata.uid}/watchers`), limit(100))))
    const result = data.docs.map(doc => {
      const id = doc.id
      const data = doc.data()
      console.log("get Watchers" + data)
      return { ...data, id }
    })
console.log(result)
    setTags(result)
    setTagsFiltered(result)
  }


  const openTags = async (text) => {
    setTagsLoader(true)
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
      setTagsLoader(false)
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

      setTagsLoader(false)
    }
  }

  const setUpTags = (text) => {
    let index
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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

      {isLoading && <ActivityIndicator
        style={{
          zIndex: 10000,
        }}
        size={40}
        color="red"
      />}

      <FlatList
        data={forestSticks}
        style={{ flex: 0 }}
        refreshing={shouldLoad}
        onRefresh={() => getWatching(true)}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => {
          return <View style={{
            height: 0.5,
            marginHorizontal: 25,
            backgroundColor: "#CCCCCC",
          }} />
        }}
        renderItem={({ item, index }) => <Villages stick={item} user={item} index={index} />}
      />

      <TouchableOpacity
        onPress={() => {
          setShouldLoad(false)
          commentsRef.current.open()
          setShowTitle(true)
        }}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 30,
          zIndex: 1000,
          backgroundColor: colors.primary,
          padding: 5,
          borderRadius: 100,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons
          name='add-circle'
          color={"white"}
          size={30}
        />

        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            alignItems: "center",
            paddingRight: 5,
          }}
        >
          Throw a Stick
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

          <TextInput autoFocus={focus} multiline={true} value={stick} placeholder='Write your stick' style={{
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
              onThrowStick()
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
          {tagsLoader && <ActivityIndicator size='small' />}
          <Text style={{
            fontSize: 15,
            marginLeft: 20,
            fontWeight: 'bold'
          }}>Tag your watchers</Text>
          {tagsfiltered.map((item) => {
            return (
              <TouchableOpacity key={item.id} onPress={async () => {
                setTagUser([...tagUser, { user: item.username, uid: item.id, pushToken: item.token }])
                const content = stick.split(' ')
                content[content.length - 1] = tagUser[tagUser.length - 1]?.user ?
                  `@${tagUser[tagUser.length - 1].user} ` : `@${item.username} `

                setStick(content.join(' '))
                setShowTags(false)
                setFocus(true)
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
                  <Text>{item?.username}</Text>
                </View>

              </TouchableOpacity>
            )
          })}
        </ScrollView>}
      </RBSheet>
    </SafeAreaView>
  )
}

