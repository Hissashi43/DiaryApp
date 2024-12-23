import {
  View, Text, TextInput, Image, Button, StyleSheet, KeyboardAvoidingView,
  TouchableOpacity
 } from 'react-native'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { Entypo } from '@expo/vector-icons'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useState } from 'react'
import { router } from 'expo-router'
import { useSearchParams } from 'expo-router/build/hooks'
import * as ImagePicker from 'expo-image-picker'
//import * as FileSystem from 'expo-file-system'
//import * as ImageManipulator from 'expo-image-manipulator'


import CircleButton from '../../components/CircleButton'
import UploadFileAsBlob from '../../components/UploadFileAsBlob'
import MonthColors from '../../components/MonthColors'
import ResizeImage from '../../components/ResizeImage'
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
  const date = String(searchParams.get('date'))
  const [year, month, day] = date.split('-')
  const dateDirectory = date.replace('-', '').replace('-', '')
  const currentBackgroundColor = MonthColors[month] || '#000000'
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
      })

      console.log('Image picker result:', result)

      if (!result.canceled) {
        //console.log('Selected image URI:', result.assets[0].uri)
        setImage(result.assets[0].uri)
      } else {
        //console.log('Image picker was canceled')
      }
    } catch (error) {
      console.error('Error picking image:', error)
    }
  }

  const handlePress = async (bodyText: string, imageUri: string | null): Promise<void> => {
    if (auth.currentUser === null) { return }

    const storage = getStorage()
    const userUid = auth.currentUser.uid


    try {
      const docRef = await addDoc(
        collection(db, `users/${userUid}/diary/${dateDirectory}/diarytext`),
        {
          bodyText,
          updatedAt: Timestamp.fromDate(new Date())
        }
      )

      console.log('success save text', docRef.id)
      console.log("Image URI: ", imageUri)
      if (imageUri) {
        const imageRef = ref(storage, `users/${userUid}/diary/${dateDirectory}/diaryimage/${Date.now()}.jpg`)
        console.log("Storage Reference Path:", imageRef.fullPath)
        const compressedImageUri = await ResizeImage(imageUri)
        //console.log("バイナリデータ:", binaryData)
        //const response = await fetch(imageUri)

        await UploadFileAsBlob(dateDirectory, compressedImageUri)
        console.log("画像URL保存成功")
      }
      router.replace(`diary/diary?date=${date}&id=${docRef.id}`)
      console.log('diary画面に遷移')
    } catch (error) {
        console.log('画像保存時のエラー: ', error)
    }

  }

  const removeImage = () => {
    setImage(null)
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

    <View style={styles.imageContainer}>
      {/* 画像が選択されていない場合のみボタンを表示 */}
      {!image && (
      <Button title="画像を選択する" onPress={pickImage} />
      )}

      {/* 画像が選択された場合は画像を表示 */}
      {image && (
        <View style={styles.imageWrapper}>
          <Image source={{ uri: image }} style={{ width: 360, height: 240 }} />
          <TouchableOpacity style={styles.closeButton} onPress={removeImage}>
            <Text style={styles.closeButtonText}>x</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>

    <View style={styles.date}>
      <Text style={styles.dateText}>{year}年{month}月{day}日</Text>
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
        <Entypo name='check' onPress={() => {handlePress(bodyText, image)}} size={28}/>
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
  imageWrapper: {
    position: 'relative' // 相対位置を設定して×ボタンの位置を調整
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: 16,
    width: 368,
    height: 223
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    lineHeight: 20
  },
  monthTitle: {
    backgroundColor: '#BF5D5D',
    height: 51,
    width: 368,
    marginBottom: 16,
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
    height: 320,
    width: 368
  },
  diaryTextInput: {
    fontSize: 18,
    textAlignVertical: 'top'
  }
})
export default Create
