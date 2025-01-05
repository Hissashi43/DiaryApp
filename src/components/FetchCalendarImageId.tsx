import { getDocs, collection } from "firebase/firestore"
import { db } from "../config" // Firebase 設定ファイルをインポート

const FetchCalendarImageId = async (
  userUid: string, yearMonth: string
): Promise<{ imageId: string;  imageUrl: string} | null> => {
  try {
    // コレクションを指定
    const querySnapshot = await getDocs(
      //collection(db, `users/3oNAio6zlVOe4lPNhCC0V6NrNAR2/diary/20240102/diaryimage`)
      collection(db, `users/${userUid}/diary/${yearMonth}/monthlyimage`)
    )
    console.log("クエリ結果のドキュメント数:", querySnapshot.size)
    querySnapshot.forEach((doc) => {
      console.log("ドキュメント ID:", doc.id, "データ:", doc.data())
    })
    // ドキュメントが存在するか確認
    if (!querySnapshot.empty) {
      const firstDoc = querySnapshot.docs[0] // 最初のドキュメントを取得
      const data = firstDoc.data()
      if (data.imageUrl) {
        console.log("取得したドキュメント ID:", firstDoc.id)
        console.log("取得した画像 URL:", data.imageUrl)
        return { imageId: firstDoc.id, imageUrl: data.imageUrl }
      }
    }
    console.log(`$users/${userUid}/diary/${yearMonth}/monthlyimageに画像が見つかりませんでした`)
    return null
  } catch (error) {
    console.error("画像取得エラー:", error)
    return null
  }
}

export default FetchCalendarImageId
