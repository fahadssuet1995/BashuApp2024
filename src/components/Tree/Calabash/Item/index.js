import CalalabashImage from "../../../CalabashImage/index.js"
import React, { useState } from "react"
import { View, Text, StyleSheet, Alert, Share } from "react-native"
import colors from "../../../../config/colors"
import { EvilIcons, Fontisto } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
import { deleteObject, ref } from "firebase/storage"
import { database, storage } from "../../../../config/firebase"
import { useDispatch, useSelector } from "react-redux"
import { selectUser } from "../../../../redux/features/user"
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { sendPushNotification } from "../../../../hooks/Notifications"
import { likeUserCalabash } from "../../../../hooks/User"
import { setLoading } from "../../../../redux/features/data"
import AsyncStorage from "@react-native-async-storage/async-storage"

const CalabashItem = ({ item, index }) => {
  const navigation = useNavigation()
  const userdata = useSelector(selectUser)
  const dispatch = useDispatch()
  const [isLiked, setIsLiked] = useState(false)


  // push image to view
  const pushToView = async (item, index) => {
      navigation.navigate("CalabashSticks", { data: item, currUid: userdata.uid })
  }

  // remove image method
  const removeImage = (item) => {
    return Alert.alert(
      "Remove Image",
      "Are you sure you want to remove this image from your calabash?",
      [{
        text: "Yes, remove image",
        onPress: () => {
          deleteCalabash(item)
        },
      },
      {
        text: "No",
      }]
    )
  }

  // like village method
  const likeCalabash = async (item) => {
    dispatch(setLoading(true))

    // getting owner data for the firestore
    const ownerdata = (await getDoc(doc(database, `users/${item.user}`))).data()

    // rate hook
    likeUserCalabash(item.id, userdata.uid)
      .then((exists) => {
        const postdata = {
          date: new Date().toLocaleString(),
          uid: userdata.uid,
          location: ''
        }

        if (!exists) {
          addDoc(collection(database, `calabash/${item.id}/likes`), postdata)
            .then(async (res) => {
              // update user's rate
              await updateDoc(doc(database, `calabash/${item.id}`), { likes: item.likes + 1 })
                .then(() => {
                  item.likes = item.likes + 1

                  setIsLiked(true)
                  setLoading(false)

                  if (ownerdata) {
                    const notification = {
                      to: ownerdata.pushToken,
                      content: {
                        sound: 'default',
                        title: `New Like`,
                        body: `${userdata.fullname} liked your stick.`,
                        data: {
                          otherUser: userdata,
                          action: 'like calabash',
                          itemId: item.id,
                          title: item?.title,
                          description: item?.description,
                          file: item.file
                        },
                        date: new Date().toUTCString()
                      }
                    }

                    if (item.user !== userdata.uid) sendPushNotification(notification)
                  }
                })
            })
        } else {
          exists.docs.map((resDoc) => {
            deleteDoc(doc(database, `calabash/${item.id}/likes/${resDoc.id}`))
              .then(() => {
                const like = item.likes !== 0 ? item.likes - 1 : 0
                updateDoc(doc(database, `calabash/${item.id}`), { likes: like })
                item.likes = like
                setLoading(false)
                setIsLiked(false)
              }).
              catch(e => {
                setLoading(false)
              })
          })
        }
      })
  }

  // delete method
  const deleteCalabash = async (item) => {
    deleteDoc(doc(database, `calabash/${item.id}`))
      .then(() => {
        // Create a reference to the file to delete
        const desertRef = ref(storage, `files/${userdata.uid}/${item.name}`)
        // Delete the file
        alert('Image was deleted with success')
      }).catch((error) => {
        alert('Could not delete image, please try again later.')
        // Uh-oh, an error occurred!
      })
  }

  // share method
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "Checkout my calabash image on Bashu mobile application. Download Bashu app on google PlayStore and AppStore today!",
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {

    }
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 5,
        borderRadius: 5,
        borderColor: "gray",
        borderWidth: 0.2,
      }}
    >
      <View>
        <TouchableOpacity onPress={() => pushToView(item, index)}>
          <CalalabashImage image={item.file} />
        </TouchableOpacity>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            width: "99%",
            marginTop: 5,
          }}
        >
          <View style={styles.iconContainer}>
            <EvilIcons name={"comment"} size={20} color={colors.primary} />
            <Text style={styles.number}>{item.comments}</Text>
          </View>
          <TouchableOpacity
            onPress={() => onShare()}
            style={styles.iconContainer}
          >
            <EvilIcons name={"share-apple"} size={20} color={colors.primary} />
          </TouchableOpacity>
          {item.user === userdata.uid && <TouchableOpacity
            onPress={() => removeImage(item)}
            style={styles.iconContainer}
          >
            <EvilIcons name={"trash"} size={20} color={colors.primary} />
          </TouchableOpacity>}

          <TouchableOpacity style={styles.iconContainer} onPress={() => likeCalabash(item)} >
            {isLiked ? (
              <Fontisto name={"heart"} size={13} color={colors.primary} />
            ) : (
              <Fontisto name={"heart-alt"} size={13} color={colors.primary} />
            )}
            <Text style={styles.number}>{item.likes}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginRight: 0,
    marginLeft: 0,
    width: "100%",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  number: {
    marginLeft: 3,
    color: "grey",
  },
})

export default CalabashItem
