import React from "react"
import { FlatList, View, ActivityIndicator } from "react-native"
import Villages from "../Forest"


const VillageList = ({ data, loading, getWathing }) => {
  return (
    <View>
      {loading ? (
        <View
          style={{
            margin: 5,
          }}
        >
          <ActivityIndicator size={"small"} color={"red"} />
        </View>
      ) : (
        <FlatList
          data={data}
          style={[{
            backgroundColor: 'white'
          }]}
          refreshing={loading}
          onRefresh={getWathing}
          ItemSeparatorComponent={() => {
            return <View style={{
              height: 0.5,
              marginHorizontal: 25,
              backgroundColor: "#CCCCCC",
            }} />
          }}
          renderItem={({ item }) => <Villages stick={item} user={item} />}
        />
      )}
    </View>
  )
}

export default VillageList
