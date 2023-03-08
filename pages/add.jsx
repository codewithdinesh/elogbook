/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from '@/components/AuthUserContext'
import Loading from '@/components/Loading';
import NavBar from '@/components/NavBar';
import { auth, db } from '@/lib/firebase';
import { addDoc, arrayUnion, collection, doc, setDoc } from 'firebase/firestore';
import Router from 'next/router';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useState } from 'react'



const add = () => {

    const { authUser, loading } = useAuth();

    useEffect(() => {
        if (!loading && !authUser) {
            Router.replace("/account/login")
        }
    }, [authUser, loading]);



    const [date, setDate] = useState("");
    const [shift, setShift] = useState("");
    const [details, setDetails] = useState({});
    const [production, setProduction] = useState({});
    const [rejections, setRejections] = useState({});
    const [qsr, setQsr] = useState({});
    const [totalChanges, setTotalChanges] = useState({});
    const [messsages, setMessages] = useState({});


    const onAdd = () => {


        console.log(details);

        console.log("Production", production);

        console.log("Total changes", totalChanges);

        date.split(' ').join('');
        console.log("Date: ", date)
        if (date == "" || date === "") {
            toast("Please select date");
        } else if (shift == "" || shift === "") {
            toast("Please select Shift");

        } else {
            // toast("Not working")
            addToFirebase();
        }



    }

    const onDetailsChange = (e) => {

        let name = e.target.name;
        let value = e.target.value;

        setDetails({
            ...details,
            [name]: value,
        })
    }

    const onProductionDetailsChange = (e) => {

        let name = e.target.name;
        let value = e.target.value;

        setProduction({
            ...production,
            [name]: value
        })

    }


    const onChangeRejections = (e) => {

        let name = e.target.name;
        let value = e.target.value;

        setRejections({
            ...rejections,
            [name]: value
        })

    }

    const onChangeQsr = (e) => {

        let name = e.target.name;
        let value = e.target.value;

        setQsr({
            ...qsr,
            [name]: value
        })

    }

    const onTotalChangesDetails = (e) => {

        let name = e.target.name;
        let value = e.target.value;

        setTotalChanges({
            ...totalChanges,
            [name]: value
        })

    }

    const onMessageChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setMessages({
            ...messsages,
            [name]: value
        })

    }


    // add data to firebase firestore
    const addToFirebase = async () => {
        // const ref = collection(doc(db, `production`, date),);


        const data =
        {
            [shift]: {
                "date": date,
                "shift": shift,
                "details": details,
                "production": production,
                "rejections": rejections,
                "qsr": qsr,
                "total_changes": totalChanges,
                "messages": messsages,
                "submitted_by": {
                    email: auth.currentUser.email,
                    name: auth.currentUser.displayName
                }
            }
        };

        await setDoc(doc(db, "production", date), data, { merge: true });

        toast("Data Added")

    }
    // hrs details
    const hrs = [1, 2, "Tea I", 3, 4, "Lunch", 5, 6, "Tea II", 7, 8, "Total"];


    return (

        <>
            <NavBar isHome={true} />
            <div className="mx-auto container p-1">

                <div className="flex flex-col rounded-lg  p-1 sm:p-2 md:p-5 bg-white ">
                    <ToastContainer />


                    {/* report details */}
                    <div id="main" className="grid grid-rows-4 grid-cols-12   p-1  overflow-hidden border border-slate-700">

                        {/* row 1 */}
                        {/* Heading */}

                        <div className="border border-slate-500 text-black rounded-lg m-1  col-span-12 md:col-span-8 flex justify-center items-center row-span-full md:row-span-1 p-2 ">
                            <h1 className=' font-semibold uppercase block '> Daily Production Report</h1>
                        </div>

                        <div className="border border-slate-500 text-black rounded-lg m-1  col-span-6 md:col-span-2  p-1  h-24">
                            <h1 className=' font-semibold uppercase'> Date: </h1>

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
                        <div className="border border-slate-500 text-black rounded-lg  col-span-6 md:col-span-2 p-1 m-1 h-24">
                            <h1 className=' font-semibold uppercase m-0'> Shift: </h1>

                            <select
                                id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={(e) => {
                                    e.preventDefault();
                                    setShift(e.target.value)
                                }}
                            >
                                <option value="" >select option</option>
                                <option value="shift1" >Shift 1</option>
                                <option value="shift2">Shift 2</option>
                                <option value="shift3">Shift 3</option>

                            </select>


                        </div>


                        <div className=' col-span-12 md:col-span-8 grid  grid-cols-12  md:grid-cols-8 row-span-3 '>

                            {/* Titles */}
                            <div className="border border-slate-500 text-black rounded-lg m-1  row-span-3 md:row-span-2 col-span-2 md:col-span-1 p-1 text-center flex items-center justify-center">Cell Name</div>

                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-2 p-2.5 flex items-center justify-center">Name</div>
                            <div className="border border-slate-500 text-black rounded-lg m-1  col-span-5 md:col-span-1 p-2.5 flex items-center justify-center">Sign</div>
                            <div className="border border-slate-500 text-black rounded-lg m-1 hidden md:flex col-span-3 p-2.5 items-center justify-center">Name</div>
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2 md:col-span-1 hidden md:flex p-2.5 items-center justify-center">Sign</div>

                            {/*  entrie 1&2 */}
                            <>
                                <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-2">

                                    <input
                                        type="text"
                                        name={"name" + 1}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            onDetailsChange(e)
                                        }}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" placeholder="Enter Name..." required>

                                    </input>
                                </div>

                                <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-1">
                                    <input
                                        type="text"
                                        name={"sign" + 1}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            onDetailsChange(e)
                                        }}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" placeholder="Enter Signature..." required>

                                    </input>
                                </div>

                                <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-3 ">

                                    <input
                                        type="text"
                                        name={"name" + 2}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            onDetailsChange(e)
                                        }}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" placeholder="Enter Name..." required>

                                    </input>
                                </div>

                                <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-1 ">


                                    <input
                                        type="text"
                                        name={"sign" + 2}
                                        onChange={e => onDetailsChange(e)}

                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" placeholder="Enter Signature..." required>

                                    </input>

                                </div>

                            </>
                            {/*  cell index */}
                            <div className="border border-slate-500 text-black rounded-lg m-1  row-span-4 md:row-span-2 col-span-2 md:col-span-1 text-center flex items-center">
                                <input
                                    type="text"
                                    name={"cell_index"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onDetailsChange(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" placeholder="">

                                </input>

                            </div>

                            {/*  entrie 3&4 */}
                            <>
                                <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-2">
                                    <input
                                        name={"name" + 3}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            onDetailsChange(e)
                                        }}
                                        type="text"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" placeholder="Enter Signature..." required>

                                    </input>
                                </div>

                                <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-1">
                                    <input
                                        name={"sign" + 3}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            onDetailsChange(e)
                                        }}
                                        type="text"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" placeholder="Enter Signature..." required>

                                    </input>
                                </div>
                                <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-3">

                                    <input
                                        name={"name" + 4}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            onDetailsChange(e)
                                        }}
                                        type="text"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" placeholder="Enter Signature..." required>

                                    </input>
                                </div>
                                <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-1">

                                    <input
                                        name={"sign" + 4}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            onDetailsChange(e)
                                        }}
                                        type="text"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" placeholder="Enter Signature..." required>

                                    </input>
                                </div>
                            </>

                            {/*  entrie 5&6 */}
                            <>
                                <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-2">
                                    <input type="text"
                                        name={"name" + 5}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            onDetailsChange(e)
                                        }}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" placeholder="Enter Signature..." required>

                                    </input>
                                </div>

                                <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-1">
                                    <input type="text"
                                        name={"sign" + 5}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            onDetailsChange(e)
                                        }}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" placeholder="Enter Signature..." required>

                                    </input>
                                </div>
                                <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-3">

                                    <input type="text"
                                        name={"name" + 6}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            onDetailsChange(e)
                                        }}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" placeholder="Enter Signature..." required>

                                    </input>
                                </div>
                                <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-1">

                                    <input type="text"
                                        name={"sign" + 6}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            onDetailsChange(e)
                                        }}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" placeholder="Enter Signature..." required>

                                    </input>
                                </div>
                            </>

                        </div>


                        {/* Overall details -shift ,hrs rate, manpower */}
                        <div className='col-span-12 grid md:col-span-4  grid-cols-4 row-span-3 '>

                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2 p-1 text-center flex items-center justify-center">Shift</div>

                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2 ">
                                <input
                                    type="text"
                                    name={"shift"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onDetailsChange(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="Enter Shift..." required>

                                </input>
                            </div>

                            {/* Hr rate */}
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2 p-1 text-center flex items-center justify-center">Hr. Rate</div>
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2">
                                <input type="text"
                                    name={"hr_rate"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onDetailsChange(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="Enter Hour Rate..." required>

                                </input>
                            </div>

                            {/* manpower planned */}
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2 p-1 text-center flex items-center justify-center">

                                Manpower Planned

                            </div>
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2">
                                <input type="text"
                                    name={"manpower_planned"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onDetailsChange(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="Enter..." required>

                                </input>
                            </div>


                            {/* manpower present */}
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2 p-1 text-center flex items-center justify-center">
                                Manpower Present
                            </div>
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2">
                                <input type="text"
                                    name={"manpower_present"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onDetailsChange(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="Enter here..." required>
                                </input>

                            </div>

                        </div>

                    </div>

                    {/* Production */}
                    <div className=' col-span-12 p-1 mt-1 border border-slate-700'>
                        <h1 className='text-black font-semibold'>
                            Production
                        </h1>

                        {/* Titles of production */}
                        <div className='grid grid-cols-12 font-semibold'>
                            <div className="border border-slate-500 text-black col-span-2 md:col-span-1 p-2.5">Hr.</div>
                            <div className="border border-slate-500 text-black  col-span-2 md:col-span-1 p-2.5">Prod.</div>
                            <div className="border border-slate-500 text-black  col-span-2 p-2.5 md:col-span-1">Cum. Prod.</div>
                            <div className="border border-slate-500 text-black  col-span-2 md:col-span-1 p-2.5 ">Prod. Loss</div>
                            <div className="border border-slate-500 text-black  col-span-4 md:col-span-8 p-2.5">Loss Reason</div>
                        </div>

                        {/* Data entries for production */}
                        {
                            hrs.map((ele) => {
                                return <div className='grid grid-cols-12' key={ele}>

                                    {/* Hrs */}
                                    <div className="border border-slate-500 text-black  col-span-2 md:col-span-1  flex items-center justify-center font-semibold" >
                                        {ele}
                                    </div>

                                    {/* Production */}
                                    <div className="border border-slate-500 text-black   col-span-2 md:col-span-1">
                                        <input type="text"
                                            name={"prod" + ele}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                onProductionDetailsChange(e)
                                            }}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            placeholder="" >

                                        </input>
                                    </div>

                                    {/* cum. production */}
                                    <div className="border border-slate-500 text-black col-span-2 md:col-span-1">
                                        <input type="text"
                                            name={"cum_prod" + ele}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                onProductionDetailsChange(e)
                                            }}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            placeholder="" >

                                        </input>
                                    </div>

                                    {/* Production loss */}
                                    <div className="border border-slate-500 text-black  col-span-2 md:col-span-1">
                                        <input type="text"
                                            name={"prod_loss" + ele}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                onProductionDetailsChange(e)
                                            }}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            placeholder="" >

                                        </input>
                                    </div>


                                    {/* Production loss reason */}
                                    <div className="border border-slate-500 text-black  col-span-4 md:col-span-8">

                                        <input type="text"
                                            name={"prod_loss_reason" + ele}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                onProductionDetailsChange(e)
                                            }}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            placeholder="" >

                                        </input>

                                    </div>
                                </div>
                            })
                        }

                    </div>


                    {/* model wise qty */}

                    <div className='col-span-12 p-1 mt-2 border border-slate-700 grid grid-cols-12'>

                        <div className="border border-slate-500 text-black  col-span-4 md:col-span-2  flex items-center justify-center font-semibold">
                            Qty. Modelwise
                        </div>

                        <div className="border border-slate-500 text-black  col-span-8 md:col-span-10  flex items-center justify-center font-semibold">
                            <input type="text"
                                name={"qty_modelwise"}
                                onChange={(e) => {
                                    e.preventDefault();
                                    onDetailsChange(e);
                                }}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                placeholder="" >

                            </input>
                        </div>

                    </div>


                    {/* Rejection */}
                    <div className='col-span-12 p-1 mt-2 border border-slate-700 grid grid-cols-12'>


                        {/* Process Rejection */}
                        <div className=" grid grid-cols-6 col-span-12 md:col-span-6 grid-rows-4">

                            <div className="border border-slate-500 text-black  col-span-3  flex items-center justify-center font-semibold">
                                Process rejection:
                            </div>

                            <div className="border border-slate-500 text-black  col-span-3  flex items-center justify-center font-semibold">
                                <input type="text"
                                    name={"process_rejection"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeRejections(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>

                            {/* title of process rejections */}

                            <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                Part Name
                            </div>
                            <div className="col-span-1 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                Qty.
                            </div>
                            <div className="col-span-3 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                Reason
                            </div>


                            {/* entiry 1st */}
                            <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                <input type="text"

                                    name={"rejection_partname_1"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeRejections(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>
                            <div className="col-span-1 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    name={"rejection_qty_1"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeRejections(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>
                            <div className="col-span-3 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    name={"rejection_reason_1"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeRejections(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>

                            {/* entries 2 */}
                            <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                <input type="text"
                                    name={"rejection_partname_2"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeRejections(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>
                            <div className="col-span-1 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    name={"rejection_qty_2"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeRejections(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>
                            <div className="col-span-3 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    name={"rejection_reason_2"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeRejections(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>

                        </div>

                        {/* vender rejection */}
                        <div className=" grid grid-cols-6 col-span-12 md:col-span-6 grid-rows-4 ">

                            <div className="border border-slate-500 text-black  col-span-3  flex items-center justify-center font-semibold">
                                Vender rejection:
                            </div>

                            <div className="border border-slate-500 text-black  col-span-3  flex items-center justify-center font-semibold">
                                <input type="text"

                                    name={"vender_rejection"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeRejections(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>


                            {/* title of process rejections */}

                            <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                Part Name
                            </div>
                            <div className="col-span-1 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                Qty.
                            </div>
                            <div className="col-span-3 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                Reason
                            </div>


                            {/* entiry 1st */}
                            <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                <input type="text"

                                    name={"vender_rejection_partname_1 "}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeRejections(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>
                            <div className="col-span-1 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    name={"vender_rejection_qty_1 "}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeRejections(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>
                            <div className="col-span-3 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    name={"vender_rejection_reason_1 "}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeRejections(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>

                            {/* entries 2 */}
                            <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                <input type="text"
                                    name={"vender_rejection_partname_2 "}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeRejections(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>
                            <div className="col-span-1 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    name={"vender_rejection_qty_2 "}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeRejections(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>
                            <div className="col-span-3 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    name={"vender_rejection_reason_2 "}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeRejections(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>

                        </div>
                    </div>

                    {/* QSR */}

                    <div className="col-span-12 grid grid-cols-12">
                        <div className=" border-slate-500 text-black  col-span-12  font-semibold">
                            QCR
                        </div>

                        <div className="col-span-8 grid grid-cols-7 grid-rows-3">

                            {/* title of QSR */}

                            <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                Part Name
                            </div>
                            <div className="col-span-1 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                Qty.
                            </div>
                            <div className="col-span-4 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                Reason
                            </div>

                            {/* Entries1 */}

                            {
                                [1, 2, 3].map(ele => {
                                    return <div className="col-span-8 grid grid-cols-7 " key={ele}>
                                        <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">

                                            <input type="text"
                                                name={"partname_" + ele}
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    onChangeQsr(e)
                                                }}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                                placeholder="" >

                                            </input>
                                        </div>


                                        <div className="col-span-1 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                            <input type="text"
                                                name={"qty_" + ele}
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    onChangeQsr(e)
                                                }}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                                placeholder="" >

                                            </input>
                                        </div>


                                        <div className="col-span-4 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                            <input type="text"
                                                name={"reason_" + ele}
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    onChangeQsr(e)
                                                }}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                                placeholder="" >

                                            </input>
                                        </div>
                                    </div>
                                })
                            }

                        </div>


                        <div className="col-span-4 grid grid-cols-4">
                            {/* A */}
                            <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                A
                            </div>
                            <div className="col-span-2 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    name={"a"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeQsr(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>

                            {/* P */}
                            <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                P
                            </div>
                            <div className="col-span-2 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    name={"p"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeQsr(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>

                            {/* Q */}
                            <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                Q
                            </div>
                            <div className="col-span-2 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    name={"q"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeQsr(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>

                            {/* QLE */}
                            <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                QLE
                            </div>
                            <div className="col-span-2 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    name={"qle"}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onChangeQsr(e)
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>
                        </div>

                    </div>


                    {/* Total Change Details */}
                    <div className="col-span-12 grid grid-cols-10 mt-2">

                        {/* Title of table change details */}

                        <div className=" border-slate-500 text-black  col-span-12  font-semibold">
                            Total Change Details
                        </div>

                        <div className="col-span-1 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                            Sr. No.
                        </div>

                        <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                            Machine
                        </div>

                        <div className="col-span-3 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                            Tool Description
                        </div>

                        <div className="col-span-1 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                            Tool Life
                        </div>

                        <div className="col-span-3 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                            Remarks
                        </div>

                        {/* entires 1 */}

                        {
                            [1, 2, 3, 4].map(ele => {
                                return <div className="col-span-12 grid grid-cols-10 " key={ele}>

                                    <div className="col-span-1 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                        <input type="text"
                                            name={"sr_no_" + ele}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                onTotalChangesDetails(e);
                                            }}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            placeholder="" >

                                        </input>
                                    </div>

                                    <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                        <input type="text"
                                            name={"machine_" + ele}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                onTotalChangesDetails(e);
                                            }}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            placeholder="" >

                                        </input>
                                    </div>

                                    <div className="col-span-3 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                        <input type="text"
                                            name={"tool_dec_" + ele}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                onTotalChangesDetails(e);
                                            }}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            placeholder="" >

                                        </input>
                                    </div>

                                    <div className="col-span-1 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                        <input type="text"
                                            name={"tool_life_" + ele}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                onTotalChangesDetails(e);
                                            }}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            placeholder="" >

                                        </input>
                                    </div>

                                    <div className="col-span-3 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                        <input type="text"
                                            name={"remark_" + ele}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                onTotalChangesDetails(e);
                                            }}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            placeholder="" >

                                        </input>
                                    </div>

                                </div>
                            })
                        }


                    </div>


                    {/* Communication and message */}
                    <div className="col-span-12 grid grid-cols-10 mt-2">

                        {/* Title */}

                        <div className=" border-slate-500 text-black  col-span-10  font-semibold">
                            Communication and Message
                        </div>

                        {
                            [1, 2, 3, 4].map(ele => {
                                return <div className="col-span-10 grid grid-cols-10 " key={ele}>

                                    <div className="col-span-3 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                        <input type="text"
                                            name={"sr_no_" + ele}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                onMessageChange(e);
                                            }}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            placeholder="" >

                                        </input>

                                    </div>
                                    <div className="col-span-7 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                        <input type="text"
                                            name={"message_" + ele}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                onMessageChange(e);
                                            }}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            placeholder="" >

                                        </input>
                                    </div>


                                </div>
                            })
                        }
                    </div>

                    <div className="flex justify-center space-x-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onAdd();
                            }}
                            className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                            Submit
                        </button>
                    </div>
                </div>

            </div >
        </>


    )
}

export default add