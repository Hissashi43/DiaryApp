import { View, Text, Button, StyleSheet } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'

import RectangularButton from '../../components/RectangularButton'
import LogOutButton from '../../components/LogOutButton'
import CustomButton from '../../components/CustomButton'
/*import CircleButton from '../../components/CircleButton'*/

const handlePress = (year: string, month: string): void => {
  router.push(`/diary/calendar?year=${year}&month=${month}`)
}

const annualCalendar = (): JSX.Element => {
  const currentYear = String(new Date().getFullYear())
  const[year, setYear] = useState(currentYear)
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <LogOutButton /> }
    })
  }, [])

  const changeYear = (offset: number): void => {
    setYear((prevYear) => String(Number(prevYear) + offset))
  }

  return (
    <View style={styles.container}>


      <View style={styles.year}>
        <CustomButton title="<" onPress={() => changeYear(-1)} backgroundColor='#ffffff' color='#8F8F8F' />
        <Text style={styles.yearText}>{year}</Text>
        <CustomButton title=">" onPress={() => changeYear(1)} backgroundColor='#ffffff' color='#8F8F8F'/>

      </View>
      <View style={styles.monthButtons}>
        <View style={styles.JanuaryButton}>
          <RectangularButton onPress={() => handlePress(year, '01')}backgroundColor='#F65E5E'>1月</RectangularButton>
        </View>

        <View style={styles.FebruaryButton}>
          <RectangularButton onPress={() => handlePress(year, '02')}  backgroundColor='#5CA1DD'>2月</RectangularButton>
        </View>

        <View style={styles.MarchButton}>
          <RectangularButton onPress={() => handlePress(year, '03')}  backgroundColor='#F893E2'>3月</RectangularButton>
        </View>

        <View style={styles.AprilButton}>
          <RectangularButton onPress={() => handlePress(year, '04')}  backgroundColor='#64DA51'>4月</RectangularButton>
        </View>

        <View style={styles.MayButton}>
          <RectangularButton onPress={() => handlePress(year, '05')}  backgroundColor='#67C09F'>5月</RectangularButton>
        </View>

        <View style={styles.JuneButton}>
          <RectangularButton onPress={() => handlePress(year, '06')}  backgroundColor='#B47BDA'>6月</RectangularButton>
        </View>

        <View style={styles.JulyButton}>
          <RectangularButton onPress={() => handlePress(year, '07')}  backgroundColor='#49D1E1'>7月</RectangularButton>
        </View>

        <View style={styles.AugustButton}>
          <RectangularButton onPress={() => handlePress(year, '08')}  backgroundColor='#E58027'>8月</RectangularButton>
        </View>

        <View style={styles.SeptemberButton}>
          <RectangularButton onPress={() => handlePress(year, '09')}  backgroundColor='#3DC02E'>9月</RectangularButton>
        </View>

        <View style={styles.OctoberButton}>
          <RectangularButton onPress={() => handlePress(year, '10')}  backgroundColor='#E1C84A'>10月</RectangularButton>
        </View>

        <View style={styles.NovemberButton}>
          <RectangularButton onPress={() => handlePress(year, '11')}  backgroundColor='#BF5D5D'>11月</RectangularButton>
        </View>

        <View style={styles.DecemberButton}>
          <RectangularButton onPress={() => handlePress(year, '12')}  backgroundColor='#4F69BF'>12月</RectangularButton>
        </View>

      </View>
    </View>

  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  year: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 8,
    marginTop: 8
  },
  yearText: {
    fontSize: 36,
    marginBottom: 2,
    fontWeight: 'bold',
    color: '#000000'
  },
  Button: {
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#ffffff'
  },
  monthButtons: {
    alignItems: 'center',
    width: 368,
    height: 540,
    backgroundColor: '#ffffff',
    marginLeft: 22,
    marginRight: 22
  },
  JanuaryButton: {
    position: 'absolute',
    left: 16,
    top: 8
  },
 FebruaryButton: {
  position: 'absolute',
  left: 192,
  top: 8
 },
 MarchButton: {
  position: 'absolute',
  left: 16,
  top: 96
 },
 AprilButton: {
  position: 'absolute',
  left: 192,
  top: 96
 },
 MayButton: {
  position: 'absolute',
  left: 16,
  top: 184
 },
 JuneButton: {
  position: 'absolute',
  left: 192,
  top: 184
 },
 JulyButton: {
  position: 'absolute',
  left: 16,
  top: 272
 },
 AugustButton: {
  position: 'absolute',
  left: 192,
  top: 272
 },
 SeptemberButton: {
  position: 'absolute',
  left: 16,
  top: 360
 },
 OctoberButton: {
  position: 'absolute',
  left: 192,
  top: 360
 },
 NovemberButton: {
  position: 'absolute',
  left: 16,
  top: 448
 },
 DecemberButton: {
  position: 'absolute',
  left: 192,
  top: 448
 }
})

export default annualCalendar
