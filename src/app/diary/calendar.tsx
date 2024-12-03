import React from 'react'
import { View, Image, SafeAreaView, StyleSheet } from 'react-native'
import { Calendar } from 'react-native-calendars'

import Header from '../../components/Header'

const monthlyCalendar = (): JSX.Element => {
  return (

    <View style={styles.container}>

      <Header />

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
          <Calendar style={styles.mCalendar}
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
