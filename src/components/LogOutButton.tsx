import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { router } from "expo-router"


const LogOutButton = (): JSX.Element => {
  return (
    <TouchableOpacity onPress={(): void => {router.replace('auth/log_in')}}>
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
