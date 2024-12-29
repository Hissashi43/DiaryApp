import { getFirestore } from "firebase/firestore"
import { doc, setDoc } from "firebase/firestore"
import { auth } from "../config"

const SaveDiaryEntry = async (date: string, text: string, imageUrl: string | null) => {
  const userUid = auth.currentUser?.uid
  const db = getFirestore() // Firestoreインスタンスを取得
  const diaryDocRef = doc(db, `users/${userUid}/diary`, date) // ドキュメントの参照を取得

  const data = {
    date,
    text: text || null, // 日記が空の場合はnull
    imageUrl: imageUrl || null, // 写真がない場合はnull
    hasDiary: !!text, // 日記がある場合はtrue
    hasPhoto: !!imageUrl// 写真がある場合はtrue
  }

  try {
    await setDoc(diaryDocRef, data, { merge: true }) // データをFirestoreに保存
    console.log("Diary entry saved successfully!")
  } catch (error) {
    console.error("Error saving diary entry:", error)
  }
}

export default SaveDiaryEntry
