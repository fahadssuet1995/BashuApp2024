import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";

import StickReplyItem from "./Item";
import colors from "../../config/colors";



const StickCommentReply = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    const currentData =
      (await AsyncStorage.getItem("@storage_CurrentStickReplyDataKey")) || "";
    const jsonValue = JSON.parse(currentData);

    // const request = await axios.get(
    //   "/handler.php?request=stick_comment_reply&uuid=" +
    //   jsonValue.uuid +
    //   "&type=" +
    //   jsonValue.type +
    //   "&stick=" +
    //   jsonValue.stick
    // );

    // if (!Array.isArray(request.data)) {
    //   //showdropdownAlert();
    // }
    // if (request.data.length <= 0) {
    //   // setShowNoSticksMessage(true);
    // }
    // setLoading(false);
    // setData(request.data);
    // setShouldShowIndicator(false);
  };

  useEffect(() => {
    getData();
  }, [data]);

  return (
    <View>
      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 10 }}
          size={"small"}
          color={colors.primary}
        />
      ) : (
        <FlatList
          data={data}
          extraData={data}
          refreshing={loading}
          onRefresh={getData}
          keyExtractor={(item) => item.created_at}
          ItemSeparatorComponent={() => {
            return <View style={{ height: 0.5, backgroundColor: "#CCCCCC" }} />;
          }}
          renderItem={({ item }) => <StickReplyItem item={item} />}
        />
      )}
    </View>
  );
};

export default StickCommentReply;
