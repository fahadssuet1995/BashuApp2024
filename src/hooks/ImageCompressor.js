// import { Image } from 'react-native-compressor';
import * as ImageManipulator from 'expo-image-manipulator';


export const compress = async (image) => {
    const result = await ImageManipulator.manipulateAsync(
        image,
        [{ resize: { width: 640, height: 480 } }],
    );

    return result
}