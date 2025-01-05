import * as ImagePicker from 'expo-image-picker'


const PickImage = async () => {
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    console.log('Permission result:', permissionResult)
    if (!permissionResult.granted) {
      alert('画像選択のためにカメラロールへのアクセス許可が必要です')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1
    })

    console.log('Image picker result:', result)

    if (!result.canceled) {
      //console.log('Selected image URI:', result.assets[0].uri)
      return result.assets[0].uri
    } else {
      //console.log('Image picker was canceled')
    }
  } catch (error) {
    console.error('Error picking image:', error)
  }
}

export default PickImage
