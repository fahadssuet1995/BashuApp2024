import React, { useEffect, useState } from "react"
import {
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Villages from "../components/Forest"

export default function TitleSticksScreen() {
  const navigation  = useNavigation()
  const [data, setData] = useState([])
  const [title, setTitle] = useState("")
  const [shouldShow, setShouldShow] = useState(true)

  const getData = async () => {
    const title =
      (await AsyncStorage.getItem("@storage_CurrentTitleKey")) || "{}"
    setTitle(title)
    // const request = await axios.get(
    //   "/handler.php?request=by-title&title=" + title
    // )
    // setData(request.data)
    // setShouldShow(false)
  }

  navigation.setOptions({
    title: title,
  })

  useEffect(() => {
    getData()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {shouldShow ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color="#0000ff" size={"large"} />
        </View>
      ) : null}
      <FlatList
        data={data}
        renderItem={({ item }) => <Villages village={item} />}
        keyExtractor={(item ) => item.uuid}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#ffffff",
    marginTop: 10,
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
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
  },
})
