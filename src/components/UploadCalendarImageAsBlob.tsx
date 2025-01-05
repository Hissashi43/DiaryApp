import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, Timestamp } from 'firebase/firestore'


import { auth, db } from "../config"

const UploadCalendarImageAsBlob = async (
  yearMonth: string, imageUri: string
): Promise<string> => {
  const storage = getStorage()
  const userUid = auth.currentUser?.uid || "default_user"
  const fileName = `${Date.now()}.jpg`
  const imageRef = ref(storage, `users/${userUid}/diary/${yearMonth}/monthlyimage/${fileName}`)

  try {
    // ローカルファイルを取得し、Blob に変換
    const response = await fetch(imageUri)
    const blob = await response.blob()
    console.log("Blob 変換成功:", blob)

    // Blob を使用してアップロード
    const uploadTask = uploadBytesResumable(imageRef, blob)

    // Promise を返してアップロード完了を待つ
    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
        },
        (error) => {
          console.error("アップロード中のエラー:", error)
          reject(error)
        },
        async () => {
          try {
            // アップロード完了後に URL を取得
            const imageUrl = await getDownloadURL(imageRef)
            console.log("画像アップロード成功:", imageUrl)

            //FireStoreにUPL保存
            const uppedImageRef = await addDoc(
              collection(db, `users/${userUid}/diary/${yearMonth}/monthlyimage`),
              {
                imageUrl, // `undefined` ではないことを確認
                updatedAt: Timestamp.fromDate(new Date())
              }
            )

            console.log("画像URL Firestore 保存成功")
            resolve(uppedImageRef.id)
          } catch (error) {
          console.error("Firestore 保存エラー:", error)
          reject(error)
          }
        }
      )
    })
  } catch (error) {
    console.error("Blob アップロードエラー:", error)
    throw error
  }
}

export default UploadCalendarImageAsBlob
