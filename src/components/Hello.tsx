import { View, Text, StyleSheet } from 'react-native'

const Hello = (): JSX.Element => {
  return (
    <View>
      <Text style={styles.text}>Hello</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    color: '#ffffff',
    backgroundColor: 'blue',
    fontSize: 40,
    fontWeight: 'bold',
    padding: 16
  }
})

export default Hello
