import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import Constants from 'expo-constants';


//  sending push notifications using expo
export const sendPushNotification = async (data) => {
    try {
        const message = {
            to: data.to,
            sound: 'default',
            title: data.content.title,
            body: data.content.body,
            data: data.content.data
        }

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        })
    } catch (error) { }
}


// this method is to schedule a notification for 
export const scheduleNotification = async (data) => {
    const date = new Date()

    date.setDate(data.trigger.date.day)
    date.setMonth(data.trigger.date.month)
    date.setFullYear(data.trigger.date.year)
    date.setHours(data.trigger.hour)
    date.setMinutes(data.trigger.minute)
    date.setSeconds(0)

    const budge = await Notifications.getBadgeCountAsync()

    await Notifications.scheduleNotificationAsync({
        content: {
            sound: 'default',
            title: data.content.title,
            body: data.content.body,
            data: data.content.data,
        },
        trigger: date

    }).then(async () => {
        await Notifications.setBadgeCountAsync(budge + 1)
    })
}


// this method is to schedule a notification for 
export const showNotification = async (data) => {
    const date = new Date()
    const budge = await Notifications.getBadgeCountAsync()

    await Notifications.scheduleNotificationAsync({
        content: {
            sound: 'default',
            title: data.content.title,
            body: data.content.body,
            data: data.content.data,
            badge: budge + 1,
        },
        trigger: {
            hour: date.getHours(),
            minute: date.getMinutes() + 1,
            repeats: false
        }
    }).then(async () => {
        await Notifications.setBadgeCountAsync(budge + 1)
    })

}

// retister for push notifications
export const registerForPushNotifications = async () => {
    let token

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
    }
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!')
        return
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig.extra.eas.projectId })).data


    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        })
    }

    return token
}