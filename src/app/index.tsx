import { View, Text, Image, StyleSheet } from 'react-native'

const Index = (): JSX.Element => {
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Text style={styles.headerTitle}>Diary App</Text>
          <Text style={styles.headerRight}>ログアウト</Text>
        </View>
      </View>

      <View>
        <Text>10月</Text>
      </View>

      <View>
        <Text>10月24日（金）</Text>
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

      <View>
        <Text>山梨県の富士五胡の一つ、河口湖から富士山を見た。ちょうど紅葉真っ只中でなかなかのいい景色が取れた。なおこの場所はかなり有名らしく、写真を撮ろうと多くの人がごった返しており人が映らないような場所とタイミングを見極めるのにかなり苦労した</Text>
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
  headerTitle: {
    marginBottom: 8,
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 32
  },
  imageContainer: {
    alignItems: 'center'
  }
})

export default Index
