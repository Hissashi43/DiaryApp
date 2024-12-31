import { TouchableOpacity, Text, StyleSheet } from "react-native"
//import { signOut } from "firebase/auth"
import { router } from "expo-router"

interface Props {
  month: string
  year: string
}



const ToCalendarButton = (props: Props): JSX.Element => {
  const { month, year } = props
  const handlePress = (): void => {
    console.log(`${year}年${month}月画面のカレンダーに遷移`)
    router.replace(`/diary/calendar?month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}`)

  }
  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.logOutText}>Calendar Page</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  logOutText: {
    fontSize: 12,
    lineHeight: 24,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.7)'
  }
})

export default ToCalendarButton
