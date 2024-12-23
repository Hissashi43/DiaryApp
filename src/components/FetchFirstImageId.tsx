import { getDocs, collection } from "firebase/firestore"
import { db } from "../config" // Firebase 設定ファイルをインポート

const FetchFirstImageId = async (
  userUid: string, dateDirectory: string
): Promise<{ imageId: string;  imageUrl: string} | null> => {
  try {
    // コレクションを指定
    const querySnapshot = await getDocs(
      collection(db, `users/${userUid}/diary/${dateDirectory}/diaryimage`)
    )

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
    console.log("画像が見つかりませんでした")
    return null
  } catch (error) {
    console.error("画像取得エラー:", error)
    return null
  }
}

export default FetchFirstImageId