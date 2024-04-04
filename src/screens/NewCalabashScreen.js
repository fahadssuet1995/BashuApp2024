import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Alert, Platform, TouchableOpacity, TextInput, Image, ScrollView, Dimensions } from "react-native";
import colors from "../config/colors";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { database, storage } from "../config/firebase";
import { addDoc, collection, doc, getDocs, limit, query, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../redux/features/user";
import  { addCalabsh, selectCalabash } from "../redux/features/data";
import * as ImagePicker from 'expo-image-picker';
import RBSheet from "react-native-raw-bottom-sheet"
import titles from "../data/titles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Ionicons, Entypo
} from "@expo/vector-icons"
import { sendPushNotification } from "../hooks/Notifications";
import { compress } from "../hooks/ImageCompressor";



export default function NewCalabashScreen({ navigation }) {
  const [currentCount, setcurrentCount] = React.useState("0 / 500")
  const [shouldCreate, setShouldCreate] = useState(false)
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')
  const userdata = useSelector(selectUser)
  const dispatch = useDispatch()
  const calabashData = useSelector(selectCalabash)
  const [image, setImge] = useState(null)
  const commentsRef = useRef();
  const [all, setAll] = React.useState(titles)
  const [filtered, setFiltered] = React.useState(titles)
  const [search, setSearch] = React.useState("")
  const [showTitle, setShowTitle] = React.useState(false)
  const [locked, setLocked] = React.useState(false)
  const dim = Dimensions.get('screen').height
  const [tagUser, setTagUser] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagsfiltered, setTagsFiltered] = useState([]);
  const [showTags, setShowTags] = useState(false)



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


  const setUpTags = (text) => {
    let index;
    const arr = text.split(' ').map((val, i) => {
      if (val.includes('@')) return index = i
    })

    index && text.split(' ')[text.split(' ').length - 1] === text.split(' ')[index]
      ? openTags(text.split(' ')[index])
      : setShowTags(false)

    setDescription(text)
    let count = text.length;
    let appendCount = count + " / 500";
    setcurrentCount(appendCount);
  }

  // update data on user's collaction
  const updateData = async () => {
    try {
      setShouldCreate(true)

      const fileUrl = await convertToBlob(image)

      if (fileUrl) {
        const date = new Date().toUTCString()

        const postData = {
          likes: 0,
          comments: 0,
          likesId: '',
          commentsId: '',
          file: fileUrl,
          profile: userdata.profile,
          date: date,
          title: title,
          description: description,
          user: userdata.uid,
          showontree: false,
          username: userdata.username,
          mentinos: tags.length > 0 ? tags.length : 0
        }


        addDoc(collection(database, `calabash`), postData)
          .then(async (res) => {

            setShouldCreate(false)

            const postData = {
              id: res.id,
              likes: 0,
              comments: 0,
              likesId: '',
              commentsId: '',
              file: fileUrl,
              title: title,
              profile: userdata.profile,
              description: description,
              date: date,
              user: userdata.uid,
              showontree: false,
              username: userdata.username
            }

            dispatch(addCalabsh(postData))

            Alert.alert("New Calabash Image", "Image uploaded successfully. Would you like your image to appear on the Forest or do you want to keep it in the Calabash?", [
              { text: "Keep in calabash" }, {
                text: "Push to Forest", onPress: async () => {
                  await updateDoc(doc(database, `calabash/${res.id}`), { showontree: true })
                }
              },
            ])


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
                      file: fileUrl,
                      itemId: res.id,
                      title: title,
                      description: description
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

            navigation.goBack()
          })
          .catch((e) => {
            setShouldCreate(false)
            Alert.alert('Oopss', 'Could not upload calabash, please try again later', [{ text: 'OK', onPress: () => navigation.goBack() }])
          })
      }
    } catch (error) {
      setShouldCreate(false)
      Alert.alert('Oopss', 'Could not upload calabash, please try again later', [{ text: 'OK', onPress: () => navigation.goBack()  }])
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
    getLocked()
    pickImage()

  }, [])


  // method to allow user to pick image
  async function pickImage() {
    let file = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    })

    if (!file.canceled) {
      setImge(file.assets[0].uri)
      commentsRef.current.open()
      setShowTitle(true)
    } else {
      navigation.goBack()
    }
  }

  // convert to blog
  async function convertToBlob(uri) {
    const compressedImg = await compress(uri)

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
    const fileRef = ref(storage, `files/${userdata.uid}/cal${calabashData.length + 1}`)
    const result = await uploadBytes(fileRef, blob)

    blob.close()
    return await getDownloadURL(fileRef)
  }

  return (
    <View style={{ width: "100%", flex: 1, marginHorizontal: 20, marginVertical: 20 }}>
      {shouldCreate ? (
        <View style={{ backgroundColor: colors.primary, padding: 3, width: 375 }}>
          <Text style={{ alignSelf: "center", color: "white" }}>
            Uploading image ...
          </Text>
        </View>
      ) : null}
      {image &&
        <TouchableOpacity onPress={pickImage} activeOpacity={0.5}>
          <Image
            style={{
              width: 375,
              height: 250,
              borderRadius: 14,
              marginVertical: 10,
            }} source={{ uri: image }} />
        </TouchableOpacity>}

      {!showTitle && image &&
        (title === '' || description === '')
        && <TouchableOpacity
          onPress={() => {
            commentsRef?.current?.open()
            setShowTitle(true)
          }}
          style={{
            position: "relative",
            backgroundColor: colors.primary,
            padding: 10,
            width: 110,
            borderRadius: 10,
            marginLeft: 260,
            marginTop: 10,
            flexDirection: "row",
            justifyContent: 'center',
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
            Add topic
          </Text>
        </TouchableOpacity>}

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
            <TouchableOpacity onPress={() => setShowTitle(!showTitle)}
              style={{
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


          <TextInput multiline={true} value={description} placeholder='Write your description' style={{
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
              updateData()
              commentsRef.current.close()
            }}
            style={{
              position: "relative",
              backgroundColor: colors.primary,
              padding: 5,
              width: 100,
              borderRadius: 5,
              marginLeft: 250,
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: 'center'
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
              Add Picture
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
          backgroundColor: 'white',
          height: 400
        }}>
          {tagsfiltered.map((item) => {
            return (
              <TouchableOpacity key={item.id} onPress={async () => {
                setTagUser([...tagUser, { user: item.username, uid: item.id, pushToken: item.token }])
                const content = description.split(' ')
                content[content.length - 1] = tagUser[tagUser.length - 1]?.user ?
                  `@${tagUser[tagUser.length - 1].user} ` : `@${item.username} `

                setDescription(content.join(' '))
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
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: colors.primary,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 200
  },
  input1: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: colors.primary,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 375,
    height: 150
  }
});
