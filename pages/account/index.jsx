
import { useAuth } from '@/components/AuthUserContext';
import Loading from '@/components/Loading';
import NavBar from '@/components/NavBar';
import { Profile } from '@/components/account/Profile';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect, useState } from 'react'

const index = () => {
    return (
        <Profile />
    )
}

export default index