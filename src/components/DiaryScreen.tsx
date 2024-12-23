import React, { useEffect, useState } from "react"
import { View, Image, Text } from "react-native"
import { getDocs, collection } from "firebase/firestore"

import { db } from "../config"


const DiaryScreen = ({ userUid, dateDirectory }: { userUid: string; dateDirectory: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fetchImage = async (userUid: string, dateDirectory: string): Promise<string | null> => {
    try {
      const querySnapshot = await getDocs(
        collection(db, `users/${userUid}/diary/${dateDirectory}/diaryimage`)
      )
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]// 最初のドキュメントを取得
        const data = doc.data()
        if (data.imageUrl) {
          console.log("取得した画像URL:", data.imageUrl)
          return data.imageUrl
        }
      }
      console.log("画像が見つかりませんでした")
      return null
    } catch (error) {
      console.error("画像取得エラー:", error)
      return null
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const url = await fetchImage(userUid, dateDirectory)
      setImageUrl(url)
    }
    fetchData()
  }, [userUid, dateDirectory])

  return (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 368, height: 223 }}
          resizeMode="contain"
        />
      ) : (
        <Text>No image found.</Text>
      )}
    </View>
  )
}

export default DiaryScreen
