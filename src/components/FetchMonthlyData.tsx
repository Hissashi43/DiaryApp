import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"

import { auth } from "../config"

const FetchMonthlyData = async (month: string) => {
  const userUid = auth.currentUser?.uid // 現在のユーザーUIDを取得
  if (!userUid) {
    console.error("User not authenticated")
    return {}
  }

  const db = getFirestore() // Firestoreインスタンスを取得
  const diaryCollectionRef = collection(db, `users/${userUid}/diary`) // ユーザーのdiaryコレクションを参照

  // 月の範囲を定義（例: 2024-12なら2024-12-01～2024-12-31）
  const startDate = `${month}-01` // 例: "2024-12-01"
  const endDate = `${month}-31`   // 例: "2024-12-31"

  try {
    // Firestoreからその月のデータをクエリ
    const q = query(
      diaryCollectionRef,
      where("date", ">=", startDate),
      where("date", "<=", endDate)
    )
    const querySnapshot = await getDocs(q)

    // データをオブジェクト形式に変換
    const diaryData = querySnapshot.docs.reduce<Record<string, { hasDiary: boolean; hasPhoto: boolean }>>(
      (acc, doc) => {
      const data = doc.data()
      acc[data.date] = {
        hasDiary: data.hasDiary || false,
        hasPhoto: data.hasPhoto || false
      }
      return acc
    }, {})

    return diaryData // 例: { "2024-12-01": { hasDiary: true, hasPhoto: false }, ... }
  } catch (error) {
    console.error("Error fetching monthly diary data:", error)
    return {}
  }
}

export default FetchMonthlyData
