import * as ImageManipulator from 'expo-image-manipulator'

const ResizeImage = async (imageUri: string): Promise<string> => {
  const manipResult = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 400, height: 300 } }], // リサイズ指定
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG } // 圧縮とフォーマット
  )
  return manipResult.uri
}

export default ResizeImage
