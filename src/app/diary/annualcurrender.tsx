import { View, Text, StyleSheet } from 'react-native'


import Header from '../../components/Header'
import RectangularButton from '../../components/RectangularButton'
/*import CircleButton from '../../components/CircleButton'*/

const annualCurrender = (): JSX.Element => {
  return (
    <View style={styles.container}>

      <Header />

      <View style={styles.year}>
        <Text style={styles.yearText}>2024</Text>

      </View>
      <View style={styles.monthButtons}>
        <View style={styles.JanuaryButton}>
          <RectangularButton>1月</RectangularButton>
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
    backgroundColor: '#000000',
    marginLeft: 22,
    marginRight: 22
  },
  JanuaryButton: {
    position: 'absolute',
    left: 16,
    top: 8
 }

})

export default annualCurrender
