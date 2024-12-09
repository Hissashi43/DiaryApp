import { Stack } from 'expo-router'

const Layout = (): JSX.Element => {
  return <Stack screenOptions={{
    headerStyle: {
      backgroundColor: '#55E42E'
    },
    headerTintColor: '#ffffff',
    headerTitle: 'Diary App',
    headerBackTitle: 'Back',
    headerTitleStyle: {
      fontSize: 22,
      fontWeight: 'bold'
    },
    headerTitleAlign: 'center'
  }}/>
}

export default Layout
