import {
  View, Text, TextInput, Image, Button, StyleSheet, KeyboardAvoidingView
 } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useState } from 'react'
import { router } from 'expo-router'
import { useSearchParams } from 'expo-router/build/hooks'
import * as ImagePicker from 'expo-image-picker'

import CircleButton from '../../components/CircleButton'
import { db, auth } from '../../config'

/*const handlePress = (bodyText: string): void => {
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
}*/

const Create = (): JSX.Element => {
  const searchParams = useSearchParams()
  const date = searchParams.get('date')
  const [year, month, day] = date.split('-')
  const dateDirectory = date?.replace('-', '').replace('-', '')
  const monthColors: { [key: string]: string } = {
    '01': '#F65E5E', // 1月: 明るい赤
    '02': '#5CA1DD', // 2月: 明るい青
    '03': '#F893E2', // 3月: 明るいピンク
    '04': '#64DA51', // 4月: 明るい緑
    '05': '#67C09F', // 5月: 明るいシアン
    '06': '#B47BDA', // 6月: 明るい紫
    '07': '#49D1E1', // 7月: 明るい空色
    '08': '#E58027', // 8月: 明るいオレンジ
    '09': '#3DC02E', // 9月: 明るいライム
    '10': '#E1C84A', // 10月: 明るい黄色
    '11': '#BF5D5D', // 11月: 明るいローズ
    '12': '#4F69BF' // 12月: 明るい青紫
  }
  const currentBackgroundColor = monthColors[month] || '#000000'
  const [image, setImage] = useState<string | null>(null)
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      console.log('Permission result:', permissionResult)
      if (!permissionResult.granted) {
        alert('画像選択のためにカメラロールへのアクセス許可が必要です')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1
      });

      console.log('Image picker result:', result)

      if (!result.canceled) {
        console.log('Selected image URI:', result.assets[0].uri)
        setImage(result.assets[0].uri)
      } else {
        console.log('Image picker was canceled')
      }
    } catch (error) {
      console.error('Error picking image:', error)
    }
  }

  const handlePress = (bodyText: string): void => {
    if (auth.currentUser === null) { return }

    addDoc(collection(db, `users/${auth.currentUser.uid}/diary/${dateDirectory}/diarytext`), {
      bodyText, // key doesn't need value if its name is same as key name
      updatedAt: Timestamp.fromDate(new Date())
    })
      .then((docRef) => {
        console.log('success', date, docRef.id)
        router.replace(`diary/diary?date=${date}&id=${docRef.id}`)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  //const formattedDate = date
  //? new Date(date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
  //: '日付不明'
  const [bodyText, setBodyText] = useState('')
  return (
  <KeyboardAvoidingView style={styles.container}>

    <View style={[styles.monthTitle, { backgroundColor: currentBackgroundColor }]}>
      <Text style={styles.monthText}>{month}月</Text>
    </View>

    <View style={styles.date}>
      <Text style={styles.dateText}>{year}年{month}月{day}日</Text>
    </View>

    <View style={styles.imageContainer}>
      {/* 画像が選択されていない場合のみボタンを表示 */}
      {!image && <Button title="画像を選択する" onPress={pickImage} />}

      {/* 画像が選択された場合は画像を表示 */}
      {image && <Image source={{ uri: image }} style={{ width: 360, height: 240 }} />}

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
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },

  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
    width: 368,
    height: 223
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
    backgroundColor: '#FAF6F6',
    marginRight: 17,
    marginLeft: 17,
    height: 320
  },
  diaryTextInput: {
    fontSize: 18,
    textAlignVertical: 'top'
  }
})
export default Create
