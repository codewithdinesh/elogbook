import { useAuth } from '@/components/AuthUserContext'
import Loading from '@/components/Loading'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import Router from 'next/router'
import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


const onLogOut = () => {
    signOut(auth).then(() => {
        toast("Logout Successfull");
        setTimeout(() => {
            Router.replace("/")
        }, 2000)
    }).catch((error) => {
        toast(error);
    })

}

const logout = () => {

    const { authUser, loading } = useAuth();

    useEffect(() => {
        if (!loading && !authUser) {
            Router.replace("/account/login")
        }
    }, [authUser, loading])


    return (
        <div className="flex justify-center">
            <ToastContainer />
            {
                ((!authUser && !loading) || (!authUser && loading) || (authUser && loading)) ? <Loading /> :

                    <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm m-2">
                        <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">Log out</h5>
                        <p className="text-gray-700 text-base mb-4 w-screen">
                            Are you sure?
                        </p>
                        <button
                            onClick={onLogOut}
                            type="button"
                            className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                            Logout
                        </button>
                    </div>
            }
        </div>
    )
}

export default logout