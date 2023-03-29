/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from '@/components/AuthUserContext'
import Loading from '@/components/Loading';
import NavBar from '@/components/NavBar';
import { auth, db, storage } from '@/lib/firebase';
import { addDoc, arrayUnion, collection, doc, setDoc } from 'firebase/firestore';
import Router from 'next/router';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { uuid } from 'uuidv4';



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

    const [toolDescription, setToolDescription] = useState({});

    // to hold total production,actual production, total time ,etc;
    const [total, setTotal] = useState({});

    const [progress, setProgress] = useState(0);

    const [toolImages, setImages] = useState([]);




    const onAdd = () => {

        console.log(details);

        console.log("Production", production);

        console.log("Total changes", totalChanges);


        date.split(' ').join('');
        console.log("Date: ", date)
        if (date == "" || date === "") {
            toast("Please select date");
        }
        else if (shift == "" || shift === "") {
            toast("Please select Shift");

        } else {

            // handleUpload();

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
        });

        // console.log(production)
    }

    const onCalculateTotal = () => {

        var total_production = 0, total_actual_production = 0, total_loss = 0, total_time = 0;

        var temp = new Date();

        var local_date1, local_date2;

        local_date1 = temp.toJSON().substring(0, 10);
        local_date2 = temp.toJSON().substring(0, 10);




        hrs.map(ele => {

            if (production["start_timing" + ele] > production["stop_timing" + ele]) {
                temp.setDate(temp.getDate() + 1);
                local_date2 = temp.toJSON().substring(0, 10);
            }

            // console.log(local_date1, local_date2);
            var prod = parseInt(production["production" + ele] || 0)
            var act_prod = parseInt(production["actual_production" + ele] || 0)
            var loss = parseInt(production["production_loss" + ele] || 0)
            var start_time = new Date(local_date1 + " " + production["start_timing" + ele]) || 0
            var stop_time = new Date(local_date2 + " " + production["stop_timing" + ele]) || 0
            var time = stop_time - start_time || 0;

            // console.log("start:", start_time)
            // console.log("stop:", stop_time)
            // console.log("time:", time);

            total_actual_production = act_prod + total_actual_production;
            total_production = total_production + prod;
            total_loss = total_loss + loss;
            total_time = time + total_time;


        });

        console.log("time:", total_time);

        setTotal({
            "total_production": total_production,
            "total_actual_production": total_actual_production,
            "total_loss": total_loss,
            "total_time": millisToMinutesAndSeconds(total_time)
        })

    }


    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
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

    const onToolDescriptionChange = (e) => {

        let name = e.target.name;
        let value = e.target.files[0];

        setToolDescription({
            ...toolDescription,
            [name]: value
        });
    }

    const handleUpload = async () => {

        const files = Object.entries(toolDescription);
        console.log(files);

        files.map(async (e) => {

            console.log(uuid());

            const fileName = uuid() + e[1]?.name;

            const storageRef = ref(storage, `/files/${fileName}`);

            const uploadTask = uploadBytesResumable(storageRef, e[1]);

            const name = e[0];

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );

                    // update progress
                    setProgress(percent);
                    console.log("uploading:", percent);
                    toast.done("" + percent)
                },

                (error) => console.log(error),

                (e) => {

                    console.log(uploadTask.snapshot.ref)

                    // await getDownloadURL(uploadTask.snapshot.ref).then(val => {
                    //     console.log(val);
                    //     toast.success("Images Upload Done.")
                    // });

                    console.log(uploadTask.snapshot.ref.fullPath);

                    setImages((toolImages) => (
                        [
                            ...toolImages,
                            { [name]: uploadTask.snapshot.ref.fullPath }
                        ]
                    ));


                },

                (error) => {
                    // failed to get download URL
                    toast.error("Something went wrong...");
                    console.log(error);
                }
            );
        }
        );
    }


    // add data to firebase firestore
    const addToFirebase = async () => {

        // production > date > cell > shift > data

        const ref = doc(db, `production`, date, details.cell_index, shift);

        onCalculateTotal();

        console.log(toolImages);
        // console.log(im);
        const data =
        {

            "date": date,
            "shift": shift,
            "details": details,
            "production":
            {
                production,
                total
            },
            "rejections": rejections,
            "qsr": qsr,
            "total_changes": {
                totalChanges,
                toolImages
            },
            "messages": messsages,
            "submitted_by": {
                email: auth.currentUser.email,
                name: auth.currentUser.displayName
            }

        };

        await setDoc(ref, data, { merge: true }).then(res => {

            toast("Data Added");
            // setExe(false);
            window.location.reload();


        }).catch(e => {
            toast("something went wrong..")

        });




    }


    // hrs details
    const hrs = [1, 2, 3, 4, 5, 6, 7, 8, "Tea I", "Lunch", "Tea II", "Total"];


    return (

        <>
            <NavBar isHome={true} />
            <div className=" mx-auto container  p-1">

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
                                <option value="shift2+OT">Shift2+OT</option>
                                <option value="Shift3+OT">Shift3+OT</option>

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
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                        placeholder="Enter Name..." required>

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
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                        placeholder="Enter Signature..." required>

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
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                        placeholder="Enter Name..." required>

                                    </input>
                                </div>

                                <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-1 ">


                                    <input
                                        type="text"
                                        name={"sign" + 2}
                                        onChange={e => onDetailsChange(e)}

                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                        placeholder="Enter Signature..." required>

                                    </input>

                                </div>

                            </>
                            {/*  cell index */}
                            <div className="border border-slate-500 text-black rounded-lg m-1  row-span-4 md:row-span-2 col-span-2 md:col-span-1 text-center flex items-center">
                                <select
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name="cell_index"
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onDetailsChange(e)
                                    }}
                                >
                                    <option value="" >select option</option>
                                    <option value="C3" >C3</option>
                                    <option value="C5">C5</option>
                                    <option value="C6">C6</option>

                                    <option value="B1">B1</option>
                                    <option value="B2">B2</option>
                                    <option value="B3">B3</option>
                                    <option value="B4">B4</option>
                                    <option value="B5">B5</option>

                                    <option value="H1">H1</option>
                                    <option value="H2">H2</option>
                                    <option value="H3">H3</option>
                                    <option value="H4">H4</option>
                                    <option value="H5">H5</option>
                                    <option value="H6">H6</option>
                                    <option value="H7">H7</option>
                                    <option value="H8">H8</option>


                                </select>

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
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                        placeholder="Enter Name..." required>

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
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                        placeholder="Enter Signature..." required>

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
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                        placeholder="Enter Name..." required>

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
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                        placeholder="Enter Signature..." required>

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
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                        placeholder="Enter  Name..." required>

                                    </input>
                                </div>

                                <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-1">
                                    <input type="text"
                                        name={"sign" + 5}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            onDetailsChange(e)
                                        }}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                        placeholder="Enter Signature..." required>

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
                                <select
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name="manpower_planned"
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onDetailsChange(e)
                                    }}
                                >
                                    <option value="">Select </option>
                                    <option value="1" >1</option>
                                    <option value="2" >2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>

                                </select>
                            </div>


                            {/* manpower present */}
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2 p-1 text-center flex items-center justify-center">
                                Manpower Present
                            </div>
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2">
                                <select
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name="manpower_present"
                                    onChange={(e) => {
                                        e.preventDefault();
                                        onDetailsChange(e)
                                    }}
                                >
                                    <option value="">Select </option>
                                    <option value="1" >1</option>
                                    <option value="2" >2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>

                                </select>

                            </div>

                        </div>

                    </div>

                    {/* Production */}
                    <div className=' col-span-12 p-1 mt-1 border border-slate-700 text-xs sm:text-sm md:text-base'>
                        <h1 className='text-black font-semibold'>
                            Production
                        </h1>

                        {/* Titles of production */}
                        <div className='grid grid-cols-12 font-semibold'>
                            <div className="border border-slate-500 text-black col-span-1 md:col-span-1 md:p-2.5 p-1">Hr.</div>
                            <div className="border border-slate-500 text-black col-span-1 md:col-span-1 md:p-2.5 p-1 overflow-hidden">Man/Hr</div>
                            <div className="border border-slate-500 text-black col-span-1 md:col-span-1 md:p-2.5 p-1 overflow-hidden">Models</div>
                            <div className="border border-slate-500 text-black  col-span-1 md:col-span-1 md:p-2.5 p-1 overflow-hidden">Prod.</div>
                            <div className="border border-slate-500 text-black  col-span-1 md:p-2.5 p-1 md:col-span-1 overflow-hidden"> Act. Prod.</div>
                            <div className="border border-slate-500 text-black  col-span-1 md:col-span-1 md:p-2.5 p-1 overflow-hidden">Prod. Loss</div>
                            <div className="border border-slate-500 text-black  col-span-1 md:col-span-1 md:p-2.5 p-1 overflow-hidden">Area of mc.</div>
                            <div className="border border-slate-500 text-black  col-span-1 md:col-span-1 md:p-2.5 p-1 overflow-hidden">Effect on</div>
                            <div className="border border-slate-500 text-black  col-span-1 md:col-span-1 md:p-2.5 p-1 overflow-hidden">Loss criteria</div>
                            <div className="border border-slate-500 text-black  col-span-1 md:col-span-1 md:p-2.5 p-1 overflow-hidden">Loss Details</div>
                            <div className="border border-slate-500 text-black  col-span-1 md:col-span-1 md:p-2.5 p-1 overflow-hidden">Start timing </div>
                            <div className="border border-slate-500 text-black  col-span-1 md:col-span-1 md:p-2.5 p-1 overflow-hidden">stop timing</div>

                        </div>

                        {/* Data entries for production */}
                        {
                            hrs.map((ele) => {

                                return <div className='grid grid-cols-12' key={ele}>

                                    {/* Hrs */}
                                    <div className="border border-slate-500 text-black  col-span-1 md:col-span-1  flex items-center justify-center font-semibold" >
                                        {ele}
                                    </div>



                                    <>

                                        {/* Man per hrs */}
                                        <div className="border border-slate-500 text-black  col-span-1 h-full">
                                            <select
                                                className="bg-gray-50 border border-gray-300 text-gray-900 h-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                name={"man_per_hr" + ele}
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    onProductionDetailsChange(e);
                                                }}>

                                                <option value="">Select </option>
                                                <option value="1" >1</option>
                                                <option value="2" >2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>

                                            </select>

                                        </div>

                                        {/* models */}
                                        <div className="border border-slate-500 text-black  col-span-1 ">
                                            <select
                                                className="bg-gray-50 border border-gray-300 h-full text-gray-900   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                name={"models" + ele}
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    onProductionDetailsChange(e);
                                                }}>

                                                <option value="">Select </option>
                                                <option value="Jy" >Jy</option>
                                                <option value="K10" >K10</option>
                                                <option value="Ju">Ju</option>
                                                <option value="JL">JL</option>

                                            </select>

                                        </div>

                                        {/* Production */}
                                        <div className="border border-slate-500 text-black   col-span-1 h-full">
                                            <input type="text"
                                                name={"production" + ele}
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    onProductionDetailsChange(e)
                                                }}
                                                className="bg-gray-50 border border-gray-300 text-gray-900  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                                placeholder="" >

                                            </input>
                                        </div>

                                        {/* Act. production */}
                                        <div className="border border-slate-500 text-black col-span-1 h-full">
                                            <input type="text"
                                                name={"actual_production" + ele}
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    onProductionDetailsChange(e)
                                                }}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                                placeholder="" >

                                            </input>
                                        </div>

                                        {/* Production loss */}
                                        <div className="border border-slate-500 text-black  col-span-1 h-full ">

                                            <select
                                                className="bg-gray-50 border h-full border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                name={"production_loss" + ele}

                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    onProductionDetailsChange(e);
                                                }}

                                            >

                                                <option value={0}>Select </option>
                                                <option value={production[`production${ele}`] - production[`actual_production${ele}`] || 0}>
                                                    {production[`production${ele}`] - production[`actual_production${ele}`] || 0}
                                                </option>
                                            </select>


                                        </div>


                                        {/* Area of mc */}
                                        <div className="border border-slate-500 text-black  col-span-1 h-full ">
                                            <Select
                                                id={ele + "random"}
                                                instanceId={ele + "random"}
                                                className='text-xs h-full w-full'

                                                // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                // name={"area_of_mc" + ele}
                                                options={
                                                    [
                                                        { label: "All cell", value: "All cell" },
                                                        { label: "Input", value: "Input" },
                                                        { label: "Induction heating machine", value: "Induction heating machine" },
                                                        { label: "Makino LH", value: "Makino LH" },
                                                        { label: "Makino RH", value: "Mkaino RH" },
                                                        { label: "FRD LH", value: "FRD LH" },
                                                        { label: "FRD RH", value: "FRD RH" },
                                                        { label: "Washing machine", value: "Washing machine" },
                                                        { label: "Both makino", value: "Both makino" },
                                                        { label: "Plug fitting", value: "Plug fitting" },
                                                        { label: "leak test and pipe press", value: "leak test and pipe press" },
                                                        { label: "Nozzle press machine", value: "Nozzle press machine" },
                                                        { label: "Convyor", value: "Convyor" },

                                                    ]
                                                }
                                                onChange={(e) => {

                                                    const d = {
                                                        target: {
                                                            value: e.value,
                                                            name: "area_of_mc" + ele
                                                        }
                                                    }
                                                    onProductionDetailsChange(d);
                                                }}>
                                            </Select>

                                        </div>

                                        {/* Effect on */}
                                        <div className="border border-slate-500 text-black  col-span-1 h-full ">
                                            <select
                                                className="bg-gray-50 border h-full border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                name={"effect_on" + ele}
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    onProductionDetailsChange(e);
                                                }}>

                                                <option value="">Select </option>
                                                <option value="A" >A</option>
                                                <option value="P" >P</option>
                                                <option value="Q"> Q</option>
                                                <option value="Shutdown">Shutdown</option>
                                                <option value="Other">Other</option>
                                            </select>

                                        </div>

                                        {/* loss criteria */}
                                        <div className="border border-slate-500 text-black  col-span-1 h-full">
                                            <select
                                                className="bg-gray-50 border border-gray-300 h-full text-gray-900  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                name={"loss_criteria" + ele}
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    onProductionDetailsChange(e);
                                                }}>


                                                {
                                                    production["effect_on" + ele] == "A" ? <>
                                                        <option value="">Select </option>
                                                        <option value="Equipment Failure loss" >Equipment Failure loss</option>
                                                        <option value="Setup and Adjustment" >Setup and Adjustment</option>
                                                        <option value="Tool Change loss"> Tool Change loss</option>
                                                        <option value="Measure and Adjust loss">Measure and Adjust loss</option>
                                                        <option value="Defect loss">Defect loss</option>
                                                        <option value="Management loss">Management loss</option>

                                                    </>
                                                        : production["effect_on" + ele] == "P" ?
                                                            <>
                                                                <option value="">Select </option>
                                                                <option value="Minor stopages" >Minor stopages</option>
                                                                <option value="Speed loss" >Speed loss</option>
                                                                <option value="motion loss"> motion loss</option>

                                                            </> : production["effect_on" + ele] == "Q" ?
                                                                <>
                                                                    <option value="">Select </option>
                                                                    <option value="Rejection" >Rejection</option>
                                                                    <option value="Vender rejection" >Vender Rejection</option>

                                                                </> : production["effect_on" + ele] == "Shutdown" ?
                                                                    <>
                                                                        <option value="">Select </option>
                                                                        <option value="PDT" > PDT</option>


                                                                    </> : production["effect_on" + ele] == "Other" ?
                                                                        <>
                                                                            <option value="">Select </option>
                                                                            <option value="Others" > Others</option>
                                                                        </> : null
                                                }
                                            </select>
                                        </div>

                                        {/* Production loss reason */}
                                        <div className="border border-slate-500 text-black  col-span-1 h-full ">

                                            <select
                                                className="bg-gray-50 border border-gray-300 h-full text-gray-900   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                name={"production_loss_reason" + ele}
                                                onChange={
                                                    (e) => {
                                                        e.preventDefault();
                                                        onProductionDetailsChange(e);
                                                    }
                                                }
                                            >
                                                {
                                                    production["loss_criteria" + ele] == "Tool Change loss" ?
                                                        <>
                                                            <option value="">Select </option>
                                                            <option value="FRD LH" > FRD LH </option>
                                                            <option value="FRD RH" >FRD RH</option>
                                                            <option value="Makino LH" >Makino LH </option>
                                                            <option value="Makino RH" >Makino RH</option>

                                                        </> : production["loss_criteria" + ele] == "Equipment Failure loss" ?
                                                            <>
                                                                <option value="">Select </option>
                                                                <option value="Convyor not work" > Convyor not work</option>
                                                                <option value="Air leakage" >Air leakage</option>
                                                                <option value="Auto door Prob" >Auto door Prob</option>
                                                                <option value="R face height Prob" >R face height Prob</option>
                                                                <option value="Auto power failure" > Auto door Power failure </option>
                                                                <option value="Hyd. Oil level low" >Hyd.oil level low</option>
                                                                <option value="Lub.oil level low" >Lub.oil level low </option>
                                                                <option value="Oriation sensor fail" >Oriation sensor fail</option>
                                                                <option value="Over current fault" > Over current fault </option>
                                                                <option value="Feed hold" >Feed hold</option>
                                                                <option value="Coan cleaning" >Coan cleaning</option>
                                                                <option value="T commander Error" >T commander Error</option>

                                                            </> : production["loss_criteria" + ele] == "Management loss" ?
                                                                <>
                                                                    <option value="">Select </option>
                                                                    <option value="No man power" > No man power </option>
                                                                    <option value="No Air" >No Air</option>
                                                                    <option value="No material" > No material</option>
                                                                    <option value="No plan" > No plan</option>
                                                                    <option value="No Empty bin" > No Empty bin</option>

                                                                </> : production["loss_criteria" + ele] == "Defect loss" ?
                                                                    <>
                                                                        <option value="">Select </option>
                                                                        <option value="Random" > Random </option>
                                                                        <option value="B type Defect" > B type Defect</option>



                                                                    </> : production["loss_criteria" + ele] == "Minor stopages" ?
                                                                        <>
                                                                            <option value="">Select </option>
                                                                            <option value="Probe Out of Tol" > Probe out of Tol</option>
                                                                            <option value="M.C feed hold" >M.C feed hold</option>
                                                                            <option value="Tool life over" >Tool life over </option>
                                                                            <option value="Probe start up failure" >Probe start up failure</option>
                                                                            <option value="Pallet ready prob" > Pallet ready prob </option>
                                                                            <option value="Sl upper limit alarm" >Sl upper limit alarm</option>
                                                                            <option value="Tool life over" >Tool life over </option>
                                                                            <option value="Seal change" >Seal change</option>
                                                                            <option value="Seat check Prob" >Seat check Prob</option>

                                                                        </> : production["loss_criteria" + ele] == "Speed loss" ?
                                                                            <>
                                                                                <option value="">Select </option>
                                                                                <option value="Tool parameters change" > Tool parameters change </option>
                                                                                <option value="M.C parameters change" > M.C parameters change</option>

                                                                            </> : production["loss_criteria" + ele] == "motion Loss" ?
                                                                                <>
                                                                                    <option value="">Select </option>
                                                                                    <option value="Layout change" > Layout change </option>
                                                                                    <option value="Blanceing change" > Blanceing change</option>

                                                                                </> : production["loss_criteria" + ele] == "Vender rejection" ?
                                                                                    <>

                                                                                        <option value="C.D" > C.D </option>
                                                                                        <option value="Operation missing" >Operation missing</option>
                                                                                        <option value="Input Dent" >Input Dent </option>

                                                                                    </> : production["loss_criteria" + ele] == "Rejection" ?
                                                                                        <>
                                                                                            <option value="">Select </option>
                                                                                            <option value="Milling face dent" > Milling face dent </option>

                                                                                        </> : production["loss_criteria" + ele] == "PDT" ?
                                                                                            <>
                                                                                                <option value="">Select </option>
                                                                                                <option value="No Input material" > No Input material </option>
                                                                                                <option value="No Engine Plan" > No Engine Plan</option>
                                                                                                <option value="No Empty Bin" > No Empty Bin </option>


                                                                                            </> : production["loss_criteria" + ele] == "Others" ?
                                                                                                <>
                                                                                                    <option value="">Select </option>
                                                                                                    <option value="Start up/ warm up/ daily jh" > Start up/ warm up/ daily Jh</option>
                                                                                                    <option value="single side running" >Single side running</option>
                                                                                                    <option value="Break work other cell" >Break work other cell </option>
                                                                                                    <option value="Inventory clear" > Inventory clear </option>
                                                                                                    <option value="New model trial" >New model trial</option>
                                                                                                    <option value="weekly jh makino & Frd" >weekly jh makino & frd</option>
                                                                                                    <option value="Robo C.D MLH" > Robo C.D MLH</option>
                                                                                                    <option value="Robo c.D. MRH" >Robo C.D MRH</option>
                                                                                                    <option value="Robo C.D Frd RH" > Robo C.D Frd RH </option>
                                                                                                    <option value="Robo C.D Frd LH" > Robo C.D Frd LH </option>
                                                                                                    <option value="Robo C.D Frd RH" >Robo C.D Frd RH</option>
                                                                                                    <option value="New man Training" > New man Training </option>
                                                                                                </> : null
                                                }

                                            </select>

                                        </div>

                                        {/* start timing */}
                                        <div className="border border-slate-500 text-black h-full   col-span-1">
                                            <input
                                                type='time'
                                                name={"start_timing" + ele}
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    onProductionDetailsChange(e)
                                                }}
                                                className="bg-gray-50 border border-gray-300 text-gray-900   focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                                placeholder="" >

                                            </input>
                                        </div>

                                        {/* stop timing */}
                                        <div className="border border-slate-500 text-black h-full   col-span-1">
                                            <input
                                                type='time'
                                                name={"stop_timing" + ele}
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    onProductionDetailsChange(e)
                                                }}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                                placeholder="" >
                                            </input>
                                        </div>


                                    </>

                                </div>
                            })
                        }

                        <div className='grid grid-cols-12 font-semibold grid-rows-1'>

                            <div className="border border-slate-500 text-black col-span-1 p-1  overflow-hidden">Total</div>
                            <div className="border border-slate-500 text-black col-span-2 p-1">
                                <button
                                    type="button"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 border border-blue-700 rounded text-xs md:text-base w-full overflow-hidden"

                                    onClick={(e) => {
                                        e.preventDefault();
                                        onCalculateTotal();
                                    }}>
                                    Calculate Total
                                </button>

                            </div>

                            {/* total production */}
                            <div className="border border-slate-500 text-black col-span-1 md:p-2.5 p-1">
                                {total.total_production}
                            </div>

                            {/* Total actual production */}
                            <div className="border border-slate-500 text-black col-span-1 md:col-span-1 md:p-2.5 p-1">
                                {total.total_actual_production}
                            </div>

                            {/* Total loss */}
                            <div className="border border-slate-500 text-black col-span-1 md:col-span-1 md:p-2.5 p-1">
                                {total.total_loss}
                            </div>

                            <div className="border border-slate-500 text-black col-span-4 md:p-2.5 p-1">

                            </div>


                            {/* Total Time*/}
                            <div className="border border-slate-500 text-black col-span-2 md:p-2.5 p-1">
                                Total Time : {total.total_time || 0} (minutes)
                            </div>


                        </div>



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

                                    name={"vender_rejection_partname_1"}
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
                                    name={"vender_rejection_qty_1"}
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
                                    name={"vender_rejection_reason_1"}
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
                                    name={"vender_rejection_partname_2"}
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
                                    name={"vender_rejection_qty_2"}
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
                                    name={"vender_rejection_reason_2"}
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
                            QSR
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
                            [1, 2, 3, 4, "submit"].map(ele => {
                                return <div className="col-span-12 grid grid-cols-10 " key={ele}>

                                    <div className="col-span-1 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                        {
                                            ele != "submit" ?
                                                <input type="text"
                                                    name={"sr_no_" + ele}
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        onTotalChangesDetails(e);
                                                    }}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                                    placeholder="" >

                                                </input> : null
                                        }


                                    </div>

                                    <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">

                                        {
                                            ele != "submit" ?
                                                <input type="text"
                                                    name={"machine_" + ele}
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        onTotalChangesDetails(e);
                                                    }}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                                    placeholder="" >

                                                </input> : null
                                        }
                                    </div>

                                    <div className="col-span-3 border border-slate-500 text-black dark:bg-gray-700   flex items-center justify-center font-semibold">
                                        {
                                            ele != "submit" ?

                                                <div className="flex justify-center">
                                                    <div className="m-1 w-full">
                                                        <input
                                                            className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 dark:border-neutral-600 bg-clip-padding py-[0.32rem] px-3 text-base font-normal text-neutral-700 dark:text-neutral-200 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 dark:file:bg-neutral-700 file:px-3 file:py-[0.32rem] file:text-neutral-700 dark:file:text-neutral-100 file:transition file:duration-150 file:ease-in-out file:[margin-inline-end:0.75rem] file:[border-inline-end-width:1px] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-[0_0_0_1px] focus:shadow-primary focus:outline-none"
                                                            type="file"
                                                            accept="image/*"
                                                            name={'description' + ele}
                                                            onChange={(e) => {
                                                                e.preventDefault();
                                                                onToolDescriptionChange(e)
                                                            }}
                                                            id="formFile" >

                                                        </input>
                                                    </div>
                                                </div> :

                                                <button
                                                    type="button"
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"

                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleUpload();

                                                    }}>
                                                    Upload Images
                                                </button>


                                        }
                                    </div>

                                    <div className="col-span-1 border border-slate-500 text-black    flex items-center justify-center font-semibold">

                                        {
                                            ele != "submit" ?
                                                <input type="text"
                                                    name={"tool_life_" + ele}
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        onTotalChangesDetails(e);
                                                    }}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                                    placeholder="" >

                                                </input> : null
                                        }
                                    </div>

                                    <div className="col-span-3 border border-slate-500 text-black    flex items-center justify-center font-semibold">

                                        {
                                            ele != "submit" ?
                                                <input type="text"
                                                    name={"remark_" + ele}
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        onTotalChangesDetails(e);
                                                    }}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                                    placeholder="" >

                                                </input> : null
                                        }

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

                    {/* {
                        progress ?
                            <div className="w-full bg-neutral-200 dark:bg-red-500 m-1">
                                <div
                                    className="bg-primary p-0.5 text-center text-xs font-medium leading-none text-primary-100"
                                >
                                    {progress}
                                </div>
                            </div>
                            : null
                    } */}

                    <div className="flex justify-center space-x-2 m-1">
                        <button
                            type="button"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"

                            onClick={(e) => {
                                e.preventDefault();
                                onAdd();


                            }}>
                            Submit
                        </button>
                    </div>
                </div >

            </div >
        </>


    )
}

export default add
