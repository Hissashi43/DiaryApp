import {
  View, Text, TextInput, Image, StyleSheet, KeyboardAvoidingView
 } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useState } from 'react'
import { router } from 'expo-router'
import { useSearchParams } from 'expo-router/build/hooks'

import CircleButton from '../../components/CircleButton'
import { db, auth } from '../../config'

const handlePress = (bodyText: string): void => {
  if (auth.currentUser === null) { return }
  addDoc(collection(db, `users/${auth.currentUser.uid}/diary`), {
    bodyText, // key doesn't need value if its name is same as key name
    updatedAt: Timestamp.fromDate(new Date())
  })
    .then((docRef) => {
      console.log('success', docRef.id)
      router.back()
    })
    .catch((error) => {
      console.log(error)
    })
}

const Create = (): JSX.Element => {
  const searchParams = useSearchParams()
  const date = searchParams.get('date')
  const [year, month, day] = date.split('-')
  //const formattedDate = date
  //? new Date(date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
  //: '日付不明'
  const [bodyText, setBodyText] = useState('')
  return (
  <KeyboardAvoidingView style={styles.container}>

    <View style={styles.monthTitle}>
      <Text style={styles.monthText}>{month}月</Text>
    </View>

    <View style={styles.date}>
      <Text style={styles.dateText}>{year}年{month}月{day}日</Text>
    </View>

    <View style={styles.imageContainer}>
      <Image
        style={{
        width: 368,
        height: 223
        }}
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      source={require('../../../assets/example-image.png')}/>
    </View>

    <View style={styles.diaryText}>
        <TextInput
          multiline
          style={styles.diaryTextInput}
          value={bodyText}
          placeholder='ここにテキストを記入'
          onChangeText={(text) => { setBodyText(text) }}
        />
    </View>

    <CircleButton>
        <Entypo name='check' onPress={() => {handlePress(bodyText)}} size={28}/>
    </CircleButton>

  </KeyboardAvoidingView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },

  imageContainer: {
    alignItems: 'center',
    marginBottom: 16
  },
  monthTitle: {
    backgroundColor: '#BF5D5D',
    height: 51,
    width: 368,
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 17,
    marginRight: 17,
    alignItems: 'center'
  },
  monthText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    justifyContent: 'flex-end',
    marginBottom: 8
  },
  date: {
    marginLeft: 18
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  diaryText: {
    borderWidth: 1,
    marginRight: 17,
    marginLeft: 17
  },
  diaryTextInput: {
    fontSize: 18,
    textAlignVertical: 'top'
  }
})
export default Create
