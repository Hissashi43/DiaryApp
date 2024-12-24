import {
  View, Text, Image, TextInput, Button, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView, Alert
} from 'react-native'
//import { getStorage, ref} from 'firebase/storage'
import { Entypo } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useSearchParams } from 'expo-router/build/hooks'
import { doc, addDoc, getDoc, collection, Timestamp } from 'firebase/firestore'
import { db, auth } from '../../config'
import { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker'

import CircleButton from '../../components/CircleButton'
import FetchFirstImageId from '../../components/FetchFirstImageId'
import MonthColors from '../../components/MonthColors'
import DeleteImage from '../../components/DeleteImage'
import UploadFileAsBlob from '../../components/UploadFileAsBlob'
import ResizeImage from '../../components/ResizeImage'

const confirmDelete = (): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert(
      "画像削除",
      "前に保存していた画像はアプリから削除されます。よろしいですか？",
      [
        { text: "キャンセル", style: "cancel", onPress: () => resolve(false) },
        { text: "削除", onPress: () => resolve(true) }
      ]
    )
  })
}

const handlePress = async (
  date: string, dateDirectory: string, bodyText: string,
  imageUri: string | null, imageId: string | null, changeImage: boolean
): Promise<void> => {
  if (auth.currentUser === null) { return }

  //const storage = getStorage()
  const userUid = auth.currentUser.uid
  if (changeImage) {
    const confirm = await confirmDelete()
    if (confirm) {
      try {
        await DeleteImage(userUid, dateDirectory, imageId)
        console.log("前の画像を削除しました")
      } catch (error) {
        console.error("画像削除エラー", error)
        return
      }
    } else {
      console.log("画像削除をキャンセルしました")
      return
    }
  }

  try {
    const docRef = await addDoc(
      collection(db, `users/${userUid}/diary/${dateDirectory}/diarytext`),
      {
        bodyText,
        updatedAt: Timestamp.fromDate(new Date())
      }
    )
    console.log('success save text', docRef.id)

    if (imageUri) {
      //const imageRef = ref(storage, `users/${userUid}/diary/${dateDirectory}/diaryimage/${Date.now()}.jpg`)
      //console.log("Storage Reference Path:", imageRef.fullPath)
      const compressedImageUri = await ResizeImage(imageUri)
      await UploadFileAsBlob(dateDirectory, compressedImageUri)
      console.log("画像URL保存成功")
    }

    router.replace(`diary/diary?date=${date}&id=${docRef.id}`)
    console.log('diary画面に遷移')
  } catch (error) {
      console.log('画像保存時のエラー: ', error)
  }
}

const Edit = (): JSX.Element => {
  const searchParams = useSearchParams()
  const date = String(searchParams.get('date'))
  const id = String(searchParams.get('id'))
  const [year, month, day] = date.split('-')
  const dateDirectory = date?.replace('-', '').replace('-', '')
  const [bodyText, setBodyText] = useState('')
  const [loading, setLoading] = useState(true)
  const currentBackgroundColor = MonthColors[month] || '#000000'
  const [image, setImage] = useState<string | null>(null)
  //const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageId, setImageId] = useState<string | null>(null)
  const [changeImage, setChangeImage] = useState(false)
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
        const newImage = result.assets[0].uri
        setImage(newImage)
      } else {
        //console.log('Image picker was canceled')
      }
    } catch (error) {
      console.error('Error picking image:', error)
    }
  }
  const removeImage = () => {
    setImage(null)
    const imageState = true
    setChangeImage(imageState)
  }

  useEffect(() => {
    const flagment = [0, 0]
    const userUid = auth.currentUser?.uid
    const fetchDiaryData = async () => {
      if (!auth.currentUser || !date || !id) {
        console.log('no diary-text data')
        setBodyText('')
        setLoading(false)
        return
      }

      try {
        const diaryRef = doc(db, `users/${userUid}/diary/${dateDirectory}/diarytext/${id}`)
        const diarySnap = await getDoc(diaryRef)

        if (diarySnap.exists()) {
          console.log('doc found')
          const RemoteBodyText = diarySnap?.data()?.bodyText
          setBodyText(RemoteBodyText)
          flagment[0] = 1
        } else {
          console.log('doc not fount')

        }
      } catch (error) {
        console.error('Error fetching diary:', error)
        setBodyText('')
      } finally {
        setLoading(false)
      }
    }
    const fetchData = async () => {
      try {
        if (!userUid) return
        const imageInfo = await FetchFirstImageId(userUid, dateDirectory)

        // eslint-disable-next-line no-constant-binary-expression
        if (imageInfo) {
          console.log('image found')
          setImageId(imageInfo.imageId)
          setImage(imageInfo.imageUrl)
          flagment[1] = 1
        } else {
          console.log('image not fount')
        }
      } catch (error) {
        console.error('Error fetching diary image:', error)
        setImage(null)
      } finally {
        setLoading(false)
      }
      if (flagment.reduce((sum, current) => sum + current, 0) < 1) {
        console.log("画像、テキストなし")
        router.push(`diary/create?date=${date}`)
      }
    }
    fetchDiaryData()
    fetchData()
  }, [date, id])



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BF5D5D" />
        <Text>読み込み中...</Text>
      </View>
    )
  }


  const formattedDate = date
    ? new Date(date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
    : 'unknown date'
  return (
    <View style={styles.container}>


      <View style={[styles.monthTitle, { backgroundColor: currentBackgroundColor }]}>
        <Text style={styles.monthText}>
          {date ? `${month}月` : 'unknown date'}
        </Text>
      </View>

      <View style={styles.date}>
        <Text style={styles.dateText}>{formattedDate}</Text>
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

      <ScrollView style={styles.diaryContent}>
        <TextInput
          multiline
          style={styles.diaryContentText}
          value={bodyText}
          onChangeText={(text) => { setBodyText(text) }}
          autoFocus
        />
      </ScrollView>

      <CircleButton>
        <Entypo name='check' onPress={() => {
          handlePress(date, dateDirectory, bodyText, image, imageId, changeImage)}} size={28}
        />
      </CircleButton>

    </View>

  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageWrapper: {
    position: 'relative',
    width: 360,
    height: 240// 相対位置を設定して×ボタンの位置を調整
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
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
  diaryContent: {
    //alignItems: 'center',
    marginRight: 17,
    marginLeft: 17
  },
  diaryContentText: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'left'
  }

})

export default Edit
