import { View, Text, Image, StyleSheet } from 'react-native'

const Index = (): JSX.Element => {
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Text style={styles.headerLeft}>戻る</Text>
          <Text style={styles.headerTitle}>Diary App</Text>
          <Text style={styles.headerRight}>ログアウト</Text>
        </View>
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
          source={require('../../assets/example-image.png')}/>
      </View>

      <View style={styles.diaryContent}>
        <Text style={styles.diaryContentText}>山梨県の富士五胡の一つ、河口湖から富士山を見た。ちょうど紅葉真っ只中でなかなかのいい景色が取れた。なおこの場所はかなり有名らしく、写真を撮ろうと多くの人がごった返しており人が映らないような場所とタイミングを見極めるのにかなり苦労した</Text>
      </View>

      <View style={styles.circleButton}>
          <Text style={styles.circleButtonLabel}>+</Text>
      </View>
    </View>

  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  header: {
    backgroundColor: '#55E42E',
    height: 104,
    justifyContent: 'flex-end'
  },
  headerInner: {
    alignItems: 'center'
  },
  headerRight: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    color: '#ffffff',
    opacity: 0.7
  },
  headerLeft: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    color: '#ffffff',
    opacity: 0.7
  },
  headerTitle: {
    marginBottom: 8,
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 32
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
  },
  circleButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#55E42E',
    position: 'absolute',
    right: 24,
    bottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 8},
    elevation: 8
  },
  circleButtonLabel: {
    color: '#ffffff',
    fontSize: 40,
    lineHeight: 48
  }
})

export default Index
