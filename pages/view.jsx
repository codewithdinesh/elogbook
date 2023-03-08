/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from '@/components/AuthUserContext';
import NavBar from '@/components/NavBar';
import Sheet from '@/components/Sheet'
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Router } from 'next/router';
import React, { useEffect, useState } from 'react'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function view() {

    const [date, setDate] = useState();
    const [shift, setShift] = useState();
    const [sheet, setSheet] = useState();

    const { authUser, loading } = useAuth();

    useEffect(() => {
        if (!loading && !authUser) {
            Router.replace("/account/login")
        }
    }, [authUser, loading]);

    const onSearch = (e) => {
        e.preventDefault();

        // alert(date + shift)

        if (!date || date == "") {
            // toast("Choose Date!");
            toast.error("choose Date !!");

        } else if (!shift || shift == "") {
            toast.error("choose Shift!!");
        } else {

            loadData();
        }
    }


    const loadData = async () => {
        // const date = new Date().toJSON().slice(0, 10);

        const docRef = doc(db, "production", date);
        console.log("working...")
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            console.log("Document data:", docSnap.data());

            const data = docSnap.data();


            // doc.data() will be undefined in this case
            if (data[shift] == undefined || data[shift] == "") {
                toast.info("Sheet Not Found...")
                setSheet("")

            } else {
                setSheet(data[shift]);

            }
            // console.log()


        } else {
            console.log("No such document!");
            toast.info("No records Found")
        }
    }



    return (
        <div>
            <NavBar isHome={true} />
            <ToastContainer />


            <div className=' container mx-auto mt-2 mb-2 md:mt-5 border border-slate-500 rounded-lg ' style={
                {

                    background: "rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(5px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)"
                }
            }>
                {/* Heading Search */}
                <h1 className=" text-blue-800 font-semibold text-2xl text-center rounded-sm" style={
                    {

                        background: "rgba(255, 255, 255, 0.6)",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(5px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)"
                    }}>
                    Search
                </h1>

                <div className='flex flex-col  md:flex-row px-2 justify-center items-center content-center'>

                    {/* Date choose */}
                    <div className=" flex-1  rounded-lg m-1  col-span-6 md:col-span-2  p-1  h-15 w-full">
                        <h1 className=' font-semibold uppercase text-white'> Date: </h1>

                        {/* Date picker */}

                        <div className="datepicker">
                            <input type="date"
                                id='datepicker'
                                className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                                placeholder="Select a date"
                                onChange={(e) => {
                                    e.preventDefault();
                                    setDate(e.target.value);
                                }}
                            />
                        </div>
                    </div>

                    {/* Shift */}
                    <div className="flex-1 rounded-lg  col-span-6 md:col-span-2 p-1 m-1 h-15 w-full">
                        <h1 className=' font-semibold uppercase m-0 text-white'> Shift: </h1>

                        <select
                            id="countries"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(e) => {
                                e.preventDefault();
                                setShift(e.target.value);
                            }}

                        >
                            <option value="" >select option</option>
                            <option value="shift1" >Shift 1</option>
                            <option value="shift2">Shift 2</option>
                            <option value="shift3">Shift 3</option>

                        </select>


                    </div>

                    <button
                        className="m-1 border justify-center mb-1 flex-1 z-[2] flex items-center rounded-lg bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
                        type="button"
                        onClick={(e) => {
                            onSearch(e);

                        }}
                    >
                        <span className='p-1 md:hidden'>Search</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-5 w-5">
                            <path
                                fill-rule="evenodd"
                                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>


            {/* <Sheet /> */}

            {
                sheet ? <Sheet sheet={sheet} /> : null
            }
        </div >
    )
}

export default view