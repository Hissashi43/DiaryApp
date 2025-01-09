import {
  View, Text, TextInput, Alert,
  TouchableOpacity, StyleSheet
 } from 'react-native'

import { Link, router } from 'expo-router'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'

import Button from '../../components/Button'
import { auth } from '../../config'

const handlePress = async (email: string, password: string): Promise<void> => {
  // ログイン
  try {
    const useCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = useCredential.user
    if (!user.emailVerified) {
      Alert.alert('Eメールが有効化されていません。Eメールを有効化してください')
      return
    }

    router.replace('/diary/annualcalendar')
  } catch (error) {
      const { code, message } = error as { code: string, message: string }
      console.log(code, message)
      Alert.alert('Error', message)
    }
}

const LogIn = (): JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Log In</Text>
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
        <Button label='Submit' onPress={() => handlePress(email, password)} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Not registered?</Text>
          <Link href='/auth/sign_up' asChild replace>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Sign up here!</Text>
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

export default LogIn
