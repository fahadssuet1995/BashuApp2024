import React, { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { FlatGrid } from "react-native-super-grid";
import CalabashItem from "./Item";
import { useFocusEffect } from "@react-navigation/native";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { database } from "../../../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { setDataCalabash } from "../../../redux/features/data";
import { selectUser } from "../../../redux/features/user";


const Calabash = ({ user }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let unsub;
  const dispatch = useDispatch()
  const userdata = useSelector(selectUser)
  const userId = user.uid ? user.uid : user.id
  
  // get calabashes
  const getCalabash = async () => {
    const userId = user.uid ? user.uid : user.id
    const collRef = query(collection(database, `calabash`), where('user', '==', userId)
      , orderBy('date', 'asc'))

    unsub = onSnapshot(collRef, snp => {
      const result = snp.docs.map(doc => {
        const id = doc.id
        const data = doc.data()
        return { id, ...data }
      })

      // sorting data in the array
      result.sort((a, b) => {
        let keyA = new Date(a.date), keyB = new Date(b.date)
        // Compare the 2 dates
        if (keyA < keyB) return 1
        if (keyA > keyB) return -1
        return 0
      })

      dispatch(setDataCalabash(result))
      setData(result)
      setIsLoading(false)
    })
  };

  // listend to react navigation native hooks
  useFocusEffect(
    React.useCallback(() => {
      getCalabash()
      if (data.length === 0) {
        setTimeout(() => {
        }, 2500)
      }
      return () => {
        // removing listeners
        if (unsub) unsub()
      }
    }, [])
  )

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size={"small"} color={"red"} />
      ) : (
        <FlatGrid
          itemDimension={130}
          data={data}
          renderItem={({ item, index}) => (
            <CalabashItem item={item} index={index}/>
          )}
        />
      )}

      {data.length === 0 && <>
        {userdata.uid === userId ?
          <Text style={{ textAlign: 'center', marginVertical: 20 }}>There is no picture in this calabash, start adding now.</Text>
          :
          <Text style={{ textAlign: 'center', marginVertical: 20 }}>
            This user has no pictures in their Calabash.
          </Text>
        }
      </>
      }
    </View>
  )
};

export default Calabash