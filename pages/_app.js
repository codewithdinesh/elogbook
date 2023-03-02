import { AuthUserProvider } from '@/components/AuthUserContext'
import '@/styles/globals.css'

// check login state here

export default function App({ Component, pageProps }) {

  return <AuthUserProvider>

    <Component {...pageProps} />
  </AuthUserProvider>
}
