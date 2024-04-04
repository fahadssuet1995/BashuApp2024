import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
// import QueryString from "querystring";

import { Text, View } from "../components/Themed";
import colors from "../config/colors";
import ProfilePicture from "../components/ProfilePicture";
import DropdownAlert from "react-native-dropdownalert";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import titles from "../data/titles";
import {
  WaveIndicator,
} from "react-native-indicators";
import {
  Ionicons,
} from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";
import StickCommentReply from "../components/StickReply/StickReplyComment";
//import { useNavigation } from "@react-navigation/native";



export default function StickReplyScreen() {
  
  //const navigation = useNavigation();
  const [profile, setProfile]   = useState(null);
  const [showNoSticksMessage, setShowNoSticksMessage] = useState(false);
  const [shouldShowIndicator, setShouldShowIndicator] = useState(false);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [created_at, setCreatedAt] = useState("");
  const [profile_, setProfile_] = useState("");
  const [shouldShow, setShouldShow] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false);
  const dropdownAlert   = useRef();
  const titleActionSheet = useRef();
  const selectTitleSheet = useRef();
  const stickInput = useRef();

  const showTitleActionSheet = () => {
    titleActionSheet.current?.show();
  };

  const onTitleSelected = (mtitle) => {
    setTitle(mtitle);
    selectTitleSheet.current?.close();
  };

  const optionArray = titles;

  // const getData = async () => {
  //   const currentData =
  //     (await AsyncStorage.getItem("@storage_CurrentStickReplyDataKey")) || "";
  //   const jsonValue = JSON.parse(currentData);

  //   const request = await axios.get(
  //     "/handler.php?request=stick_comment_reply&stick=" + jsonValue.stick
  //   );

  //   if (!Array.isArray(request.data)) {
  //     //  showdropdownAlert();
  //   }
  //   if (request.data.length <= 0) {
  //     setShowNoSticksMessage(true);
  //   }
  //   // setData(request.data);
  //   setShouldShowIndicator(false);
  // };

  const showdropdownAlert = () => {
    dropdownAlert.current?.alertWithType(
      "info",
      "Info",
      "No comments yet. Be the first!"
    );
  };


  const loadLocal = async () => {
    const currentData =
      (await AsyncStorage.getItem("@storage_CurrentStickReplyDataKey")) || "";
    const jsonValue = JSON.parse(currentData);

    setTitle(jsonValue.title);
    setContent(jsonValue.content);
    setName(jsonValue.name);
    setUsername(jsonValue.username);
    setCreatedAt(jsonValue.created_at);
    setProfile_(jsonValue.profile);

    setTimeout(() => {
      setShouldShow(true);
    }, 500);
  };

  useEffect(() => {
   
    loadLocal();
    const userData = async () => {
      const userData =
        (await AsyncStorage.getItem("@storage_UserDataKey")) || "{}";
      const jsonValue = JSON.parse(userData);
      setProfile(jsonValue.profile);
    };
    // getData();
    userData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {shouldShow ? (
          <View>
            <View
              style={{ marginLeft: 15, flexDirection: "row", marginRight: 25 }}
            >
              <Image
                source={{ uri: profile_ }}
                style={{ backgroundColor: "gray", borderRadius: 50, width: 50, height: 50 }}
              />
              <View style={{ marginLeft: 18 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontWeight: "bold" }}>{name}</Text>
                  <Text
                    style={{
                      color: colors.primary,
                      marginLeft: 5,
                      fontSize: 10,
                      alignSelf: "center",
                    }}
                  >
                    @{username}
                  </Text>
                </View>

                <Text style={{ fontSize: 10, color: "gray", marginTop: 5 }}>
                  Thrown {moment(created_at).fromNow()}
                </Text>
              </View>
            </View>
            <View style={{ marginLeft: 13, padding: 5 }}>
              <Text style={{}}>{content}</Text>
            </View>
            <View
              style={{
                height: 0.2,
                backgroundColor: "lightgray",
                marginTop: 5,
              }}
            />
          </View>
        ) : null}

        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {shouldShowIndicator ? (
            <ActivityIndicator
              style={{ marginTop: 20 }}
              size={30}
              color={colors.primary}
            />
          ) : null}
          {showNoSticksMessage ? (
            <Text style={{ marginTop: 5 }}>
              No sticks thrown yet. Be first to throw!
            </Text>
          ) : null}
        </View>

        <View style={{ zIndex: 343454353 }}>
          <DropdownAlert ref={dropdownAlert} />
        </View>
        {shouldLoad ? (
          <WaveIndicator
            style={{
              position: "absolute",
              zIndex: 10000000,
              alignSelf: "center",
              top: 30,
            }}
            size={40}
            color="red"
          />
        ) : null}

        <StickCommentReply />
      </ScrollView>

      <View
        style={{
          padding: 10,
          top: 10,
          width: "100%",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            height: 130,
            bottom: 0,
            borderTopColor: colors.medium,
            borderTopWidth: 0.5,
            padding: 10,
          }}
        >
          <View
            style={{
              marginLeft: 10,
              marginBottom: 10,
              flex: 1,
            }}
          >
            <TouchableOpacity onPress={() => selectTitleSheet.current?.open()}>
              <Text style={styles.fieldText}>Your topic</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  onChangeText={(value) => setTitle(value)}
                  style={styles.titleSelectField}
                  pointerEvents="none"
                  editable={false}
                  placeholderTextColor={"#0A0914"}
                  placeholder="Select topic"
                  keyboardType="default"
                  value={title}
                />

                <Ionicons
                  name={"chevron-down"}
                  color={"#0A0914"}
                  size={20}
                  style={{ marginTop: -8, marginRight: 10 }}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row" }}>
            <ProfilePicture image={profile} />
            <View
              style={{
                borderColor: colors.medium,
                borderWidth: 1,
                width: 260,
                right: 10,
                marginLeft: 20,
                borderRadius: 50,
                height: 50,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TextInput
                // ref={stickInput}
                numberOfLines={10}
                multiline={true}
                onChangeText={(text) => setComment(text)}
                placeholder="Say something"
                maxLength={500}
                style={{
                  width: 145,
                  right: 10,
                  marginLeft: 30,
                }}
              />
              <TouchableOpacity
                // onPress={() => addComment()}
                style={{ justifyContent: "center", right: 10 }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontWeight: "bold",
                    marginRight: 5,
                  }}
                >
                  Throw stick
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <RBSheet
        ref={selectTitleSheet}
        height={450}
        openDuration={0}
        customStyles={{
          container: {},
        }}
      >
        <View style={{ marginTop: 20 }} />
        <ScrollView>
          {titles.map(item => {
            return (
              <TouchableOpacity key={item.id} onPress={() => onTitleSelected(item.name)} style={{
                height: 25,
                marginHorizontal: 20,
                marginVertical: 5
              }}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
        <View style={{
          marginBottom: 35
        }}>
          <TouchableOpacity
            style={{ alignSelf: "center" }}
            onPress={() => selectTitleSheet.current?.close()}
          >
            <Text style={{ color: "red", fontWeight: "bold" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  );
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
    fontSize: 16,
    fontWeight: "bold",
  },
  fieldText: {
    height: 20,
    top: 1,
    color: "#787D8B",
    width: 100,
    fontSize: 12,
  },
  titleSelectField: {
    fontSize: 16,
    color: "#0A0914",
    height: 24,
    width: 140,
  },
  wrapcontainer: {
    paddingRight: 16,
    paddingVertical: 12,
    alignItems: "flex-start",
  },
});
