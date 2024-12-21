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
import * as FileSystem from 'expo-file-system'
import * as ImageManipulator from 'expo-image-manipulator'


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

  const uploadFileToStorage = async (imageRef: any, binaryData: Uint8Array): Promise<string> => {

    return await new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(imageRef, binaryData)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
          console.log("Bytes transferred:", snapshot.bytesTransferred)
          console.log("Total bytes:", snapshot.totalBytes)
          console.log("State:", snapshot.state)
        },
        (error) => {
          console.error("アップロード中のエラー:", error)
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(imageRef)
            console.log("画像アップロード成功:", downloadUrl)
            resolve(downloadUrl)
          } catch (error) {
            console.error("ダウンロードURL取得エラー:", error)
            reject(error)
          }
        }
      )
    })
  }

  const uploadFileAsBlob = async (imageUri: string): Promise<string> => {
    const storage = getStorage()
    const userUid = auth.currentUser?.uid || "default_user"
    const dateDirectory = "20240702" // サンプル値を使用
    const fileName = `${Date.now()}.jpg`
    const imageRef = ref(storage, `users/${userUid}/diary/${dateDirectory}/diaryimage/${fileName}`)

    try {
      // ローカルファイルを取得し、Blob に変換
      const response = await fetch(imageUri)
      const blob = await response.blob()
      console.log("Blob 変換成功:", blob)

      // Blob を使用してアップロード
      const uploadTask = uploadBytesResumable(imageRef, blob)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
        },
        (error) => {
          console.error("アップロード中のエラー:", error)
        },
        async () => {
          try {
            // アップロード完了後に URL を取得
            const imageUrl = await getDownloadURL(imageRef)
            console.log("画像アップロード成功:", imageUrl)
            await addDoc(
              collection(db, `users/${userUid}/diary/${dateDirectory}/diaryimage`),
              {
                imageUrl, // `undefined` ではないことを確認
                updatedAt: Timestamp.fromDate(new Date())
              }
            )

            console.log("画像URL Firestore 保存成功")
          } catch (error) {
          console.error("Firestore 保存エラー:", error)
          }

        }
      )
    } catch (error) {
      console.error("Blob アップロードエラー:", error)
      throw error
    }
  }

  const resizeImage = async (imageUri: string): Promise<string> => {
    const manipResult = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 400, height: 300 } }], // リサイズ指定
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // 圧縮とフォーマット
    )
    return manipResult.uri
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
            // ローカルファイルの読み込み
      console.log("Storage Reference Path:", imageRef.fullPath)
      const compressedImageUri = await resizeImage(imageUri)
      //console.log("バイナリデータ:", binaryData)
      //const response = await fetch(imageUri)

      await uploadFileAsBlob(compressedImageUri)

        console.log("画像URL保存成功")
      }
      router.replace(`diary/diary?date=${date}&id=${docRef.id}`)
    } catch (error) {
        console.log(error)
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
