import { TouchableOpacity, Text, StyleSheet } from "react-native"

const LogOutButton = (): JSX.Element => {
  return (
    <TouchableOpacity>
      <Text style={styles.logOutText}>log out</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  logOutText: {
    fontSize: 12,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.7)'
  }
})

export default LogOutButton
