
import styles from "./styles"
import colors from "../../../config/colors"
import moment from "moment"
import React, {  useState } from "react"
import {
  TouchableOpacity,
  Text,
  View,
  Image,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/core"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { selectUser, setData } from "../../../redux/features/user"
import { doc, getDoc } from "firebase/firestore"
import { database } from "../../../config/firebase"



const StickReplyItem = ({ item }) => {
  const navigation = useNavigation()
  // const stickInput: any = useRef<TextInput>()
  const userdata = useSelector(selectUser)
  const [data, setData] = useState(null)


  useEffect(() => {
    async function getUserData() {
      const data = (await getDoc(doc(database, `users/${item.user}`))).data()
      if (data) setData(data)
    }

    getUserData()
  }, [])


  const userPagePushToView = async (item) => {
    if (item.user !== userdata.uid) navigation.navigate("UserPage", { data: { id: item.user } })
  }

  const loadReplies = async (item) => {
    // navigation.navigate("StickReplyScreen", { data: item })
  }

  const likeStick = async (id, type) => {
    const userData =
      (await AsyncStorage.getItem("@storage_UserDataKey")) || "{}"
    const jsonValue = JSON.parse(userData)

    const postData = {
      stick: id,
      type: type,
      user: jsonValue.id,
    }

    // const postStick = await axios.post(
    //   "/handler.php?request=stickReplyLike",
    //   // QueryString.stringify(postData)
    // )
    // if (postStick.data.message === "success") {
    // }
  }

  useEffect(() => {

  }, [])


  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => userPagePushToView(item)}>
          <Image style={styles.image} source={{ uri: item.profile }} />
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={{
            flexDirection: 'row',
          }}>
            <Text style={styles.name}>{data?.fullname}</Text>
            <Text style={[styles.name, { color: colors.primary, marginLeft: 5, fontSize: 10 }]}>@{item?.username}</Text>
          </View>

          <TouchableOpacity onPress={() => {
            navigation.navigate('Search', { title: item.title })
          }}>
            <Text style={styles.name}>{item.title}</Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => loadReplies(item)}>
            <Text>{item.comment}</Text>
          </TouchableOpacity>

          <Text style={styles.time}>{moment(item.date).fromNow()}</Text>

          <View style={{
            flexDirection: "row",
            justifyContent: "flex-end",
          }}>
            {/* <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
                width: 125,
              }}
            >
              <TouchableOpacity
                onPress={() => loadReplies(item)}
                style={{ flexDirection: "row" }}
              >
                <Text
                  style={{
                    color: "gray",
                    fontWeight: "bold",
                    fontSize: 10,
                  }}
                >
                  throw stick
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontSize: 10,
                    color: "gray",
                    fontWeight: "bold",
                  }}
                >
                  {item.likes}
                </Text>
                <Text
                  style={{
                    marginLeft: 2,
                    fontSize: 10,
                    color: "gray",
                    fontWeight: "bold",
                  }}
                >
                  likes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => likeStick(item.uuid, item.type)}
                style={{ flexDirection: "row" }}
              >
                <Fontisto color={"gray"} name={"heart-alt"} size={13} />
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </View>
    </View>
  )
}

export default StickReplyItem
