import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"
import { auth } from "../config"

const FetchYearlyCount = async (year: string): Promise<number> => {
  const userUid = auth.currentUser?.uid
  if (!userUid) {
    console.error("User not authenticated")
    return 0
  }

  const db = getFirestore()
  const diaryCollectionRef = collection(db, `users/${userUid}/diary`)
  const startDate = `${year}-01-01`
  const endDate = `${year}-12-31`

  try {
    const q = query(
      diaryCollectionRef,
      where("date", ">=", startDate),
      where("date", "<=", endDate),
      where("hasDiary", "==", true)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.size
  } catch (error) {
    console.error("Error fetching yearly diary count:", error)
    return 0
  }
}

export default FetchYearlyCount
