
import { TouchableOpacity } from "@gorhom/bottom-sheet"
import React from "react"
import { Text, View, Image } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import colors from "../config/colors"
import moment from "moment"
import { useSelector } from "react-redux"
import { selectNotification } from "../redux/features/notifications"
import { selectUser } from "../redux/features/user"


export default function NotificationScreen({ navigation }) {
  const userNotifications = useSelector(selectNotification)
  const userdata = useSelector(selectUser)


  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 0.3,
          width: "100%",
          backgroundColor: "grey",
        }}
      />
    )
  }

  // go to user's page
  const goToUserPage = (item) => {
    navigation.navigate("UserPage", {
      data: {
        fullname: item.fullname,
        profile: item.profile,
        pushToken: item.pushToken,
        sticks: item.stiiks,
        id: item.uid,
        username: item.username,
        villages: item.villages,
        watchers: item.watchers,
        watching: item.watching,
      }
    })
  }

  // on selected notification
  const onSelected = (item) => {
    switch (item.data.action) {
      case "watch":
        navigation.navigate("UserPage", {
          data: {
            fullname: item.data.otherUser.fullname,
            profile: item.data.otherUser.profile,
            pushToken: item.data.otherUser.pushToken,
            sticks: item.data.otherUser.stiiks,
            id: item.data.otherUser.uid,
            username: item.data.otherUser.username,
            villages: item.data.otherUser.villages,
            watchers: item.data.otherUser.watchers,
            watching: item.data.otherUser.watching,
          }
        })
        break
      case 'stick tag':
        navigation.navigate('StickComments', {
          data: {
            id: item.data.itemId,
            content: item.data.content,
            title: item.data.title,
            user: item.data.otherUser.uid,
            profile: item.data.otherUser.profile
          }
        })
        break
      case 'like stick':
        navigation.navigate('StickComments', {
          data: {
            id: item.data.itemId,
            content: item.data.content,
            title: item.data.title,
            user: item.data.otherUser.uid,
            profile: item.data.otherUser.profile
          }
        })
        break
      case 'like calabash':
        navigation.navigate('CalabashSticks', {
          data: {
            id: item.data.itemId,
            description: item.data.description,
            title: item.title,
            file: item.data.file,
            user: item.data.otherUser.uid,
            profile: item.data.otherUser.profile
          }
        })
        break
      case 'tag calabash':
        navigation.navigate('CalabashSticks', {
          data: {
            id: item.data.itemId,
            description: item.data.content,
            title: item.data.title,
            file: item.data.file,
            user: userdata.uid,
            profile: item.data.otherUser.profile
          }
        })
        break

      case 'river stick':
        navigation.navigate('RiverChatRoom', {
          data: {
            id: item.data.id,
            otherUser: item.otherUser
          }
        })
        break
    }
  }


  
  return (
    <View style={{ flex: 1 }}>
      {userNotifications.length === 0 ? (
        <Text style={{ marginTop: 20, alignSelf: "center" }}>
          No notification
        </Text>
      ) : null}

      <View style={{ padding: 0 }}>
        {userNotifications.length > 0 && <FlatList
          style={{ height: "100%" }}
          data={userNotifications}
          ItemSeparatorComponent={FlatListItemSeparator}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => onSelected(item)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 10,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => goToUserPage(item.data.otherUser)}>
                      <Image
                        source={{ uri: item?.data.otherUser.profile }}
                        style={{
                          backgroundColor: "grey",
                          borderRadius: 25,
                          marginLeft: 15,
                          alignSelf: "center",
                          height: 45,
                          width: 45
                        }}

                      />
                    </TouchableOpacity>

                    <View style={{ marginLeft: 10, alignSelf: "center" }}>
                      <Text>{item?.data.otherUser.fullname}</Text>
                      <Text style={{ color: colors.primary, fontSize: 10 }}>
                        @{item?.data.otherUser.username}
                      </Text>
                      <Text style={{ marginTop: 5 }}>{item?.body}</Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{ marginLeft: 40, marginBottom: 10 }}
                >
                  <Text style={{ fontSize: 10, color: "grey" }}>
                    {moment(item?.date).fromNow()}
                  </Text>

                </View>
              </TouchableOpacity>
            )
          }}
        />}
      </View>
    </View>
  )
}
