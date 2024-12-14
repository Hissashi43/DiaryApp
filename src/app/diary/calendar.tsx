import React from 'react'
import { View, Image, SafeAreaView, StyleSheet, Text } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { router } from 'expo-router'
import { doc, getDoc } from 'firebase/firestore'
import { db, auth } from '../../config'

const handleDayPress = async (day: { dateString: string }) => {
  if (!auth.currentUser) {
    console.log('User us not logged in')
    return
  }
  const diaryRef = doc(db, `users/${auth.currentUser.uid}/diary/${day.dateString}`)
  const diarySnap = await getDoc(diaryRef)

  if (diarySnap.exists()) {
    console.log('Navigating to diary:', day.dateString)
    router.push(`/diary/diary?date=${day.dateString}`) // 修正: 動的なルートを指定
  } else {
    console.log('Navigating to create:', day.dateString)
    router.push(`/diary/create?date=${day.dateString}`)
  }
}

//interface DateObject {
  //dateString: string; // "YYYY-MM-DD" フォーマット
  //day: number;        // 日付
  //month: number;      // 月
  //year: number;       // 年
  //timestamp: number;  // Unixタイムスタンプ（省略可能）
//}
/*interface Props {
  date: string
  state?: string
}*/
const monthlyCalendar = ():JSX.Element => {
  //const router = useRouter()
  //const { date, state } = props
  //const handleDayPress = (day: DateObject) => {
    //router.push('/diary?date=${day.dateString}')
  //}
  return (

    <View style={styles.container}>

      <View style={styles.imageContainer}>
        <Image
          style={{
            width: 368,
            height: 223
          }}
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('../../../assets/example-image.png')}/>
      </View>

      <SafeAreaView style={styles.calendarContainer}>
        <View style={styles.centeredCalendar}>
          <Calendar
            style={styles.mCalendar}
            onDayPress={handleDayPress}
          />
        </View>
      </SafeAreaView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 16
  },
  calendarContainer: {
    flex: 1
  },
  centeredCalendar: {
    alignItems: 'center'
  },
  mCalendar: {
    width: 368,
    height: 320
  }
})

export default monthlyCalendar
