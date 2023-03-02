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

      <NavBar />
      <main className='flex flex-col justify-center'>


        <Image
          src="/thirteen.svg"
          alt="13"
          className='m-3'
          width={200}
          height={321}
          priority
        />

      </main>
    </>
  )
}
