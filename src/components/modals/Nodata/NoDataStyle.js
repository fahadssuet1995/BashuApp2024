

import * as RN from 'react-native'
import colors from '../../../config/colors'

const dimen = {
    width: RN.Dimensions.get('window').width,
    height: RN.Dimensions.get('window').height
}

// stylesheet properties
export const styleNoData = RN.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    lightHeader: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 10,
        fontWeight: '500'
    },
    boldHeader: {
        textAlign: 'center',
        fontSize: 25,
        marginBottom: 10,
        fontWeight: '500'
    },
    modal: {
        padding: 20,
        backgroundColor: '#F7F7F7',
        position: 'absolute',
        bottom: dimen.height / 4,
        left: 30,
        right: 30,
        borderRadius: 20
    },
    btnClose: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: colors.danger,
        width: 150,
        alignSelf: 'center',
        borderRadius: 10,
    },
    btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: colors.primary,
        marginVertical: 10,
        width: 150,
        alignSelf: 'center',
        borderRadius: 10,
    },
    textBtn: {

    },
    modalElevation: {
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    }
})
