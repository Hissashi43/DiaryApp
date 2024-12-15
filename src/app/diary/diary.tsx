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
  const [year, month, day] = date.split('-')
  const [diaryData, setDiaryData] = useState<{ bodyText: string; updatedAt: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDiaryData = async () => {
      if (!auth.currentUser || !date) {
        setDiaryData(null)
        setLoading(false)
        return
      }

      try {
        const diaryRef = doc(db, `users/${auth.currentUser.uid}/diary/${date}/${day}`)
        const diarySnap = await getDoc(diaryRef)

        if (diarySnap.exists()) {
          setDiaryData(diarySnap.data() as { bodyText: string; updatedAt: string })
        } else {
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
  }, [date])

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


      <View style={styles.monthTitle}>
        <Text style={styles.monthText}>
          {date ? formattedDate.split('年')[1] : 'unknown date'}
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
          {date ? `${formattedDate}の日記がここに表示されます` : '選択された日記はありません'}
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
