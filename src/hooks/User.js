import { getDocs } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';
import { database } from '../config/firebase'

export const likeStickUser = (stick, user)=> {
    // checking if the user has already rate the driver/user
    return getDocs(query(collection(database, `sticks/${stick}/likes`), where('uid', '==', user)))
        .then(res => {
            if (!res.empty) return res
            return false
        })
}

export const likeUserCalabash = (calabash, user) => {
    // checking if the user has already rate the driver/user
    return getDocs(query(collection(database, `calabash/${calabash}/likes`), where('uid', '==', user)))
        .then(res => {
            if (!res.empty) return res
            return false
        })
}