import { AntDesign, Entypo, Feather } from "@expo/vector-icons"
import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native"
import { TextInput } from "react-native-gesture-handler"
import colors from "../config/colors"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { collection, getDocs, limit, onSnapshot, query, where } from "firebase/firestore"
import { database } from "../config/firebase"
import { useSelector } from "react-redux"
import { selectUser } from "../redux/features/user"
import VillageMainContainer from "../components/Forest/Villages/MainContainer"
import RBSheet from "react-native-raw-bottom-sheet"
import ProfilePicture from "../components/ProfilePicture"
import moment from "moment"
import Footer from "../components/Tree/Sticks/MainContainer/Footer"


export default function SearchScreen({ route }  ) {
  const [data, setData]   = useState([])
  const [filtered, setFilered]   = useState([])
  const [shouldLoading, setShouldLoading] = useState(false)
  const navigation   = useNavigation()
  const chatReplyInput   = useRef()
  const [search, setSearch] = useState('')
  const userdata = useSelector(selectUser)

  // navigate to users page
  const userPagePushToView = async (item) => {
    navigation.navigate("UserPage", { data: { id: item.id } })
  }

  // get data
  const getData = async () => {
    setShouldLoading(true)
    const unsub = onSnapshot(collection(database, `users/${userdata.uid}/watching`), snap => {
      snap.docs.map(async doc => {
        if (route?.params?.title) {
          const title = route?.params?.title

          const stickDocs = (await getDocs(query(collection(database, `sticks`)
            , where('user', '==', doc.data().user)
            , where('title', '==', title)
          )))

          const sticks   = stickDocs.docs.map(resdoc => {
            const id = resdoc.id
            const data = resdoc.data()
            return { id, data: data, type: 'stick', username: doc.data().username }
          })

          setFilered(sticks)
          setData(sticks)
          setShouldLoading(false)
        } else {


          const userDocs = (await getDocs(collection(database, `users`)))
          const stickDocs = (await getDocs(query(collection(database, `sticks`), where('user', '==', doc.data().user))))

          const sticks   = stickDocs.docs.map(resdoc => {
            const id = resdoc.id
            const data = resdoc.data()
            return { id, data: data, type: 'stick', username: doc.data().username }
          })


          const users   = userDocs.docs.map(resdoc => {
            const id = resdoc.id
            const data = resdoc.data()
            return { id, data: data, type: 'user' }
          })

          const data = users.filter((user  ) => user.id !== userdata.uid)

          const docData = [...sticks, ...data]

          setFilered(docData)
          setData(docData)
          setShouldLoading(false)
          unsub()
        }
      })

      if (snap.docs.length === 0) {
        getUsers()
      }
    })
  }


  const getUsers = async () => {
    const userDocs = (await getDocs(collection(database, `users`)))

    const users   = userDocs.docs.map(resdoc => {
      const id = resdoc.id
      const data = resdoc.data()
      return { id, data: data, type: 'user' }
    })

    const data = users.filter((user  ) => user.id !== userdata.uid)
    setFilered(data)
    setData(data)
    setShouldLoading(false)
  }

  // listend to react navigation native hooks
  useFocusEffect(
    useCallback(() => {
      if (route?.params?.title) navigation.setOptions({ title: `All ${route?.params?.title} sticks` })
      getData()
      return () => {
        // do something here
      }
    }, [])
  )

  // filter user method
  const filterData = async (text) => {

    // Inserted text is not blank
    // Filter the masterDataSource
    // Update FilteredDataSource
    if (text) {
      const newData = filtered.filter((item  ) => {
        const value = `${item.data.fullname} ${item.data.title} @${item.username} @${item.data?.username}`
        const itemData = `${item.data.fullname} ${item.data.title} @${item.username} @${item.data?.username}`
          ? value.toUpperCase()
          : ''.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
      })

      setFilered(newData)
      setSearch(text)
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilered(data)
      setSearch(text)
    }

  }

  const searchItem = ({ item }) => {
    const id = item.id;
    const stick = { id, ...item.data, username: item.username };
  
    return (
      <>
        {item.type === 'user' ? (
          <TouchableOpacity
            onPress={() => userPagePushToView(stick)}
            style={{ flexDirection: 'row', padding: 10 }}>
            {item.data.profile ? ( // Check if profile uri exists
              <Image
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: 'lightgray',
                  borderRadius: 40,
                }}
                source={{ uri: item.data.profile }}
              />
            ) : null}
            <View style={{ marginLeft: 8, marginTop: 5, flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <Text style={{ fontWeight: 'bold' }}>{item.data.fullname}</Text>
              <Text style={{ fontSize: 12, color: colors.primary, marginLeft: 5 }}>
                @{item.data.username}
              </Text>
            </View>
            <View
              style={{
                position: 'absolute',
                left: 70,
                top: 35,
                flexDirection: 'row',
              }}>
              <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{item.data.sticks} sticks</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 12, marginLeft: 5 }}>{item.data.calabash} calabashes</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <>
            <View style={{ marginTop: 20 }} />
            <VillageMainContainer stick={stick} user={stick} />
          </>
        )}
      </>
    );
  };
  

  return (
    <View style={{ flex: 1, paddingHorizontal: 10 }}>
      <View style={{ backgroundColor: "white", padding: 10 }}>
        {!route?.params?.title && <View
          style={{
            backgroundColor: "lightgray",
            borderRadius: 40,
            padding: 0,
            flexDirection: "row",
          }}
        >
          <Feather
            style={{ alignSelf: "center", marginLeft: 10 }}
            size={20}
            name={"search"}
            color={colors.primary}
          />

          <TextInput
            ref={chatReplyInput}
            onChangeText={(text) => filterData(text)}
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            style={{ height: 40, flex: 1, marginLeft: 10, marginRight: 10 }}
            placeholder={"Search"}
            value={search}
          />
        </View>}
      </View>

      {/* {shouldLoading ? (
        <ActivityIndicator
          style={{ marginTop: 5 }}
          color={colors.primary}
          size={20}
        />
      ) : null} */}
      <FlatList
        style={[{
          backgroundColor: 'white'
        }]}
        horizontal={true}
        refreshing={shouldLoading}
        onRefresh={() => getData()}
        data={filtered}
        keyExtractor={(item  ) => item.id}
        extraData={filtered}
        renderItem={searchItem}
        showsVerticalScrollIndicator={true}
      />
      
      <View style={{
        height: "80%",
        backgroundColor: 'white'
      }}>
        <FlatList
        data={data}
        extraData={data}
        renderItem={({ item }) => {
          return (
            <View>
              {item.type === "village" ? (
                <View>
                  <View
                    style={{ width: "100%", flexDirection: "row", padding: 15 }}
                  >
                    <View>
                      <TouchableOpacity
                        onPress={() => userPagePushToView(item, item.id)}
                      >
                        <ProfilePicture image={item.data.profile} size={50} />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                      <View style={styles.topDetails}>
                        <Text style={styles.user}>{item.data.content}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => userPagePushToView(item, item.id)}
                      >
                        <Text style={styles.username}>@{item.data.username}</Text>
                      </TouchableOpacity>
                      <Text style={styles.ago}>
                        Created {moment(item.created_at).fromNow()}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ padding: 10, marginLeft: 67, marginTop: -20 }}>
                    <TouchableOpacity onPress={() => pushToView(item.uuid)}>
                      <Image
                        style={{ height: 150, width: "100%", borderRadius: 10 }}
                        source={{ uri: item.image }}
                      />
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", marginTop: 13 }}>
                      <TouchableOpacity
                        onPress={() => sticksPagePushToView(item.title)}
                      >
                        <Text
                          style={{
                            color: "black",
                            fontSize: 14,
                            fontWeight: "bold",
                          }}
                        >
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                      <Entypo
                        style={{ alignSelf: "center", marginLeft: 10 }}
                        name={"dot-single"}
                        size={15}
                      />
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: colors.primary,
                          marginLeft: 10,
                        }}
                      >
                        {item.no_watching}
                      </Text>
                      <Text> watching</Text>
                    </View>
                  </View>
                  <View style={{ height: 0.3, backgroundColor: "grey" }} />
                </View>
              ) : (
                <View>
                  <View style={{ height: 0.2, backgroundColor: "grey" }} />
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
                        onPress={() => userPagePushToView(item, item.id)}
                      >
                        <ProfilePicture image={item.data.profile} size={50} />
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: "100%" }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginLeft: -17,
                        }}
                      >
                        <View style={{ width: "100%" }}>
                          <TouchableOpacity
                            onPress={() => sticksPagePushToView(item.title)}
                          >
                            <Text
                              style={{ marginLeft: 30, fontWeight: "bold" }}
                            >
                              {item.data.title}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => userPagePushToView(item, item.id)}
                          >
                            <Text
                              style={{
                                color: colors.primary,
                                marginLeft: 30,
                                marginBottom: 5,
                                fontSize: 10,
                              }}
                            >
                              @{item.data.username}
                            </Text>
                          </TouchableOpacity>
                          <Text
                            style={{
                              color: "black",
                              fontSize: 10,
                              marginLeft: 30,
                              marginTop: 5,
                            }}
                          >
                            {moment(item.data.created_at).fromNow()}
                          </Text>
                        </View>
                        <View></View>
                      </View>
                      <View style={{ marginLeft: 4 }}>
                        <TouchableOpacity
                          onPress={() => stickPushToView(item.uuid, item.title)}
                        >
                          <Text style={styles.content}>{item.data.content}</Text>
                        </TouchableOpacity>
                        <Footer stick={item} />
                      </View>
                    </View>
                  </View>
                  <View style={{ height: 0.2, backgroundColor: "grey" }} />
                </View>
              )}
            </View>
          );
        }}
      />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  user: {
    fontWeight: "bold",
    marginLeft: 2,
    marginTop: -5,
    lineHeight: 15,
    marginRight: 10,
  },
  ago: {
    color: "black",
    marginLeft: 10,
    marginTop: 8,
    marginBottom: 5,
    fontSize: 10,
  },
  username: {
    color: colors.primary,
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 10,
  },
  content: {
    color: "black",
    marginHorizontal: 10,
    marginRight: 40,
  },
  topDetails: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
  },
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  stickHeaderContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  stickHeaderNames: {
    flexDirection: "row",
  },
  name: {
    marginRight: 5,
    fontWeight: "bold",
  },
  createdat: {
    color: "grey",
    fontSize: 10,
  },
})
