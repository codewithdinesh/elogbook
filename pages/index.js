/* eslint-disable @next/next/no-img-element */

// Translation reference:
// https://aniksharif.medium.com/creating-a-multilingual-react-component-in-next-js-with-google-translate-bf1899f331fe
// https://stackblitz.com/edit/react-ts-yvxhjt?file=index.tsx,index.html

import NavBar from '@/components/NavBar'

import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';



export default function Home() {

  const { isFallback, events } = useRouter()

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(

      {
        pageLanguage: 'en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      },
      'google_translate_element',
    )
  }

  useEffect(() => {
    const id = 'google-translate-script'

    const addScript = () => {
      const s = document.createElement('script')
      s.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit')
      s.setAttribute('id', id)
      const q = document.getElementById(id)
      if (!q) {
        document.body.appendChild(s)
        window.googleTranslateElementInit = googleTranslateElementInit
      }
    }

    const removeScript = () => {
      const q = document.getElementById(id)
      if (q) q.remove()
      const w = document.getElementById('google_translate_element')
      if (w) w.innerHTML = ''
    }

    isFallback || addScript()

    events.on('routeChangeStart', removeScript)
    events.on('routeChangeComplete', addScript)

    return () => {
      events.off('routeChangeStart', removeScript)
      events.off('routeChangeComplete', addScript)
    }
  }, [])

  return (
    <>
      <Head>
        <title>E-LogBook</title>
        <meta name="description" content="elogbook helps to maintain your works logs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <div className='container mx-auto'> */}

      <NavBar />

      <main className='flex flex-col justify-center w-full'>


        <img
          className="max-w-screen max-h-screen"
          src="/src/landpage.png"
          alt="Image"
        >
        </img>



      </main>
      {/* </div> */}
    </>
  )
}
