import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthUserContext';
import Router from 'next/router';
import { auth } from '@/lib/firebase';
import NavBar from '../NavBar';
import Loading from '../Loading';
import Link from 'next/link';

export const Profile = () => {
    const { authUser, loading } = useAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!loading && !authUser) {

            Router.replace("/account/login")
        } else {
            getUser();
        }
    }, [authUser, loading])

    const getUser = () => {
        const cr_user = auth.currentUser;
        if (cr_user !== null) {
            setUser(cr_user);
        } else {
            setUser(null);
        }

        console.log(cr_user)
    }
    return (
        <div>
            <NavBar isHome={true} />
            {
                ((!authUser && loading) || (!authUser && !loading)) ? <Loading /> :


                    <section style={{ fontFamily: "Montserrat" }} className="  flex font-medium items-center justify-center h-screen  ">

                        <section className="mx-auto bg-[#20354b] rounded-2xl px-8 py-6 shadow-lg">

                            <div className="mt-6 w-fit mx-auto ">
                                <img src="/src/profile.png" className="rounded-full w-28 " alt="profile picture" srcset=""></img>
                            </div>

                            <div className="mt-8 ">
                                <h2 className="text-white font-bold text-2xl tracking-wide">{user?.displayName}</h2>
                            </div>

                            <div className="mt-3 text-white text-sm">
                                <span className="text-gray-400 font-semibold">Email:</span>
                                <span>{user?.email}</span>
                            </div>

                            <div className='flex justify-center items-center mt-3 '>
                                <Link href="/account/logout">
                                    <button
                                        type="button"
                                        className="rounded-lg
                                        px-6
                                        py-2
                                        border-2 border-blue-600
                                        bg-white
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
                                        Logout
                                    </button>
                                </Link>
                            </div>

                        </section>




                    </section>


            }
        </div>
    )
}
