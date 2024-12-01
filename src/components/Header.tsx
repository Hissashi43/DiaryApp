import { View, Text, StyleSheet } from 'react-native'

const Header = (): JSX.Element => {
  return (
    <View style={styles.header}>
    <View style={styles.headerInner}>
      <Text style={styles.headerLeft}>戻る</Text>
      <Text style={styles.headerTitle}>Diary App</Text>
      <Text style={styles.headerRight}>ログアウト</Text>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
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
  }
})

export default Header
