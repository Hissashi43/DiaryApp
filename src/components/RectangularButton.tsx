import { View, Text, StyleSheet } from 'react-native'

interface Props {
  children: string
  backgroundColor?: string
}

const RectangularButton = (props: Props):JSX.Element => {
  const { children, backgroundColor } = props
  return (
    <View style={[
      styles.RectangularButton,
      backgroundColor ? { backgroundColor } : {}
      ]}
    >
      <Text style={styles.RectangularButtonLabel}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  RectangularButton: {
    width: 160,
    height: 72,
    borderRadius: 5,
    backgroundColor: '#BF5D5D',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 8},
    elevation: 8
  },
  RectangularButtonLabel: {
    color: '#ffffff',
    fontSize: 24,
    lineHeight: 32,
    position: 'absolute',
    left: 2,
    top:2
  }
})

export default RectangularButton
