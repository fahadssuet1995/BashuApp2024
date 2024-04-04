import { StyleSheet } from 'react-native';
import Colors from '../../../constants/Colors';

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.light.tint,
        position: "absolute",
        bottom: 20,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        width: 130,
        height: 45,
        flexDirection: "row",
        right: 20
    },
    start_flow: {
        color: "white",
        fontWeight: "bold"
    }
})

export default styles;