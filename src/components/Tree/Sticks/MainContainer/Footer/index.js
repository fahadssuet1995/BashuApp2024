import React, { useEffect, useState } from "react"
import { View, Text, ActivityIndicator } from "react-native"
import styles from "./styles"
import {
  EvilIcons,
  Fontisto,
} from "@expo/vector-icons"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
import colors from "../../../../../config/colors"
import { likeStickUser } from "../../../../../hooks/User"
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { useSelector } from "react-redux"
import { selectUser } from "../../../../../redux/features/user"
import { database } from "../../../../../config/firebase"
import { sendPushNotification } from "../../../../../hooks/Notifications"


const Footer = ({ stick }) => {
  const navigation = useNavigation()
  const [isliked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const userdata = useSelector(selectUser)

  const stickPushToView = async (item) => {
    navigation.navigate("StickComments", { data: item })
  }

  const checkIfLiked = async (item) => {
    // rate hook
    likeStickUser(item.id, userdata.uid)
      .then(exists => { if (exists) return setIsLiked(true) })
  }

  // like village method
  const likeStick = async (item) => {
    setLoading(true)

    // getting owner data for the firestore
    const ownerdata = (await getDoc(doc(database, `users/${item.user}`))).data()

    // rate hook
    likeStickUser(item.id, userdata.uid)
      .then(exists => {
        const postdata = {
          date: new Date().toLocaleString(),
          uid: userdata.uid,
          location: ''
        }

        if (!exists) {
          addDoc(collection(database, `sticks/${item.id}/likes`), postdata)
            .then((res) => {
              // update user's rate
              updateDoc(doc(database, `sticks/${item.id}`), { likes: item.likes + 1 })
                .then((ress) => {
                  item.likes = stick.likes + 1

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
                          action: 'like stick',
                          itemId: item.id,
                          title: item.title,
                          content: item.content
                        },
                        date: new Date().toUTCString()
                      }
                    }

                    if (item.user !== userdata.uid) {
                      sendPushNotification(notification)
                      // add notification in the doc
                      addDoc(collection(database, `users/${item.user}/notifications`), notification.content)
                    }
                  }
                })
            }).catch((e) => {
              setLoading(false)
              alert('Could not like this stick, please try again later')
            })
        } else {
          exists.docs.map((resDoc) => {
            deleteDoc(doc(database, `sticks/${item.id}/likes/${resDoc.id}`))
              .then(() => {
                const like = stick.likes !== 0 ? stick.likes - 1 : 0
                updateDoc(doc(database, `sticks/${item.id}`), { likes: like })
                stick.likes = like
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


  useEffect(() => {
    checkIfLiked(stick)
  }, [])


  return (
    <View
      style={{
        justifyContent: "space-between",
        flexDirection: "row",
        marginLeft: 0,
        marginTop: 5,
      }}
    >
      <View style={{
        position: 'absolute',
        bottom: 30,
        right: 5
      }}>
        {loading && <ActivityIndicator size="small" color={colors.primary} />}
      </View>

      <TouchableOpacity
        onPress={() => stickPushToView(stick)}
        style={styles.iconContainer}
      >
        <EvilIcons name={"comment"} size={20} color={"grey"} />
        <Text style={styles.number}>{stick.comments}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => likeStick(stick)}
        style={styles.iconContainer}
      >
        {isliked ? (
          <Fontisto name={"heart"} size={13} color={colors.primary} />
        ) : (
          <Fontisto name={"heart-alt"} size={13} color={colors.primary} />
        )}

        <Text style={styles.number}>{stick.likes}</Text>
      </TouchableOpacity>
    </View>
  )
}
export default Footer
