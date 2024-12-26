import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { router, useNavigation } from 'expo-router'
import { useSearchParams } from 'expo-router/build/hooks'
import { doc, getDoc } from 'firebase/firestore'
import { db, auth } from '../../config'
import { useEffect, useState } from 'react'

import CircleButton from '../../components/CircleButton'
import FetchFirstImageId from '../../components/FetchFirstImageId'
import MonthColors from '../../components/MonthColors'
import ToCalendarButton from '../../components/ToCalendarButton'

const handlePress = (date: string, id: string): void => {
  router.push(`/diary/edit?date=${date}&id=${id}`)
}

const Diary = (): JSX.Element => {
  const searchParams = useSearchParams()
  const date = String(searchParams.get('date'))
  const id = String(searchParams.get('id'))
  const [year, month, day] = date.split('-')
  const dateDirectory = date?.replace('-', '').replace('-', '')
  const [diaryData, setDiaryData] = useState<{ bodyText: string; updatedAt: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const currentBackgroundColor = MonthColors[month] || '#000000'
  const [image, setImage] = useState<string | null>(null)

  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => { return <ToCalendarButton month={month} /> }
    })
  }, [])


  useEffect(() => {
    const flagment = [0, 0]
    const userUid = auth.currentUser?.uid
    const fetchDiaryData = async () => {
      if (!auth.currentUser || !date || !id) {
        console.log('no diary-text data')
        setDiaryData(null)
        setLoading(false)
        return
      }

      try {
        const diaryRef = doc(db, `users/${userUid}/diary/${dateDirectory}/diarytext/${id}`)
        const diarySnap = await getDoc(diaryRef)

        if (diarySnap.exists()) {
          console.log('doc found')
          setDiaryData(diarySnap.data() as { bodyText: string; updatedAt: string })
          flagment[0] = 1
        } else {
          console.log('doc not fount')

        }
      } catch (error) {
        console.error('Error fetching diary:', error)
        setDiaryData(null)
      } finally {
        setLoading(false)
      }
    }
    const fetchData = async () => {
      try {
        if (!userUid) return
        const imageInfo = await FetchFirstImageId(userUid, dateDirectory)

        if (imageInfo) {
          setImage(imageInfo.imageUrl)
          console.log('image found', imageInfo.imageUrl)
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
        <View style={{
          width: 360,
          height: 240,
          backgroundColor: 'rgba(0,0,0,0.1)'
        }}>
          <Text>no image</Text>
        </View>
        )}

        {/* 画像が選択された場合は画像を表示 */}
        {image && (
        <View style={styles.imageWrapper}>
          <Image source={{ uri: image }} style={{ width: 360, height: 240 }} />
        </View>
        )}
      </View>

      <ScrollView style={styles.diaryContent}>
        <Text style={styles.diaryContentText}>
          { diaryData? `${diaryData.bodyText}` : '選択された日記はありません'}
        </Text>
      </ScrollView>

      <CircleButton onPress={() => { handlePress(date, id) }}>
        <Entypo name='pencil' size={28}/>
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

export default Diary
