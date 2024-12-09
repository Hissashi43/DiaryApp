import React from 'react'
import { View, Image, SafeAreaView, StyleSheet, Text } from 'react-native'
import { Calendar } from 'react-native-calendars'
//import { useRouter } from 'expo-router'



//interface DateObject {
  //dateString: string; // "YYYY-MM-DD" フォーマット
  //day: number;        // 日付
  //month: number;      // 月
  //year: number;       // 年
  //timestamp: number;  // Unixタイムスタンプ（省略可能）
//}
interface Props {
  date: string
  state?: string
}
const monthlyCalendar = (props: Props):JSX.Element => {
  //const router = useRouter()
  const { date, state } = props
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
            dayComponent={({date, state}) => {
              return <View><Text style={{color: 'red'}}>{date.day}</Text></View>}}
            //onPress={handleDayPress}
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
