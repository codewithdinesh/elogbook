/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react'
import { useAuth } from './AuthUserContext';
import Loading from './Loading';
import Link from 'next/link';

const NavBar = ({ isHome }) => {

    const { authUser, loading } = useAuth();

    useEffect(() => {

    }, [authUser, loading])

    return (
        <div>

            <nav className='relative
                w-full
                flex flex-wrap
                items-center
                justify-between
                py-2
                bg-gray-100
                text-gray-500
                hover:text-gray-700
                focus:text-gray-700
                shadow-lg
                navbar navbar-expand-lg navbar-light'>

                <div className="container-fluid w-full flex flex-wrap items-center justify-between px-2 md:px-6">

                    <div className='cursor-pointer'>
                        <h1 className=' text-blue-800 font-semibold text-2xl'>
                            <Link href={"/"}>
                                elogbook
                            </Link>
                        </h1>
                    </div>

                    {
                        (authUser && !loading) ?

                            (!isHome) ?
                                <div className='flex-1 flex justify-center items-center md:justify-end w-full'>
                                    <Link href="/view">
                                        <button
                                            type="button"
                                            className="rounded-lg
                                            px-6
                                            py-2
                                            border-2 border-blue-600
                                            text-blue-600
                                            font-medium
                                            text-xs
                                            leading-tight
                                            uppercase
                                            hover:bg-black hover:bg-opacity-5
                                            focus:outline-none focus:ring-0
                                            transition
                                            duration-150
                                            ease-in-out
                                            m-1" >
                                            View Logs
                                        </button>
                                    </Link>


                                    <Link href="/add">
                                        <button
                                            type="button"
                                            className="rounded-lg
                                            px-6
                                            py-2
                                            border-2 border-blue-600
                                            text-blue-600
                                            font-medium
                                            text-xs
                                            leading-tight
                                            uppercase
                                            hover:bg-black hover:bg-opacity-5
                                            focus:outline-none focus:ring-0
                                            transition
                                            duration-150
                                            ease-in-out
                                            m-1" >
                                            Add Logs
                                        </button>
                                    </Link>

                                    <Link href={"/account"}>
                                        <img
                                            src="/src/profile.png"
                                            className="rounded-full w-12 m-1"
                                            alt="Avatar" />
                                    </Link>
                                </div>
                                :
                                <div className='flex justify-center items-center'>
                                    <Link href="/">
                                        <button
                                            type="button"
                                            className="rounded-lg
                                        px-6
                                        py-2
                                        border-2 border-blue-600
                                        text-blue-600
                                        font-medium
                                        text-xs
                                        leading-tight
                                        uppercase
                                        hover:bg-black hover:bg-opacity-5
                                        focus:outline-none focus:ring-0
                                        transition
                                        duration-150
                                        ease-in-out
                                        m-1" >
                                            Home
                                        </button>
                                    </Link>

                                    <Link href={"/account"}>
                                        <img
                                            src="/src/profile.png"
                                            className="rounded-full w-12 m-1"
                                            alt="Avatar" />
                                    </Link>
                                </div>
                            :
                            ((authUser && loading) || (!authUser && loading)) ?

                                <div className="flex justify-center items-center ">
                                    <div
                                        className="m-2 spinner-border animate-spin block w-12 h-10 border-4  rounded-full border-red-400"
                                        role="status">
                                        <span className="visually-hidden"></span>


                                    </div>
                                    <h1 className='text-red-500 animate-pulse font-semibold text-2xl'>
                                        Loading...
                                    </h1>
                                </div>
                                :
                                <div>

                                    <div className="flex items-center justify-center">
                                        <div className="inline-flex" role="group">

                                            <Link href="/account/login">
                                                <button
                                                    type="button"
                                                    className="rounded-lg
                                                        px-6
                                                        py-2
                                                        border-2 border-blue-600
                                                        text-blue-600
                                                        font-medium
                                                        text-xs
                                                        leading-tight
                                                        uppercase
                                                        hover:bg-black hover:bg-opacity-5
                                                        focus:outline-none focus:ring-0
                                                        transition
                                                        duration-150
                                                        ease-in-out
                                                        m-1" >
                                                    Login
                                                </button>
                                            </Link>

                                            <Link href="/account/register">
                                                <button
                                                    type="button"
                                                    className="rounded-lg
                                                    px-6
                                                    py-2
                                                    border-2 border-blue-600
                                                    text-blue-600
                                                    font-medium
                                                    text-xs
                                                    leading-tight
                                                    uppercase
                                                    hover:bg-black hover:bg-opacity-5
                                                    focus:outline-none focus:ring-0
                                                    transition
                                                    duration-150
                                                    ease-in-out
                                                    m-1">
                                                    Register
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                    }

                </div>
            </nav>


        </div>
    )
}

export default NavBar