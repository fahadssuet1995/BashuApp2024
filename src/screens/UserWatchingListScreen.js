import React, { useEffect, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../config/colors";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import QueryString from "querystring";
import {
  SkypeIndicator,
} from "react-native-indicators";
import { Entypo } from "@expo/vector-icons";
import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../config/firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/features/user";


export default function UserWatchingListScreen() {
  const navigation  = useNavigation();
  const [watching, setWatching] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const userdata = useSelector(selectUser)


  const fetchWatching = async () => {
    setLoading(true);
    const unsubUserSt = onSnapshot(collection(database, `users/${userdata.uid}/watching`), async res => {
      const result  = res.docs.map(res => {
        const id = res.id
        const data = res.data()
        return { id, ...data }
      })

      setWatching(result)
      setLoading(false)
      unsubUserSt()
    })
  };

  const userPagePushToView = async (user ) => {
    navigation.navigate("UserPage", { data: user })
  };

  const initChatRoom = async (item ) => {
    if (item.user !== userdata.uid) navigation.navigate("RiverChatRoom", {
      data: {
        id: item.user,
        otherUser: item
      }
    })
  };


  useEffect(() => {
    fetchWatching();
  }, []);


  
  return (
    <View>
      {shouldLoad ? (
        <SkypeIndicator
          style={{ position: "absolute", zIndex: 1000, alignSelf: "center" }}
          size={40}
          color="red"
        />
      ) : null}
      {loading ? (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator color={colors.primary} size={"small"} />
        </View>
      ) : (
        <FlatList
          style={styles.root}
          data={watching}
          extraData={watching}
          renderItem={({ item }) => {
            return (
              <View>
                <View style={styles.container}>
                  <TouchableOpacity
                    onPress={() => userPagePushToView(item)}
                  >
                    <Image
                      style={{
                        alignSelf: "center",
                        width: 40,
                        height: 40,
                        backgroundColor: "gray",
                        borderRadius: 50,
                        marginTop: 8,
                      }}
                      source={{
                        uri: item.profile,
                      }}
                    />
                  </TouchableOpacity>
                  <View style={styles.content}>
                    <View
                      style={styles.contentHeader}
                    >
                      <Text style={styles.name}>{item.fullname}</Text>
                    </View>
                    <View style={styles.contentHeader}>
                      <View
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text style={styles.username}>{item.username}</Text>
                          <Entypo
                            style={{ alignItems: "center" }}
                            name={"dot-single"}
                            size={10}
                            color={colors.primary}
                          />
                          <Text style={styles.joined}>
                            joined {moment(item.joined_at).fromNow()}
                          </Text>
                        </View>
                        <Text style={styles.ago}>
                          Watched {moment(item.date).fromNow()}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => initChatRoom(item)}
                        style={{
                          backgroundColor: colors.primary,
                          padding: 5,
                          borderRadius: 30,
                          height: 20,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 10,
                            alignSelf: "center",
                          }}
                        >
                          Start Flow
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop: 10,
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    marginBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontSize: 14,
    marginTop: 8,
    fontWeight: "bold",
  },
  username: {
    fontSize: 10,
    color: colors.primary,

    marginTop: -5,
  },
  ago: {
    fontSize: 10,
    marginTop: 8,
    color: "black",
  },
  joined: {
    fontSize: 10,
    color: "gray",
    marginTop: -5,
  },
});
