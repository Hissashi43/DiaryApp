import React, { useState } from 'react'
import { View, Image, SafeAreaView, StyleSheet, Text } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { router } from 'expo-router'
import { doc, getDoc } from 'firebase/firestore'
import { db, auth } from '../../config'
import { useSearchParams } from 'expo-router/build/hooks'

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


const monthlyCalendar = ():JSX.Element => {
  const [currentMonth, setCurrentMonth] = useState('')
  const searchParams = useSearchParams()
  const month = searchParams.get('month')
  const monthColors: { [key: string]: string } = {
    '1': '#F65E5E', // 1月: 明るい赤
    '2': '#5CA1DD', // 2月: 明るい青
    '3': '#F893E2', // 3月: 明るいピンク
    '4': '#64DA51', // 4月: 明るい緑
    '5': '#67C09F', // 5月: 明るいシアン
    '6': '#B47BDA', // 6月: 明るい紫
    '7': '#49D1E1', // 7月: 明るい空色
    '8': '#E58027', // 8月: 明るいオレンジ
    '9': '#3DC02E', // 9月: 明るいライム
    '10': '#E1C84A', // 10月: 明るい黄色
    '11': '#BF5D5D', // 11月: 明るいローズ
    '12': '#4F69BF' // 12月: 明るい青紫
  }
  const initColor = month && monthColors[month] ? monthColors[month] : '#FFFFFF'
  const currentBackgroundColor = monthColors[currentMonth] || initColor
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
