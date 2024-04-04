import React, { useRef } from "react"
import { View, Text, TouchableOpacity, Share, Alert } from "react-native"
import styles from "./styles"
import { Entypo, MaterialCommunityIcons, Octicons, AntDesign } from "@expo/vector-icons"
import Footer from "./Footer"
import moment from "moment"
import colors from "../../../../config/colors"
import { useNavigation } from "@react-navigation/native"
import RBSheet from "react-native-raw-bottom-sheet"
import { deleteDoc, doc } from "firebase/firestore"
import { database } from "../../../../config/firebase"
import { useDispatch, useSelector } from "react-redux"
import { selectUser, setSticks } from "../../../../redux/features/user"



const MainContainer = ({ stick }) => {
  const navigation = useNavigation()
  const fullActionSheet = useRef()
  const reportSheet = useRef()
  const dispatch = useDispatch()
  const userdata = useSelector(selectUser)

  // view sticks
  const pushToView = async (item) => {
    navigation.navigate("StickComments", { data: item })
    fullActionSheet.current?.close()
  }

  const openBottomMenu = async () => {
    fullActionSheet.current?.open()
  }

  const openReportSheet = async () => {
    fullActionSheet.current?.close()
    setTimeout(() => {
      reportSheet.current?.open()
    }, 500)
  }

  const showAlert = () => {
    reportSheet.current?.close()
    setTimeout(() => {
      Alert.alert(
        "Thank you for reporting this Stick",
        "We will review this stick to decide wheather it violates our policies",
        [
          {
            text: "Noted",
            onPress: () => { },
            style: "cancel",
          },
        ]
      )
    }, 500)
  }

  // share stick
  const onShare = async (content, name) => {
    try {
      const result = await Share.share({
        message:
          "Checkout " +
          name +
          "'s stick  :  ' " +
          content +
          "' on Bashu mobile application. Download Bashu app on google PlayStore and AppStore today!",
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

  // method to remove stick
  const removeStick = async (item) => {
    //setShouldLoad(true)
    fullActionSheet.current?.close()
    deleteDoc(doc(database, `sticks/${item.id}`))
      .then(() => {
        alert('Your stick was deleted!')
        dispatch(setSticks(userdata.sticks - 1))
      })
  }

  

  return (
    <View style={{ flex: 1 }}>
      <View style={{}}>
        <RBSheet
          ref={fullActionSheet}
          height={150}
          openDuration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            },
          }}
        >
          <View style={{ padding: 20 }}>
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => pushToView(stick)}
            >
              <MaterialCommunityIcons
                color={colors.black}
                size={18}
                name={"comment-eye-outline"}
              />
              <View style={{ height: 30, marginLeft: 10 }}>
                <Text>View sticks</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => onShare(stick.content, stick.name)}
            >
              <MaterialCommunityIcons
                color={colors.black}
                size={15}
                name={"share-all-outline"}
              />
              <View style={{ height: 30, marginLeft: 10 }}>
                <Text>Share stick</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", display: "none" }}
              onPress={() => openReportSheet()}
            >
              <Octicons
                color={colors.black}
                size={15}
                name={"report"}
              />
              <View style={{ height: 30, marginLeft: 10 }}>
                <Text style={{ marginTop: -3 }}>Report stick</Text>
              </View>
            </TouchableOpacity>

            {stick.user === userdata.uid && <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => removeStick(stick)}
            >
              <MaterialCommunityIcons color={"red"} size={18} name={"close"} />
              <View style={{ height: 30, marginLeft: 10 }}>
                <Text style={{ color: "red" }}>Delete</Text>
              </View>
            </TouchableOpacity>}
          </View>
        </RBSheet>

        <RBSheet
          ref={reportSheet}
          height={300}
          openDuration={200}
          customStyles={{
            container: {
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            },
          }}
        >
          <View style={{ padding: 20 }}>

            <Text style={{ alignSelf: "center", fontWeight: "bold", marginBottom: 30 }}>REPORT STICK</Text>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Why are you reporting this stick?</Text>

            <TouchableOpacity
              style={{ flexDirection: "row", marginBottom: 5 }}
              onPress={() => showAlert()}
            >
              <AntDesign
                color={colors.black}
                size={18}
                name={"exclamationcircle"}
              />
              <View style={{ height: 30, marginLeft: 10 }}>
                <Text>It's spam</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", marginBottom: 5 }}
              onPress={() => showAlert()}
            >
              <AntDesign
                color={colors.black}
                size={18}
                name={"exclamationcircle"}
              />
              <View style={{ height: 30, marginLeft: 10 }}>
                <Text>I find it offensive</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", marginBottom: 5 }}
              onPress={() => showAlert()}
            >
              <AntDesign
                color={colors.black}
                size={18}
                name={"exclamationcircle"}
              />
              <View style={{ height: 30, marginLeft: 10 }}>
                <Text style={{ marginTop: 0 }}>It is misleading</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", marginBottom: 5 }}
              onPress={() => showAlert()}
            >
              <AntDesign
                color={colors.black}
                size={18}
                name={"exclamationcircle"}
              />
              <View style={{ height: 30, marginLeft: 10 }}>
                <Text style={{ marginTop: -3 }}>It is a scam</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", marginBottom: 5 }}
              onPress={() => showAlert()}
            >
              <AntDesign
                color={colors.black}
                size={18}
                name={"exclamationcircle"}
              />
              <View style={{ height: 30, marginLeft: 10 }}>
                <Text style={{ marginTop: -3 }}>It is refer to a political affair</Text>
              </View>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </View>

      <View style={styles.container} >
        <View style={styles.stickHeaderContainer}>
          <View

            style={styles.stickHeaderNames}
          >
            <Text style={styles.name}>{stick.title}</Text>
            {/* {stick.user !== userdata.uid && <Text style={styles.username}>@{stick.username}</Text>} */}
          </View>
          <View>
            <TouchableOpacity onPress={openBottomMenu}
              style={{ flexDirection: "row", padding: 3 }}
            >
              <Entypo
                size={15}
                color={colors.black}
                name={"dots-three-horizontal"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text style={styles.createdat}>
            {moment(stick.date).fromNow()}
          </Text>
          <TouchableOpacity onPress={() => pushToView(stick)}>
            <Text style={styles.content}>{stick.content}</Text>
          </TouchableOpacity>
          
          <Footer stick={stick} />
        </View>
      </View>
    </View>
  )
}

export default MainContainer
