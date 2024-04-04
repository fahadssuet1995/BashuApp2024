import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';

const NewStickButton = () => {
    const navigation= useNavigation();

    const onPress = () => {
        navigation.navigate('NewStick');
    }

    
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={onPress}
        >
            <Ionicons name={"create-outline"} size={30} color={"white"} />
        </TouchableOpacity>
    )
}

export default NewStickButton;