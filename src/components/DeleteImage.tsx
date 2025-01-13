import { doc, deleteDoc, getDoc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { db, storage } from "../config" // 必要な Firebase 設定をインポート

const DeleteImage = async (
  userUid: string,
  dateDirectory: string,
  imageId: string | null,
  month: boolean = false
): Promise<void> => {
  if (!imageId) {
    console.error("画像IDが指定されていません")
    return
  }
  //console.log('消すための情報：', userUid, dateDirectory, imageId)
  try {
    // Firestore ドキュメントの参照
    if (month===false) {
      const docRef = doc(db, `users/${userUid}/diary/${dateDirectory}/diaryimage/${imageId}`)

    // Firestore から画像の URL を取得
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        const imageUrl = data.imageUrl

        // Firebase Storage の参照を作成
        const storageRef = ref(storage, imageUrl)

        // Firebase Storage から画像削除
        await deleteObject(storageRef)
        console.log("Firebase Storage から画像削除成功")

        // Firestore からドキュメント削除
        await deleteDoc(docRef)
        console.log("Firestore から画像ドキュメント削除成功")
      } else {
        console.log("Firestore ドキュメントが存在しません")
      }
    } else {
      const docRef = doc(db, `users/${userUid}/diary/${dateDirectory}/monthlyimage/${imageId}`)

      // Firestore から画像の URL を取得
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          const imageUrl = data.imageUrl

          // Firebase Storage の参照を作成
          const storageRef = ref(storage, imageUrl)

          // Firebase Storage から画像削除
          await deleteObject(storageRef)
          console.log("Firebase Storage から画像削除成功")

          // Firestore からドキュメント削除
          await deleteDoc(docRef)
          console.log("Firestore から画像ドキュメント削除成功")
        } else {
          console.log("Firestore ドキュメントが存在しません")
        }
    }
  } catch (error) {
    console.error("画像削除エラー:", error)
  }
}

export default DeleteImage
