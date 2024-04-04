import * as RN from 'react-native'
import * as React from 'react'
import { styleNoData } from './NoDataStyle'

const NoData = ({ isOpened, setOpened, message }) => {
    return (
        <>
            <RN.Modal
                visible={isOpened} transparent={true}
                animationType='fade'
            >
                <RN.View style={[styleNoData.modal, styleNoData.modalElevation]} >
                    <RN.Image source={require('../../../../assets/search.png')} style={{
                        height: 300,
                        width: '100%'
                    }} />
                    <RN.Text style={styleNoData.boldHeader}>Information</RN.Text>
                    <RN.Text style={styleNoData.lightHeader}>{message}</RN.Text>
                    <RN.View style={{
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        marginTop: 10
                    }}>
                        <RN.Pressable style={styleNoData.btnClose} onPress={() => setOpened(!isOpened)}>
                            <RN.Text style={{ color: 'white', textAlign: 'center', fontSize: 18, marginLeft: 5 }}>Close</RN.Text>
                        </RN.Pressable>
                        {/* <RN.Pressable style={[styleNoData.btn]} onPress={() => action('throwstick')}>
                            <FontAwesome5 name='plus' size={20} color='#fff' />
                            <RN.Text style={{ fontSize: 14, marginLeft: 5, color: "#fff" }}>Throw stick</RN.Text>
                        </RN.Pressable> */}
                    </RN.View>
                </RN.View>
            </RN.Modal>
        </>
    )
}


export default NoData

