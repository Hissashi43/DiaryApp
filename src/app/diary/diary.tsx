import { View, Text, Image, StyleSheet } from 'react-native'

import Header from '../../components/Header'
import CircleButton from '../../components/CircleButton'

const Diary = (): JSX.Element => {
  return (
    <View style={styles.container}>

      <Header />

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

      <View style={styles.diaryContent}>
        <Text style={styles.diaryContentText}>山梨県の富士五胡の一つ、河口湖から富士山を見た。ちょうど紅葉真っ只中でなかなかのいい景色が取れた。なおこの場所はかなり有名らしく、写真を撮ろうと多くの人がごった返しており人が映らないような場所とタイミングを見極めるのにかなり苦労した</Text>
      </View>

      <CircleButton>+</CircleButton>

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
  diaryContent: {
    alignItems: 'center',
    marginRight: 17,
    marginLeft: 17
  },
  diaryContentText: {
    fontSize: 18,
    lineHeight: 28
  }

})

export default Diary