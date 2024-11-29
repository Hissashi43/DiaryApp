import { View, Text, StyleSheet } from 'react-native'

const Index = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <View>
        <View>
          <Text>Diary App</Text>
          <Text>ログアウト</Text>
        </View>
      </View>

      <View>
        <Text>10月</Text>
      </View>

      <View>
        <Text>10月24日（金）</Text>
      </View>

      <View>
        <Text>Picture</Text>
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
    justifyContent: 'center',
    alignItems: 'center'
  }
})
export default Index
