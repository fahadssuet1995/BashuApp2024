import React, { useEffect, useState } from "react";
import { FlatList, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import Villages from "../Forest";
import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../../config/firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/user";
import colors from "../../config/colors";
import {
  Ionicons,
} from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native";


const UserVillages = ({ user }) => {
  const navigation = useNavigation()
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const userdata = useSelector(selectUser)
  // get data
  const getData = async () => {
    const userId = user.uid ? user.uid : user.id
    setIsLoading(true)
    const unsub = onSnapshot(collection(database, `users/${userId}/villages`), snap => {
      const result = snap.docs.map(doc => {
        const id = doc.id
        const data = doc.data()
        return { id, ...data }
      })

      setIsLoading(false);
      setData(result)
      unsub()
    })
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <View>
      {isLoading ? (
        <View
          style={{
            margin: 5,
          }}
        >
          <ActivityIndicator size={"small"} color={"red"} />
        </View>
      ) : (
        <>
          <FlatList
            data={data}
            style={[{height: '100%'}]}
            renderItem={({ item }) => <Villages village={item} user={user} />}
          />

          {user.uid === userdata.uid &&
            <TouchableOpacity
              onPress={() => navigation.navigate("NewVillageScreen")}
              style={{
                position: "absolute",
                bottom: 30,
                right: 20,
                backgroundColor: colors.primary,
                padding: 5,
                borderRadius: 100,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons name={"add-circle"} color={"white"} size={30} />
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  alignItems: "center",
                  paddingRight: 5,
                }}
              >
                Launch Village
              </Text>
            </TouchableOpacity>}
        </>
      )}
    </View>
  );
};

export default UserVillages
