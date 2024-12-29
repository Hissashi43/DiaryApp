import React, { useState, useEffect } from 'react'
import { View, Image, SafeAreaView, StyleSheet, Text } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { router } from 'expo-router'
import { getFirestore, query, where, collection, getDocs } from 'firebase/firestore'
import { db, auth } from '../../config'
import { useSearchParams } from 'expo-router/build/hooks'

import MonthColors from '../../components/MonthColors'
import FetchMonthlyData from '../../components/FetchMonthlyData'

type CustomStylesType = {
  container?: {
    borderWidth?: number
    borderColor?: string
    borderRadius?: number// 他のスタイルプロパティ
  }
}

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
    console.log()
    router.push(`/diary/diary?date=${day.dateString}&id=${docId}`) // 修正: 動的なルートを指定
  } else {
    console.log('Navigating to create:', day.dateString)
    router.push(`/diary/create?date=${day.dateString}`)
  }
}


const monthlyCalendar = ():JSX.Element => {
  const searchParams = useSearchParams()
  const month = String(searchParams.get('month'))
  const year = '2024'
  const yearMonth: string = year + '-' + month
  const [monthlyData, setMonthlyData] = useState<Record<string, { hasDiary: boolean; hasPhoto: boolean }>>({})
  const [currentMonth, setCurrentMonth] = useState(month || new Date().getMonth() + 1)
  const [currentYearMonth, setCurrentYearMonth] = useState(yearMonth)
  const initColor = month && MonthColors[month] ? MonthColors[month] : '#FFFFFF'
  const currentBackgroundColor = MonthColors[currentMonth] || initColor

  useEffect(() => {
    const fetchData = async () => {
      const data = await FetchMonthlyData(currentYearMonth)
      setMonthlyData(data)
    }

    fetchData()
  }, [currentYearMonth])

  const markedDates = Object.entries(monthlyData).reduce<Record<
  string, { selected: boolean; selectedColor: string; customStyles?: CustomStylesType}>
  >((acc, [date, flags]) => {
    acc[date] = {
      //marked: true, // 点を付ける
      //dotColor: flags.hasPhoto ? "blue" : "transparent", // 写真がある場合は青い点
      selected: flags.hasDiary, // 日記がある場合は選択状態
      selectedColor: flags.hasDiary || flags.hasPhoto ? "lightgreen" : "transparent",
      customStyles: flags.hasDiary && flags.hasPhoto ? {
        container: {
          borderWidth: 2,
          borderColor: '#187D2B',
          borderRadius: 15
        }
      }: {}// 日記がある場合は背景を緑に
    }
    return acc
  }, {})

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
            markedDates={markedDates}
            markingType={"custom"}
            onDayPress={handleDayPress} />
        </View>
      </SafeAreaView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
