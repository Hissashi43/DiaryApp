import { View, Text, TextInput, Image, StyleSheet } from 'react-native'
import { Entypo } from '@expo/vector-icons'

import Header from '../../components/Header'
import CircleButton from '../../components/CircleButton'

const Edit = (): JSX.Element => {
  return (
  <View style={styles.container}>
    <View>
      <Header />
    </View>

    <View style={styles.monthTitle}>
      <Text style={styles.monthText}>10月</Text>
    </View>

    <View style={styles.date}>
      <Text style={styles.dateText}>10月24日（金）</Text>
    </View>

    <View style={styles.imageContainer}>
      <Image
        style={{
        width: 368,
        height: 223
        }}
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      source={require('../../../assets/example-image.png')}/>
    </View>

    <View style={styles.diaryText}>
        <TextInput multiline style={styles.diaryTextInput} value={'日記\nです'}/>
    </View>

    <CircleButton>
        <Entypo name='check' size={28}/>
    </CircleButton>

  </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },

  imageContainer: {
    alignItems: 'center'
  },
  monthTitle: {
    backgroundColor: '#BF5D5D',
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
  date: {
    marginLeft: 18
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  diaryText: {
    marginRight: 17,
    marginLeft: 17
  },
  diaryTextInput: {
    fontSize: 18,
    textAlignVertical: 'top'
  }
})
export default Edit
