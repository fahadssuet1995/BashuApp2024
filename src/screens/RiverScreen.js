import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RiverFeed from '../components/RiverFeed';
import NewRiverButton from '../components/RiverFeed/NewRiverButton';

export default function RiverScreen() {
    return(
        <View style={{ width:"100%", backgroundColor:"white" }}>
            <RiverFeed />
            <NewRiverButton/>
        </View>
    )
}
