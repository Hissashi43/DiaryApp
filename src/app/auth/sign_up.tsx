import {
  View, Text, TextInput, Alert,
  StyleSheet, TouchableOpacity
} from 'react-native'

import { Link, router } from 'expo-router'
import { useState } from 'react'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'

import Button from '../../components/Button'
import { auth } from '../../config'

const handlePress = async (email: string, password: string): Promise<void> => {
  // 会員登録
  try {
    console.log(email, password)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await sendEmailVerification(user)

    Alert.alert(
      'Eメールを送りました',
      'メールを確認してEメールアドレスを有効化してください'
    )

    router.replace('/auth/log_in')
  } catch (error) {
      const { code, message } = error as { code: string; message: string}
      console.log(code, message)
      Alert.alert(message)
    }
}


const SignUp = (): JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => { setEmail(text)}}
          autoCapitalize='none'
          keyboardType='email-address'
          placeholder='Email Address'
          textContentType='emailAddress'
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => {setPassword(text)}}
          autoCapitalize='none'
          secureTextEntry
          placeholder='Password'
          textContentType='password'
        />
        <Button label='Submit' onPress={() => { handlePress(email, password) }}/>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already registered?</Text>
          <Link href='/auth/log_in' asChild replace>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Log in here!</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7EEE6'
  },
  inner: {
    paddingVertical: 24,
    paddingHorizontal: 27
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
    height: 48,
    padding: 8,
    fontSize: 16,
    marginBottom: 16
  },
  footer: {
    flexDirection: 'row'
  },
  footerText: {
    fontSize: 14,
    lineHeight: 24,
    marginRight: 8,
    color: '#000000'
  },
  footerLink: {
    fontSize: 14,
    lineHeight: 24,
    color: '#467FD3'
  }
})

export default SignUp
