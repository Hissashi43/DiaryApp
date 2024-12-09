import { View, Text, StyleSheet } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { useEffect } from 'react'

import RectangularButton from '../../components/RectangularButton'
import LogOutButton from '../../components/LogOutButton'
/*import CircleButton from '../../components/CircleButton'*/

const handlePress = (): void => {
  router.push('/diary/calendar')
}

const annualCalendar = (): JSX.Element => {
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <LogOutButton/> }
    })
  }, [])

  return (
    <View style={styles.container}>


      <View style={styles.year}>
        <Text style={styles.yearText}>2024</Text>

      </View>
      <View style={styles.monthButtons}>
        <View style={styles.JanuaryButton}>
          <RectangularButton onPress={handlePress} backgroundColor='#FF2222'>1月</RectangularButton>
        </View>

        <View style={styles.FebruaryButton}>
          <RectangularButton onPress={handlePress}  backgroundColor='#5CA1DD'>2月</RectangularButton>
        </View>

        <View style={styles.MarchButton}>
          <RectangularButton onPress={handlePress}  backgroundColor='#F893E2'>3月</RectangularButton>
        </View>

        <View style={styles.AprilButton}>
          <RectangularButton onPress={handlePress}  backgroundColor='#64DA51'>4月</RectangularButton>
        </View>

        <View style={styles.MayButton}>
          <RectangularButton onPress={handlePress}  backgroundColor='#67C09F'>5月</RectangularButton>
        </View>

        <View style={styles.JuneButton}>
          <RectangularButton onPress={handlePress}  backgroundColor='#B47BDA'>6月</RectangularButton>
        </View>

        <View style={styles.JulyButton}>
          <RectangularButton onPress={handlePress}  backgroundColor='#49D1E1'>7月</RectangularButton>
        </View>

        <View style={styles.AugustButton}>
          <RectangularButton onPress={handlePress}  backgroundColor='#E58027'>8月</RectangularButton>
        </View>

        <View style={styles.SeptemberButton}>
          <RectangularButton onPress={handlePress}  backgroundColor='#3DC02E'>9月</RectangularButton>
        </View>

        <View style={styles.OctoberButton}>
          <RectangularButton onPress={handlePress}  backgroundColor='#E1C84A'>10月</RectangularButton>
        </View>

        <View style={styles.NovemberButton}>
          <RectangularButton onPress={handlePress}  backgroundColor='#BF5D5D'>11月</RectangularButton>
        </View>

        <View style={styles.DecemberButton}>
          <RectangularButton onPress={handlePress}  backgroundColor='#4F69BF'>12月</RectangularButton>
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
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8
  },
  yearText: {
    fontSize: 32,
    marginBottom: 2,
    color: '#000000'
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
