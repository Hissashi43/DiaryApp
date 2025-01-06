import React, { useState, useEffect } from 'react'
import { View, Image, Button, TouchableOpacity, SafeAreaView, StyleSheet, Text, Alert } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { router } from 'expo-router'
import { collection, getDocs } from 'firebase/firestore'
import { getStorage, ref } from 'firebase/storage'
import { db, auth } from '../../config'
import { useSearchParams } from 'expo-router/build/hooks'
import * as ImagePicker from 'expo-image-picker'

import MonthColors from '../../components/MonthColors'
import FetchMonthlyData from '../../components/FetchMonthlyData'
import UploadCalendarImageAsBlob from '../../components/UploadCalendarImageAsBlob'
import ResizeImage from '../../components/ResizeImage'
import FetchCalendarImageId from '../../components/FetchCalendarImageId'
import DeleteImage from '../../components/DeleteImage'
import FetchFirstImageId from '../../components/FetchFirstImageId'
//import FetchFirstImageId from '../../components/FetchFirstImageId'

const handleDayPress = async (day: { dateString: string }) => {
  if (!auth.currentUser) {
    console.log('User us not logged in')
    return
  }
  const dateDirectory = day.dateString.replace('-', '').replace('-', '')
  const diaryRef = collection(db, `users/${auth.currentUser.uid}/diary/${dateDirectory}/diarytext`)
  const querySnapshot = await getDocs(diaryRef)

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0]
    const docId = doc.id
    console.log('Navigating to diary:', day.dateString)
    console.log()
    router.push(`/diary/diary?date=${day.dateString}&id=${docId}`) // 修正: 動的なルートを指定
  } else {
    console.log('Navigating to create:', day.dateString)
    router.push(`/diary/create?date=${day.dateString}`)
  }
}

const confirmDelete = (): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert(
      "画像削除",
      "画像はアプリから削除されます。よろしいですか？",
      [
        { text: "キャンセル", style: "cancel", onPress: () => resolve(false) },
        { text: "削除", onPress: () => resolve(true) }
      ]
    )
  })
}


const monthlyCalendar = ():JSX.Element => {
  const searchParams = useSearchParams()
  const month = String(searchParams.get('month'))
  const year = String(searchParams.get('year'))
  const yearMonth: string = year + '-' + month
  const [monthlyData, setMonthlyData] = useState<Record<string, { hasDiary: boolean; hasPhoto: boolean }>>({})
  const [currentMonth, setCurrentMonth] = useState(month || new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(year || new Date().getFullYear())
  const [currentYearMonth, setCurrentYearMonth] = useState(yearMonth)
  const initColor = month && MonthColors[month] ? MonthColors[month] : '#FFFFFF'
  const currentBackgroundColor = MonthColors[currentMonth] || initColor
  const [image, setImage] = useState<string | null>(null)
  const pickImage = async () => {
    if (auth.currentUser === null) { return }
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

        const imageUri = result.assets[0].uri
        const storage = getStorage()
        const userUid = auth.currentUser.uid
        //console.log('Selected image URI:', result.assets[0].uri)
        setImage(imageUri)
        if (imageUri) {
          const imageRef = ref(storage, `users/${userUid}/calender/${yearMonth}/monthlyimage/${Date.now()}.jpg`)
          console.log("Storage Reference Path:", imageRef.fullPath)
          const compressedImageUri = await ResizeImage(imageUri)
          //console.log("バイナリデータ:", binaryData)
          //const response = await fetch(imageUri)

          await UploadCalendarImageAsBlob(yearMonth, compressedImageUri)
          console.log("画像URL保存成功")
        } else {
        //console.log('Image picker was canceled')
        }
      }
    } catch (error) {
      console.error('Error picking image:', error)
    }
  }

  useEffect(() => {
    if (auth.currentUser === null) { return }
    const userUid = auth.currentUser.uid
    const fetchData = async () => {
      const data = await FetchMonthlyData(currentYearMonth)
      setMonthlyData(data)
    }
    const fetchImageData = async () => {
      try {
        if (!userUid) return
        const imageInfo = await FetchCalendarImageId(userUid, currentYearMonth)

        if (imageInfo) {
          setImage(imageInfo.imageUrl)
          console.log('image found', imageInfo.imageUrl)
        } else {
          console.log('image not fount')
          setImage(null)
        }
      } catch (error) {
        console.error('Error fetching diary image:', error)
        setImage(null)
      }
    }
    fetchImageData()
    fetchData()
  }, [currentYearMonth])

  type CustomStylesType = {
    container?: {
      borderWidth?: number
      borderColor?: string
      borderRadius?: number// 他のスタイルプロパティ
    }
  }

  const markedDates = Object.entries(monthlyData).reduce<Record<
  string, { selected: boolean; selectedColor: string; customStyles?: CustomStylesType}>
  >((acc, [date, flags]) => {
    acc[date] = {
      //marked: true, // 点を付ける
      //dotColor: flags.hasPhoto ? "blue" : "transparent", // 写真がある場合は青い点
      selected: flags.hasDiary, // 日記がある場合は選択状態
      selectedColor: flags.hasDiary || flags.hasPhoto ? "lightgreen" : "transparent",
      customStyles: flags.hasDiary && flags.hasPhoto ? {
        container: {
          borderWidth: 2,
          borderColor: '#187D2B',
          borderRadius: 15
        }
      }: {}// 日記がある場合は背景を緑に
    }
    return acc
  }, {})

  const handlePress = async (
    currentYearMonth: string
  ): Promise<void> => {
    if (auth.currentUser === null) { return }
    //const storage = getStorage()
    const userUid = auth.currentUser.uid
    const confirm = await confirmDelete()
    if (confirm) {
      try {
        const imageInfo = await FetchFirstImageId(userUid, currentYearMonth)
        if (imageInfo) {
          const fetchedImageId = imageInfo.imageId
          await DeleteImage(userUid, currentYearMonth, fetchedImageId)
          console.log("前の画像を削除しました")
          setImage(null)
        } else {
          setImage(null)
        }
      } catch (error) {
        console.error("画像削除エラー", error)
        return
      }
    } else {
      console.log("画像削除をキャンセルしました")
      return
    }
  }

  return (

    <View style={styles.container}>

      <View style={styles.imageContainer}>
        {/* 画像が選択されていない場合のみボタンを表示 */}
        {!image && (
        <Button title="カレンダー画像を選択する" onPress={pickImage} />
        )}

        {/* 画像が選択された場合は画像を表示 */}
        {image && (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: image }} style={{ width: 368, height: 240 }} />
            <TouchableOpacity style={styles.closeButton} onPress={() => {handlePress(currentYearMonth)}}>
              <Text style={styles.closeButtonText}>x</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={[styles.monthTitle, { backgroundColor: currentBackgroundColor }]}>
        <Text style={styles.monthText}>
          {currentMonth}月
        </Text>
      </View>

      <SafeAreaView style={styles.calendarContainer}>
        <View style={styles.centeredCalendar}>
          <Calendar
            onMonthChange={(month) => {
              console.log('表示中の月: ', month)
              const newYearMonth = `${month.year}-${month.month.toString().padStart(2, '0')}`
              setCurrentMonth(month.month.toString())
              setCurrentYearMonth(newYearMonth)
            }}
            current={`${currentYear}-${currentMonth}-01`}
            style={styles.mCalendar}
            markedDates={markedDates}
            markingType={"custom"}
            onDayPress={handleDayPress} />
        </View>
      </SafeAreaView>

    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 16
  },
  imageWrapper: {
    position: 'relative' // 相対位置を設定して×ボタンの位置を調整
  },
  monthTitle: {
    height: 51,
    width: '90%',
    marginBottom: 8,
    marginTop: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
    alignSelf: 'center'
  },
  monthText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    justifyContent: 'flex-end',
    marginBottom: 8
  },
  calendarContainer: {
    flex: 1
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
  centeredCalendar: {
    alignItems: 'center'
  },
  mCalendar: {
    width: 368,
    height: 320
  }
})

export default monthlyCalendar
