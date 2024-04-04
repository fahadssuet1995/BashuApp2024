import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import StickReplyItem from "./Item";


const StickReply = ({ id }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // getData();
  }, [data]);

  return (
    <View>
      <FlatList
        data={data}
        extraData={data}
        refreshing={loading}
        // onRefresh={getData}
        keyExtractor={(item) => item.created_at}
        ItemSeparatorComponent={() => {
          return <View style={{ height: 0.5, backgroundColor: "#CCCCCC" }} />;
        }}
        renderItem={({ item }) => <StickReplyItem item={item} />}
      />
    </View>
  );
};

export default StickReply;
