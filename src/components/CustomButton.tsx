import { TouchableOpacity, Text, StyleSheet } from 'react-native'

const CustomButton = ({ title, onPress, backgroundColor, color }: {
  title: string;
  onPress: () => void;
  backgroundColor: string;
  color: string
}) => {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor }]} onPress={onPress}>
      <Text style={[styles.buttonText, { color }]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 5
  },
  buttonText: {
    color: '#000000', // ボタンテキストの色
    textAlign: 'center',
    fontSize: 24
  }
})

export default CustomButton
