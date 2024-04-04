import React from "react";
import { useState } from "react";
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import moment from "moment";
import styles from "./styles";
import ProfilePicture from "../ProfilePicture";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { collection, deleteDoc, doc, getDoc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/user";
import { database } from "../../config/firebase";



const RiverFeed = ({ user, route }) => {
  const [chatroom, setSticks] = useState([]);
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState(null)
  const navigation = useNavigation();
  const userdata = useSelector(selectUser)
  let unsubUserSt;



  const fetchChatrooms = async () => {
    setLoading(true)
    unsubUserSt = onSnapshot(collection(database, `users/${userdata.uid}/chat`), async res => {
      const result= res.docs.map(res => {
        const id = res.id
        const data = res.data()
        return { id, ...data }
      })

      result.sort(function compare(a, b) {
        let dateA = new Date(a.date);
        let dateB = new Date(b.date);
        return dateB - dateA;
      })

      setSticks(result)
      setLoading(false)
      unsubUserSt()
    })
  };


  const pushToView = async (item) => {
    const data = {
      otherUser: item.data.otherUser,
      id: item.data.otherUser.uid
    }

    navigation.navigate("RiverChatRoom", { data: data });
  };


  const getUser = async (id) => {
    const data = (await getDoc(doc(database, `users/${id}`))).data()
    if (data) setInfo(data)
  }

  // listend to react navigation native hooks
  useFocusEffect(
    React.useCallback(() => {
      fetchChatrooms()
      return () => {
        // removing listeners
        if (unsubUserSt) unsubUserSt()
      };
    }, [])
  )

  return (
    <FlatList
      data={chatroom}
      onRefresh={fetchChatrooms}
      refreshing={loading}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            onPress={() => pushToView(item)}
            style={{ flexDirection: "row", padding: 10 }}
          >
            <View style={{ marginTop: 10}}>
              <ProfilePicture image={item?.data?.otherUser.profile} size={50} />
            </View>
            <View style={[styles.main, {
              marginTop: 10,
              marginLeft: 5
            }]}>
              <View style={{}}>
                {String(user) === item.user_a ? (
                  <Text style={styles.user}>{item?.content}</Text>
                ) : (
                  <Text style={styles.user}>{item?.data?.otherUser?.fullname}</Text>
                )}
              </View>
              <Text style={{}}>{item?.content}</Text>
              <Text style={[styles.ago, {
                marginTop: 5
              }]}>
                Last time {moment(item.date).fromNow()}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default RiverFeed;
