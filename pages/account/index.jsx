import { useAuth } from '@/components/AuthUserContext';
import Loading from '@/components/Loading';
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
            {
                ((!authUser && loading) || (!authUser && !loading)) ? <Loading /> :

                    <div className="flex justify-center p-5">
                        <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
                            <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">Email : {user?.email}</h5>
                            <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">Display Name : {user?.displayName}</h5>
                            <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">EmailVerified : {user?.emailVerified}</h5>
                            <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">Card title</h5>

                        </div>
                    </div>

            }
        </div>
    )
}

export default index