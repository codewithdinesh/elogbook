
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth } from './firebase';

const formatAuthUser = (user) => ({
    uid: user.uid,
    email: user.email
});


const useFirebaseAuth = () => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const authStateChanged = async (authState) => {
        if (!authState) {
            setAuthUser(null)
            setLoading(false)
            return;
        }
        setLoading(true)
        var formattedUser = formatAuthUser(authState);
        setAuthUser(formattedUser);
        setLoading(false);
    }

    useEffect(() => {

        onAuthStateChanged(auth, (user) => {

            if (user) {
                authStateChanged(user)

            } else {
                // User is signed out
                authStateChanged()
            }
        });

    }, []);

    return {
        authUser,
        loading
    }
}

export default useFirebaseAuth