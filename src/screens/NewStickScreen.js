import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { Text, View } from "../components/Themed";

export default function NewStickScreen() {
  const [serverData, setServerData] = useState([]);
  const items = [
    //name key is must.It is to show the text in front
    { id: 1, name: "angellist" },
    { id: 2, name: "codepen" },
    { id: 3, name: "envelope" },
    { id: 4, name: "etsy" },
    { id: 5, name: "facebook" },
    { id: 6, name: "foursquare" },
    { id: 7, name: "github-alt" },
    { id: 8, name: "github" },
    { id: 9, name: "gitlab" },
    { id: 10, name: "instagram" },
  ];

  useEffect(() => {
    fetch("https://aboutreact.herokuapp.com/demosearchables.php")
      .then((response) => response.json())
      .then((responseJson) => {
        //Successful response from the API Call
        setServerData(responseJson.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  
  return (
    <View><Text>Here i am</Text></View>
    // <SafeAreaView style={styles.container}>
    //   <View style={styles.container}>
    //     <Text style={styles.titleText}>
    //       Example of Searchable Dropdown / Picker in React Native
    //     </Text>
    //     <Text style={styles.headingText}>
    //       Searchable Dropdown from Static Array
    //     </Text>
    //     <SearchableDropdown
    //       //On text change listner on the searchable input
    //       onItemSelect={(item: any) => alert(JSON.stringify(item))}
    //       //onItemSelect called after the selection from the dropdown
    //       containerStyle={{ padding: 5 }}
    //       //suggestion container style
    //       textInputStyle={{
    //         //inserted text style
    //         padding: 12,
    //         borderWidth: 1,
    //         borderColor: "#ccc",
    //         backgroundColor: "#FAF7F6",
    //       }}
    //       itemStyle={{
    //         //single dropdown item style
    //         padding: 10,
    //         marginTop: 2,
    //         backgroundColor: "#FAF9F8",
    //         borderColor: "#bbb",
    //         borderWidth: 1,
    //       }}
    //       itemTextStyle={{
    //         //text style of a single dropdown item
    //         color: "#222",
    //       }}
    //       itemsContainerStyle={{
    //         //items container style you can pass maxHeight
    //         //to restrict the items dropdown hieght
    //         maxHeight: "60%",
    //       }}
    //       items={items}
    //       //mapping of item array
    //       defaultIndex={2}
    //       //default selected item index
    //       placeholder="placeholder"
    //       //place holder for the search input
    //       resetValue={false}
    //       //reset textInput Value with true and false state
    //       underlineColorAndroid="transparent"
    //       //To remove the underline from the android input
    //     />
    //     <Text style={styles.headingText}>
    //       Searchable Dropdown from Dynamic Array from Server
    //     </Text>
    //     <SearchableDropdown
    //       onTextChange={(text: any) => console.log(text)}
    //       //On text change listner on the searchable input
    //       onItemSelect={(item: any) => alert(JSON.stringify(item))}
    //       //onItemSelect called after the selection from the dropdown
    //       containerStyle={{ padding: 5 }}
    //       //suggestion container style
    //       textInputStyle={{
    //         //inserted text style
    //         padding: 12,
    //         borderWidth: 1,
    //         borderColor: "#ccc",
    //         backgroundColor: "#FAF7F6",
    //       }}
    //       itemStyle={{
    //         //single dropdown item style
    //         padding: 10,
    //         marginTop: 2,
    //         backgroundColor: "#FAF9F8",
    //         borderColor: "#bbb",
    //         borderWidth: 1,
    //       }}
    //       itemTextStyle={{
    //         //text style of a single dropdown item
    //         color: "#222",
    //       }}
    //       itemsContainerStyle={{
    //         //items container style you can pass maxHeight
    //         //to restrict the items dropdown hieght
    //         maxHeight: "50%",
    //       }}
    //       items={serverData}
    //       //mapping of item array
    //       defaultIndex={2}
    //       //default selected item index
    //       placeholder="placeholder"
    //       //place holder for the search input
    //       resetValue={false}
    //       //reset textInput Value with true and false state
    //       underlineColorAndroid="transparent"
    //       //To remove the underline from the android input
    //     />
    //   </View>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  titleText: {
    padding: 8,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  headingText: {
    padding: 8,
  },
});
