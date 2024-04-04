import { Image, View, Text, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import colors from '../config/colors'


export default function ViewPhotoScreen({ navigation, route } ) {
    const [photo, setPhoto] = useState(null)



    useEffect(() => {
        if (route?.params?.photo) setPhoto(route.params.photo)
    }, [])



    return (
        <View style={{
            flex: 1,
            alignItems: 'center'
        }}>
            {photo && <Image style={{
                width: '95%',
                height: 300,
                borderRadius: 10,
                marginVertical: 10,
            }} source={{ uri: photo }} />}
            <Text style={{textAlign: 'center', fontSize: 20, marginTop: 5}}>{route.params.name}</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 10, alignSelf: 'center', backgroundColor: colors.primary, width: 200, borderRadius: 10, marginTop: 15}}>
                <Text style={{textAlign: 'center', color: 'white'}}>Back</Text>
            </TouchableOpacity>
        </View>
    )
}