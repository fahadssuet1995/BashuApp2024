import React, { useEffect, useRef, useState } from "react"
import { View, Text, TouchableOpacity, Share, Alert, ActivityIndicator, Image } from "react-native"
import colors from "../../../../config/colors"
import { useNavigation } from "@react-navigation/native"
import ProfilePicture from "../../../ProfilePicture"
import { EvilIcons, Fontisto, Entypo, MaterialCommunityIcons, Octicons, AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux"
import { sendPushNotification } from "../../../../hooks/Notifications"
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { database } from "../../../../config/firebase"
import { likeStickUser, likeUserCalabash } from "../../../../hooks/User"
import styles from "./styles";
import RBSheet from "react-native-raw-bottom-sheet"
import { selectUser, setSticks } from "../../../../redux/features/user"
import { formatDistance, subDays } from "date-fns"
import { addForestLike, removeForestLike } from "../../../../redux/features/data"
import AsyncStorage from "@react-native-async-storage/async-storage"



const VillageMainContainer = ({ stick, user, index }) => {
  const navigation = useNavigation()
  const userdata = useSelector(selectUser)
  const [loadind, setLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const fullActionSheet = useRef();
  const reportSheet = useRef();
  const dispatch = useDispatch()
  const [datauser, setDataUser] = useState({})



  const userData = async (uid) => {
    const data = (await getDoc(doc(database, `users/${uid}`))).data()
    if (data) { setDataUser(data) }
  }

  const openReportSheet = async (uid) => {
    fullActionSheet?.current?.close();
    setTimeout(() => {
      reportSheet.current?.open();
    }, 500);
  };


  const showAlert = () => {
    reportSheet?.current?.close();
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
      );
    }, 500)
  }

  // that 
  const stickPushToView = async (data) => {
    AsyncStorage.setItem('index', String(index))
      .then(() => {
        navigation.navigate("StickComments", { data: data })
      })
  }

  // push image to view
  const pushToView = async (item) => {
    AsyncStorage.setItem('index', String(index))
      .then(() => {
        navigation.navigate("CalabashSticks", { data: item })
      })
  }

  // 
  const userPagePushToView = (item) => {
    navigation.navigate("UserPage", { data: { id: item.userId ? item.userId : item.user } })
  }


  // like village method
  const likeVillage = async (item) => {
    // setLoading(true)

    // getting owner data for the firestore
    const ownerdata = (await getDoc(doc(database, `users/${item.user}`))).data()

    if (item.file) {
      // rate hook
      likeUserCalabash(item.id, userdata.uid)
        .then((exists) => {
          const postdata = {
            date: new Date().toUTCString(),
            uid: userdata.uid,
            location: ''
          }

          if (!exists) {
            setIsLiked(true)
            dispatch(addForestLike({ index: index }))

            addDoc(collection(database, `calabash/${item.id}/likes`), postdata)
              .then(async (res) => {
                // update user's rate
                await updateDoc(doc(database, `calabash/${item.id}`), { likes: item.likes + 1 })
                  .then(() => {

                    setIsLiked(true)
                    setLoading(false)

                    if (ownerdata) {
                      const notification = {
                        to: ownerdata.pushToken,
                        content: {
                          sound: 'default',
                          title: `New Like`,
                          body: `${userdata.fullname} liked your calabash.`,
                          data: {
                            otherUser: userdata,
                            action: 'like calabash',
                            itemId: item.id,
                            content: item.description,
                            title: item.title,
                            file: item.file
                          },
                          date: new Date().toUTCString()
                        }
                      }

                      if (item.user !== userdata.uid) sendPushNotification(notification)
                    }
                  })
              }).catch(() => {
                setIsLiked(false)
                const like = stick.likes !== 0 ? stick.likes - 1 : 0
                dispatch(removeForestLike({ index: index, value: like }))
                alert('Could not like this calabash, please try again later')
              })
          } else {
            exists.docs.map((resDoc) => {
              deleteDoc(doc(database, `calabash/${item.id}/likes/${resDoc.id}`))
                .then(() => {
                  const like = stick.likes !== 0 ? stick.likes - 1 : 0
                  updateDoc(doc(database, `calabash/${item.id}`), { likes: like })
                  setIsLiked(false)
                  dispatch(removeForestLike({ index: index, value: like }))
                  setLoading(false)
                }).
                catch(e => {
                  setLoading(false)
                })
            })
          }
        })
    } else {
      console.log()
      // rate hook
      likeStickUser(item.id, userdata.uid)
        .then((exists) => {
          const postdata = {
            date: new Date().toUTCString(),
            uid: userdata.uid,
            location: ''
          }

          if (!exists) {
            setIsLiked(true)
            dispatch(addForestLike({ index: index }))


            addDoc(collection(database, `sticks/${item.id}/likes`), postdata)
              .then(async (res) => {
                // update user's rate
                await updateDoc(doc(database, `sticks/${item.id}`), { likes: item.likes + 1 })
                  .then(() => {

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

                      if (item.user !== userdata.uid) sendPushNotification(notification)
                    }
                  })
              }).catch((e) => {
                setLoading(false)
                setIsLiked(false)
                const like = stick.likes !== 0 ? stick.likes - 1 : 0
                dispatch(removeForestLike({ index: index, value: like }))
                alert('Could not like this stick, please try again later')
              })
          } else {
            exists.docs.map((resDoc) => {
              deleteDoc(doc(database, `sticks/${item.id}/likes/${resDoc.id}`))
                .then(() => {
                  const like = stick.likes !== 0 ? stick.likes - 1 : 0
                  updateDoc(doc(database, `sticks/${item.id}`), { likes: like })
                  setLoading(false)
                  dispatch(removeForestLike({ index: index, value: like }))
                  setLoading(false)
                }).
                catch(e => {
                  setLoading(false)
                })
            })
          }
        })
    }

  }


  const removeStick = (id) => {
    //setShouldLoad(true)
    fullActionSheet.current?.close()
    deleteDoc(doc(database, `sticks/${id}`))
      .then(() => {
        alert('Your stick was deleted!')
        dispatch(setSticks(userdata.sticks - 1))

      })
  }


  const onShare = async (item) => {
    try {
      const result = await Share.share({
        message:
          "Checkout " +
          item?.name || item?.title +
          "'s " +
          item?.type +
          "  :  ' " +
          item?.descripton || item?.content +
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


  useEffect(() => {
    // userData(stick.user)
  }, [])


  return (
    <>
      <RBSheet
        ref={fullActionSheet}
        height={200}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}
      >
        <View style={{ padding: 20, marginBottom: 10 }}>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => {
              fullActionSheet?.current?.close()
              if (stick?.file) {
                pushToView(stick)
              } else {
                stickPushToView(stick)
              }
            }}
          >
            <MaterialCommunityIcons
              color={colors.black}
              size={18}
              name={"comment-eye-outline"}
            />
            <View style={{ height: 30, marginLeft: 10 }}>
              <Text style={{ fontSize: 16 }}>View sticks</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() =>
              onShare(stick)
            }
          >
            <MaterialCommunityIcons
              color={colors.black}
              size={18}
              name={"share-all-outline"}
            />
            <View style={{ height: 30, marginLeft: 10 }}>
              <Text style={{ color: "black", fontSize: 16 }}>Share {stick?.type}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => openReportSheet(stick.user)}
          >
            <Octicons
              color={colors.black}
              size={15}
              name={"report"}
            />
            <View style={{ height: 30, marginLeft: 10 }}>
              <Text style={{ marginTop: -3, fontSize: 16 }}>Report stick</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => {
              fullActionSheet?.current?.close()
              Alert.alert('Block @' + datauser?.username, 'Are you sure you want to block user?', [
                {
                  text: 'Cancel',
                  onPress: () => { },
                  style: 'cancel',
                },
                {
                  text: 'BLOCK USER', onPress: () => {
                    Alert.alert('', 'We have recieved your request. You wont see posts from @' + datauser?.username, [
                      {
                        text: 'Noted',
                        onPress: () => { },
                        style: 'cancel',
                      },
                    ]);

                  }
                },
              ]);
            }}
          >
            <Octicons
              color={colors.black}
              size={15}
              name={"report"}
            />
            <View style={{ height: 30, marginLeft: 10 }}>
              <Text style={{ marginTop: -3, color: "red" }}>Block @{stick?.username}</Text>
            </View>
          </TouchableOpacity>

          {userdata.uid === stick.user ? (
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => removeStick(stick.id)}
            >
              <MaterialCommunityIcons
                color={"red"}
                size={18}
                name={"close"}
              />
              <View style={{ height: 30, marginLeft: 10 }}>
                <Text style={{ color: "red" }}>Delete</Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </RBSheet>
      <RBSheet
        ref={reportSheet}
        height={350}
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

          <TouchableOpacity
            style={{ flexDirection: "row", marginBottom: 5 }}
            onPress={() => reportSheet.current?.close()}
          >

            <View style={{ height: 30, marginLeft: 10 }}>
              <Text style={{ marginTop: 0, color: "red" }}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
      </RBSheet>


      <View style={{
        position: 'absolute',
        top: 30,
        right: 15,
      }}>
        {loadind && <ActivityIndicator size="small" color={colors.primary} />}
      </View>

      {!stick.file ? <View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginLeft: 1,
            padding: 10,
          }}
        >
          <View>
            <TouchableOpacity
              onPress={() => userPagePushToView(stick)}
            >
              <ProfilePicture image={stick.profile} size={50} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginLeft: -17,
                marginRight: 20,
              }}
            >
              <View style={{ width: "100%" }}>
                <TouchableOpacity onPress={() => { }}>
                  <Text style={{ marginLeft: 30, fontWeight: "bold" }}>
                    {stick.title}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => userPagePushToView(stick)}>
                  <Text style={{ marginLeft: 30, fontWeight: "bold", fontSize: 10, color: colors.primary }}>
                    @{stick.username}
                  </Text>
                </TouchableOpacity>

                {stick?.date &&<Text
                  style={{
                    color: "black",
                    fontSize: 10,
                    marginLeft: 30,
                    marginTop: 5,
                    marginBottom: 10
                  }}
                >
                  {formatDistance(new Date(stick?.date), new Date(), { addSuffix: true })}
                </Text>}
              </View>
            </View>

            <View>
              <TouchableOpacity activeOpacity={0.5} onPress={() => stickPushToView(stick)}>
                <Text style={styles.content}>{stick.content}</Text>
              </TouchableOpacity>
              <View style={{ marginLeft: 10 }}>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginLeft: 0,
                    marginTop: 5,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => stickPushToView(stick)}
                    style={styles.iconContainer}
                  >
                    <EvilIcons name={"comment"} size={20} color={"grey"} />
                    <Text style={styles.number}>{stick.comments}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => likeVillage(stick)}
                    style={styles.iconContainer}
                  >
                    {isLiked ? (
                      <Fontisto name={"heart"} size={13} color={colors.primary} />
                    ) : (
                      <Fontisto name={"heart-alt"} size={13} color={colors.primary} />
                    )}
                    <Text style={styles.number}>{stick.likes}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={{}}>
            <TouchableOpacity
              onPress={() => {
                userData(stick.user)
                fullActionSheet?.current.open()
              }
              }
              style={{ flexDirection: "row", }}
            >
              <Entypo
                size={15}
                color={colors.black}
                name={"dots-three-horizontal"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
        :
        <View style={{
          marginVertical: 14,
          marginHorizontal: 15
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <View style={{
              flexDirection: 'row'
            }}>
              <TouchableOpacity
                style={{ marginBottom: 10 }}
                onPress={() => {
                  userPagePushToView(stick)
                }}
              >
                <ProfilePicture image={stick.profile} size={50} />
              </TouchableOpacity>

              <View style={{
                marginLeft: 15
              }}>
                <TouchableOpacity onPress={() => { }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {stick.title}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => userPagePushToView(stick)}>
                  <Text style={{ fontWeight: "bold", fontSize: 10, color: colors.primary }}>
                    @{stick.username}
                  </Text>
                </TouchableOpacity>

                {stick?.date && <Text
                  style={{
                    color: "black",
                    fontSize: 10,
                    marginTop: 5,
                    marginBottom: 10
                  }}
                >
                  {formatDistance(new Date(stick?.date), new Date(), { addSuffix: true })}
                </Text>}
              </View>
            </View>

            <TouchableOpacity style={{
              alignSelf: 'flex-start'
            }} onPress={() => fullActionSheet?.current.open()}>
              <Entypo
                size={15}
                color={colors.black}
                name={"dots-three-horizontal"}
              />
            </TouchableOpacity>


          </View>
          <TouchableOpacity activeOpacity={.9} onPress={() => pushToView(stick)}>
            <Image source={{ uri: stick.file }}
              style={{
                width: '100%',
                height: 200,
                borderRadius: 14,
              }}
            />
          </TouchableOpacity>
          <View style={{ marginLeft: 10 }}>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                marginLeft: 0,
                marginTop: 5,
              }}
            >
              <View style={styles.iconContainer}>
                <EvilIcons name={"comment"} size={20} color={"grey"} />
                <Text style={styles.number}>{stick.comments}</Text>
              </View>

              <TouchableOpacity
                onPress={() => likeVillage(stick)}
                style={styles.iconContainer}
              >
                {isLiked ? (
                  <Fontisto name={"heart"} size={13} color={colors.primary} />
                ) : (
                  <Fontisto name={"heart-alt"} size={13} color={colors.primary} />
                )}

                <Text style={styles.number}>{stick.likes}</Text>
              </TouchableOpacity>
            </View>



          </View>


        </View>
      }
    </>
  )
}


export default VillageMainContainer

