/* eslint-disable @next/next/no-img-element */
import NavBar from '@/components/NavBar'

import Head from 'next/head'
import Image from 'next/image'


export default function Home() {
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
