import React, { useState } from 'react'
import { View, Image, SafeAreaView, StyleSheet, Text } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { router } from 'expo-router'
import { collection, getDocs } from 'firebase/firestore'
import { db, auth } from '../../config'
import { useSearchParams } from 'expo-router/build/hooks'

import MonthColors from '../../components/MonthColors'

const handleDayPress = async (day: { dateString: string }) => {
  if (!auth.currentUser) {
    console.log('User us not logged in')
    return
  }
  const dateDirectory = day.dateString.replace('-', '').replace('-', '')
  const diaryRef = collection(db, `users/${auth.currentUser.uid}/diary/${dateDirectory}/diarytext`)
  const querySnapshot = await getDocs(diaryRef)

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0]
    const docId = doc.id
    console.log('Navigating to diary:', day.dateString)
    router.push(`/diary/diary?date=${day.dateString}&id=${docId}`) // 修正: 動的なルートを指定
  } else {
    console.log('Navigating to create:', day.dateString)
    router.push(`/diary/create?date=${day.dateString}`)
  }
}


const monthlyCalendar = ():JSX.Element => {
  const searchParams = useSearchParams()
  const month = String(searchParams.get('month'))
  const [currentMonth, setCurrentMonth] = useState(month || new Date().getMonth() + 1)
  const initColor = month && MonthColors[month] ? MonthColors[month] : '#FFFFFF'
  const currentBackgroundColor = MonthColors[currentMonth] || initColor
  return (

    <View style={styles.container}>

      <View style={styles.imageContainer}>
        <Image
          style={{
            width: 368,
            height: 223
          }}
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('../../../assets/example-image.png')} />
      </View>

      <View style={[styles.monthTitle, { backgroundColor: currentBackgroundColor }]}>
        <Text style={styles.monthText}>
          {currentMonth}月
        </Text>
      </View>

      <SafeAreaView style={styles.calendarContainer}>
        <View style={styles.centeredCalendar}>
          <Calendar
            onMonthChange={(month) => {
              console.log('表示中の月: ', month)
              setCurrentMonth(month.month.toString()) // 月を2桁形式で保存)
            }}
            current={`2024-${currentMonth}-01`}
            style={styles.mCalendar}
            onDayPress={handleDayPress} />
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
  monthTitle: {
    height: 51,
    width: 368,
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 17,
    marginRight: 17,
    alignItems: 'center'
  },
  monthText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    justifyContent: 'flex-end',
    marginBottom: 8
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
