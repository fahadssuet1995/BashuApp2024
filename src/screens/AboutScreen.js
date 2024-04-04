import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import colors from "../config/colors";

const AboutScreen = () => {
  return (
    <ScrollView style={{ padding: 10, marginHorizontal: 15, marginVertical: 10 }}>
      <Text style={styles.header}>
        ABOUT BASHU? WHAT IS BASHU AND HOW DO I USE IT? {" "}
      </Text>
      <View style={{ height: 30 }} />
      <Text>
        Bashu is a text based social networking platform which allows users to express their views and opinions on specific topics and connect with people of similar interests.{" "}
      </Text>
      <View style={{ height: 30 }} />
      <Text style={styles.heading}>TREE AND FOREST. </Text>
      <View style={{ height: 10 }} />
      <Text>
        <Text style={styles.orderedList}>1.</Text>Bashu consists of a "Tree" 🌴which is your personal profile page and a "Forest" 🌴🏠 which is your account's Home page.
      </Text>
      <View style={{ height: 10 }} />
      <Text>
        <Text style={styles.orderedList}>2.</Text>The tree displays your "STICKS" , your "CALABASH " and your " RIVER".{" "}
      </Text>
      <View style={{ height: 10 }} />
      <Text>
        <Text style={styles.orderedList}>3.</Text>The Forest which is your home page 🌴🏠 contains your STICKS and also displays the sticks of anyone you are watching.

      </Text>
      <View style={{ height: 30 }} />
      <Text style={styles.heading}>WHAT ARE STICKS?</Text>
      <View style={{ height: 10 }} />
      <Text>
        <Text style={styles.orderedList}> 4.</Text>The text posts on Bashu are called sticks. Sticks have a maximum of 500 characters. They have automatic topics which the user needs to select to indicate the specific topic which the stick is based on. 

"Throwing Sticks" is what makes Bashu fun , select any topic and throw your stick limited to 500 characters.  A stick can be your opinion on law, Health, politics or any other topic on Bashu. 

NB‼️Remember, Bashu won't allow you to throw any stick which doesn't have a topic selected 😊. 

Go out and start throwing some sticks, if you're unsure of which topic to select for your first stick, try "General" or "Random" and take it from there, enjoy 😎👍🏿{" "}
      </Text>
      <View style={{ height: 30 }} />
      <Text style={styles.heading}>WHAT IS A CALABASH? </Text>
      <View style={{ height: 10 }} />
      <Text>
        <Text style={styles.orderedList}>5.</Text>Bashu comes with a personal pocket called a calabash which allows you to post pictures in it. 
The pictures will only be visible to users who are watching you and will not be displayed on the home page unless you choose to push them to your home page. If you don’t push them to your Forest, they remain in your personal calabash.{" "}
      </Text>
      <View style={{ height: 30 }} />
      <Text style={styles.heading}>WHAT IS A RIVER? </Text>
      <View style={{ height: 10 }} />
      <Text>
        <Text style={styles.orderedList}>6.</Text>A river is your meeting place for private messaging. It consists of "FLOWS"... which are private messages you can send to other Bashu users who are watching you. Get started and starting flowing with your favorite users 🌊.{" "}
      </Text>
      <View style={{ height: 30 }} />
      <Text style={styles.heading}>GENERAL INFO:</Text>
      <View style={{ height: 10 }} />
      <Text>
        <Text style={styles.orderedList}>7.</Text>Bashu users are called "villagers", you can get access to a villager's sticks if you go on their tree and 'start "watching" them.{" "}
      </Text>
      <View style={{ height: 10 }} />
      <Text>
        <Text style={styles.orderedList}>8.</Text> You can also search any of the topics  on Bashu and start watching the villagers who are throwing sticks about a specific topic you like{" "}
      </Text>
      <View style={{ height: 10 }} />
      <Text style={styles.heading}>ENJOY!</Text>
      <View style={{ height: 10 }} />
      <Text>
        <Text style={styles.orderedList}>10.</Text>GO OUT THERE AND START SHARING YOUR OPINIONS TO THE WORLD, GET STARTED AND THROW SOME STICKS, HAVE FUN 🌟✨!!
      </Text>
      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  heading: {
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    color: colors.primary,
  },
  header: {
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
    textAlign: "center",
    color: colors.primary,
  },
  orderedList: {
    color: colors.primary,
    fontWeight: "bold",
  },
});
