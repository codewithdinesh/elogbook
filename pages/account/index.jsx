/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from '@/components/AuthUserContext';
import Loading from '@/components/Loading';
import NavBar from '@/components/NavBar';
import { auth } from '@/lib/firebase';
import Router from 'next/router';
import React, { useEffect, useState } from 'react'

const index = () => {

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


                    <section style={{ fontFamily: "Montserrat" }} class="  flex font-medium items-center justify-center h-screen  ">

                        <section class="mx-auto bg-[#20354b] rounded-2xl px-8 py-6 shadow-lg">

                            <div class="mt-6 w-fit mx-auto ">
                                <img src="/src/profile.png" class="rounded-full w-28 " alt="profile picture" srcset=""></img>
                            </div>

                            <div class="mt-8 ">
                                <h2 class="text-white font-bold text-2xl tracking-wide">{user?.displayName}</h2>
                            </div>

                            <div class="mt-3 text-white text-sm">
                                <span class="text-gray-400 font-semibold">Email:</span>
                                <span>{user?.email}</span>
                            </div>

                        </section>


                    </section>


            }
        </div>
    )
}

export default index