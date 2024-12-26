import { TouchableOpacity, Text, StyleSheet } from "react-native"
//import { signOut } from "firebase/auth"
import { router } from "expo-router"

interface Props {
  month: string
}



const ToCalendarButton = (props: Props): JSX.Element => {
  const { month } = props
  const handlePress = (props: Props): void => {
    const { month } = props
      router.replace(`/diary/calendar?month=${month}`)

  }
  return (
    <TouchableOpacity onPress={() => handlePress({month})}>
      <Text style={styles.logOutText}>To Calendar</Text>
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

export default ToCalendarButton
