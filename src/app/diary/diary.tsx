import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useSearchParams } from 'expo-router/build/hooks'
import { doc, getDoc } from 'firebase/firestore'
import { db, auth } from '../../config'
import { useEffect, useState } from 'react'

import CircleButton from '../../components/CircleButton'

const handlePress = (): void => {
  router.push('/diary/edit')
}

const Diary = (): JSX.Element => {
  const searchParams = useSearchParams()
  const date = searchParams.get('date')
  const id = searchParams.get('id')
  const [year, month, day] = date.split('-')
  const dateDirectory = date?.replace('-', '').replace('-', '')
  const [diaryData, setDiaryData] = useState<{ bodyText: string; updatedAt: string } | null>(null)
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    const fetchDiaryData = async () => {
      console.log('auth.currentUser:', auth.currentUser)
      console.log('date:', date)
      console.log('id:', id)
      if (!auth.currentUser || !date || !id) {
        console.log('no data')
        setDiaryData(null)
        setLoading(false)
        return
      }

      try {
        const diaryRef = doc(db, `users/${auth.currentUser.uid}/diary/${dateDirectory}/diarytext/${id}`)
        const diarySnap = await getDoc(diaryRef)

        if (diarySnap.exists()) {
          console.log('doc found')
          setDiaryData(diarySnap.data() as { bodyText: string; updatedAt: string })
        } else {
          console.log('doc not fount')
          router.push('diary/create')// 日記が存在しない場合
        }
      } catch (error) {
        console.error('Error fetching diary:', error)
        setDiaryData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDiaryData()
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
        <Image
          style={{
            width: 368,
            height: 223
          }}
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('../../../assets/example-image.png')}/>
      </View>

      <View style={styles.diaryContent}>
        <Text style={styles.diaryContentText}>
          { diaryData? `${diaryData.bodyText}` : '選択された日記はありません'}
        </Text>
      </View>

      <CircleButton onPress={handlePress}>
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
  imageContainer: {
    alignItems: 'center'
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
    alignItems: 'center',
    marginRight: 17,
    marginLeft: 17
  },
  diaryContentText: {
    fontSize: 18,
    lineHeight: 28
  }

})

export default Diary
