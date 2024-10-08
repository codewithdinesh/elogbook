import { useAuth } from '@/components/AuthUserContext'
import Loading from '@/components/Loading';
import NavBar from '@/components/NavBar';
import { storage } from '@/lib/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import Image from 'next/image';
import Router from 'next/router';

import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import DailyChart from './view/DailyChart';

const Sheet = ({ sheet }) => {

    const [images, setImages] = useState([]);
    const [Qle, setQle] = useState(0.0);
    const [Availability, setAvailability] = useState(0.0);
    const [Quality, setQuality] = useState(0.0);
    const [performance, setPerformance] = useState(0.0);



    useEffect(() => {
        console.log("A", parseFloat(sheet?.production?.total?.["total_a"]));
        console.log("P", parseFloat(sheet?.production?.total?.["total_p"]));
        console.log("Q", parseFloat(sheet?.production?.total?.["total_q"]));

        const total_p = parseFloat(sheet?.production?.total?.["total_p"]);
        const total_q = parseFloat(sheet?.production?.total?.["total_p"]);
        const total_a = parseFloat(sheet?.production?.total?.["total_a"]);

        const total_time = parseFloat(sheet?.production?.total?.["total_time"]);
        const total_production = parseFloat(sheet?.production?.total?.["total_production"]);

        const hrs_rate = parseFloat(sheet?.details.hr_rate);

        let a = 480 - total_a;
        let p = 480 - total_p;
        let q = 480 - total_q;

        setOle((a * p * q) / 1000000);

        console.log("hrs_rate" + hrs_rate)


        let performance = ((480 / 40) / 480 - total_p);

        console.log(performance)
        setPerformance(performance);

        let total_loss_time = parseFloat(sheet?.production?.total?.["total_time"]);

        const TotalAvailability = ((480 - total_loss_time) / 480) * 100;

        setAvailability(TotalAvailability);

        let total_actual_production = parseFloat(sheet?.production?.total?.["total_actual_production"]);
        let total_expected_production = parseFloat(sheet?.production?.total?.["total_production"]);

        setQuality(((total_expected_production - total_actual_production) / total_expected_production) * 100);

    }, []);





    // hrs details
    const hrs = [1, 2, 3, 4, 5, 6, 7, 8, "Tea I", "Lunch", "Tea II",];


    const getImageUrl = (ele, filename) => {
        const pathReference = ref(storage, filename);

        getDownloadURL(pathReference).then(val => {

            console.log(val);
            setImages(...images, {
                ele: val
            })
            return val;
        });


    }


    return (

        <>
            {/* <NavBar isHome={true} /> */}
            <div className="mx-auto container p-1">
                <ToastContainer />


                <div className="flex flex-col rounded-lg  p-1 sm:p-2 md:p-5 bg-white ">

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
                                    disabled
                                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "

                                    value={sheet?.date}
                                />
                            </div>
                        </div>

                        {/* Shift */}
                        <div className="border border-slate-500 text-black rounded-lg  col-span-6 md:col-span-2 p-1 m-1 h-24">
                            <h1 className=' font-semibold uppercase m-0'> Shift: </h1>

                            <option value="shift1" className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' defaultValue>
                                {sheet?.shift}
                            </option>

                        </div>


                        <div className=' col-span-12 md:col-span-8 grid  grid-cols-12  md:grid-cols-8 row-span-3 '>

                            {/* entries 1 */}
                            {/* Titles */}
                            <div className="border border-slate-500 text-black rounded-lg m-1  row-span-3 md:row-span-2 col-span-2 md:col-span-1 p-1 text-center flex items-center justify-center">Cell Name</div>

                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-2 p-2.5 flex items-center justify-center">Name</div>
                            <div className="border border-slate-500 text-black rounded-lg m-1  col-span-5 md:col-span-1 p-2.5 flex items-center justify-center">Sign</div>
                            <div className="border border-slate-500 text-black rounded-lg m-1 hidden md:flex col-span-3 p-2.5 items-center justify-center">Name</div>
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2 md:col-span-1 hidden md:flex p-2.5 items-center justify-center">Sign</div>

                            {/*  entrie 2 */}
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-2">

                                <input type="text"
                                    value={sheet?.details?.name1}
                                    disabled
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0">

                                </input>



                            </div>

                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-1">
                                <input type="text"
                                    value={sheet?.details?.sign1}
                                    disabled
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0">

                                </input>
                            </div>

                            {/* entries3 */}
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-3 ">

                                <input type="text"
                                    value={sheet?.details?.name2}
                                    disabled
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" >

                                </input>
                            </div>

                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-1 ">


                                <input type="text"
                                    value={sheet?.details?.sign2}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" >

                                </input>

                            </div>

                            {/* cell_index */}
                            <div className="border border-slate-500 text-black rounded-lg m-1  row-span-4 md:row-span-2 col-span-2 md:col-span-1 text-center flex items-center">
                                <input type="text"
                                    value={sheet?.details?.cell_index}
                                    disabled
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" >

                                </input>

                            </div>

                            {/*  entrie 4 */}
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-2">
                                <input type="text"
                                    value={sheet?.details?.name3}
                                    disabled
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" >

                                </input>
                            </div>

                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-1">
                                <input type="text"
                                    value={sheet?.details?.sign3}
                                    disabled
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0">

                                </input>
                            </div>

                            {/* entries 5 */}
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-3">

                                <input type="text"
                                    value={sheet?.details?.name4}
                                    disabled
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0">

                                </input>
                            </div>

                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-1">

                                <input type="text"
                                    value={sheet?.details?.sign4}
                                    disabled
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" >

                                </input>
                            </div>

                            {/*  entrie 6 */}
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-2">
                                <input type="text"
                                    value={sheet?.details?.name5}
                                    disabled
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0">

                                </input>
                            </div>

                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-1">
                                <input type="text"
                                    value={sheet?.details?.sign5}
                                    disabled
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0">

                                </input>
                            </div>

                            {/* entries 7 */}
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-3">

                                <input type="text"
                                    value={sheet?.details?.name6}
                                    disabled
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" >

                                </input>
                            </div>

                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-5 md:col-span-1">
                                <input type="text"
                                    value={sheet?.details?.sign6}
                                    disabled
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0">

                                </input>
                            </div>

                        </div>

                        {/* Overall details -shift ,hrs rate, manpower */}
                        <div className='col-span-12 grid md:col-span-4  grid-cols-4 row-span-3 '>

                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2 p-1 text-center flex items-center justify-center">Shift</div>

                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2 ">
                                <input type="text"
                                    value={sheet?.details?.shift}
                                    disabled
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"  >

                                </input>
                            </div>

                            {/* Hr rate */}
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2 p-1 text-center flex items-center justify-center">Hr. Rate</div>
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2">
                                <input type="text"
                                    disabled
                                    value={sheet?.details?.hr_rate}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0">

                                </input>
                            </div>

                            {/* manpower planned */}
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2 p-1 text-center flex items-center justify-center">

                                Manpower Planned

                            </div>
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2">
                                <input type="number"
                                    disabled
                                    value={sheet?.details?.manpower_planned}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" >

                                </input>
                            </div>


                            {/* manpower present */}
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2 p-1 text-center flex items-center justify-center">
                                Manpower Present
                            </div>
                            <div className="border border-slate-500 text-black rounded-lg m-1 col-span-2">
                                <input type="number"
                                    disabled
                                    value={sheet?.details?.manpower_present}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0" >
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
                        <div className='grid grid-cols-12 font-semibold  text-xs md:text-sm'>
                            <div className='grid grid-cols-6 col-span-5'>
                                <div className="border border-slate-500 text-black col-span-1 md:p-2.5 p-1">Hr.</div>
                                <div className="border border-slate-500 text-black col-span-1 md:p-2.5 p-1 overflow-hidden">Man / Hr</div>
                                <div className="border border-slate-500 text-black col-span-1  md:p-2.5 p-1 overflow-hidden">Models</div>
                                <div className="border border-slate-500 text-black  col-span-1  md:p-2.5 p-1 overflow-hidden">Prod.</div>
                                <div className="border border-slate-500 text-black  col-span-1 md:p-2.5 p-1 overflow-hidden"> Act. Prod.</div>
                                <div className="border border-slate-500 text-black  col-span-1 md: md:p-2.5 p-1 overflow-hidden">Prod. Loss</div>
                            </div>
                            <div className="border border-slate-500 text-black  col-span-1md:p-2.5 p-1 overflow-hidden">Area of mc.</div>
                            <div className="border border-slate-500 text-black  col-span-1 md:p-2.5 p-1 overflow-hidden">Effect on</div>
                            <div className="border border-slate-500 text-black  col-span-2 md:p-2.5 p-1 overflow-hidden">Loss criteria</div>
                            <div className="border border-slate-500 text-black  col-span-1 md:p-2.5 p-1 overflow-hidden">Loss Details</div>
                            <div className="border border-slate-500 text-black  col-span-1  md:p-2.5 p-1 overflow-hidden">Start timing </div>
                            <div className="border border-slate-500 text-black  col-span-1  md:p-2.5 p-1 overflow-hidden">stop timing</div>

                        </div>

                        {/* Data entries for production */}
                        {
                            hrs.map((ele) => {
                                return <div className='grid grid-cols-12 text-xs md:text-sm' key={ele}>

                                    <div className='grid grid-cols-6 col-span-5 text-xs '>

                                        {/* Hrs */}
                                        <div className="border border-slate-500 text-black  col-span-1  flex items-center justify-center font-semibold overflow-hidden">
                                            {ele}
                                        </div>


                                        {/* Man per hrs */}
                                        <div className="border border-slate-500 text-black  col-span-1 ">
                                            <input
                                                disabled
                                                className="h-full bg-gray-50 border border-gray-300 text-gray-900 text-sm p-1 focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={sheet?.production?.production["man_per_hr" + ele]}
                                            >
                                            </input>

                                        </div>

                                        {/* models */}
                                        <div className="border border-slate-500 text-black  col-span-1 ">
                                            <input
                                                disabled
                                                className="h-full bg-gray-50 border border-gray-300 p-1 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={sheet?.production?.production["models" + ele]}
                                            >
                                            </input>

                                        </div>

                                        {/* Production */}
                                        <div className="border border-slate-500 text-black   col-span-1">
                                            <input type="text"
                                                disabled
                                                value={sheet?.production?.production["production" + ele]}
                                                className="h-full bg-gray-50 border border-gray-300 p-1 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            >

                                            </input>
                                        </div>

                                        {/* Act. production */}
                                        <div className="border border-slate-500 text-black col-span-1">
                                            <input type="text"
                                                disabled
                                                value={sheet?.production?.production["actual_production" + ele]}
                                                className="bg-gray-50 border border-gray-300 p-1 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            >

                                            </input>
                                        </div>

                                        {/* Production loss */}
                                        <div className="border border-slate-500 text-black  col-span-1">

                                            <input
                                                disabled
                                                className="h-full bg-gray-50 border border-gray-300 p-1 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={sheet?.production?.production["production_loss" + ele]}
                                            >
                                            </input>


                                        </div>

                                    </div>

                                    <>
                                        {/* Area of mc */}
                                        <div className="border border-slate-500 text-black  col-span-1 ">
                                            <input
                                                disabled
                                                className="h-full bg-gray-50 border border-gray-300 p-1 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={sheet?.production?.production["area_of_mc" + ele]}
                                            >
                                            </input>

                                        </div>

                                        {/* Effect on */}


                                        <div className="border border-slate-500 text-black  col-span-1 h-full text-center ">

                                            <p
                                                className="bg-gray-50 border border-gray-300 p-1 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-full"
                                            >
                                                {sheet?.production?.production["effect_on" + ele]}


                                            </p>
                                        </div>

                                        {/* loss criteria */}
                                        <div className="border border-slate-500 text-black  col-span-2 h-full text-center ">

                                            <p
                                                className="bg-gray-50 border p-1 border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-full"
                                            >
                                                {sheet?.production?.production["loss_criteria" + ele]}


                                            </p>
                                        </div>

                                        {/* Production loss reason */}
                                        <div className="border border-slate-500 text-black  col-span-1 h-full ">

                                            <p
                                                className="bg-gray-50 border p-1 border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-full"
                                            >
                                                {sheet?.production?.production["production_loss_reason" + ele]}


                                            </p>

                                        </div>

                                        {/* start timing */}
                                        <div className="border border-slate-500 text-black   col-span-1">
                                            <input

                                                disabled
                                                value={sheet?.production?.production["start_timing" + ele]}

                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            >

                                            </input>
                                        </div>

                                        {/* stop timing */}
                                        <div className="border border-slate-500 text-black   col-span-1">
                                            <input
                                                disabled
                                                value={sheet?.production?.production["stop_timing" + ele]}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            >
                                            </input>
                                        </div>
                                    </>


                                    {/* Row 2 */}
                                    <>
                                        <div className='col-span-5'>

                                        </div>
                                        {/* Area of mc */}
                                        <div className="border border-slate-500 text-black  col-span-1 ">
                                            <input
                                                disabled
                                                className="h-full bg-gray-50 border border-gray-300 p-1 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={sheet?.production?.production["area_of_mc_2" + ele]}
                                            >
                                            </input>

                                        </div>

                                        {/* Effect on */}


                                        <div className="border border-slate-500 text-black  col-span-1 h-full text-center ">

                                            <p
                                                className="bg-gray-50 border border-gray-300 p-1 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-full"
                                            >
                                                {sheet?.production?.production["effect_on_2" + ele]}


                                            </p>
                                        </div>

                                        {/* loss criteria */}
                                        <div className="border border-slate-500 text-black  col-span-2 h-full text-center ">

                                            <p
                                                className="bg-gray-50 border p-1 border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-full"
                                            >
                                                {sheet?.production?.production["loss_criteria_2" + ele]}


                                            </p>
                                        </div>

                                        {/* Production loss reason */}
                                        <div className="border border-slate-500 text-black  col-span-1 h-full ">

                                            <p
                                                className="bg-gray-50 border p-1 border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-full"
                                            >
                                                {sheet?.production?.production["production_loss_reason_2" + ele]}


                                            </p>

                                        </div>

                                        {/* start timing */}
                                        <div className="border border-slate-500 text-black   col-span-1">
                                            <input

                                                disabled
                                                value={sheet?.production?.production["start_timing_2" + ele]}

                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            >

                                            </input>
                                        </div>

                                        {/* stop timing */}
                                        <div className="border border-slate-500 text-black   col-span-1">
                                            <input
                                                disabled
                                                value={sheet?.production?.production["stop_timing_2" + ele]}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            >
                                            </input>
                                        </div>
                                    </>


                                    {/* Row 3*/}
                                    <>
                                        <div className='col-span-5'>

                                        </div>
                                        {/* Area of mc */}
                                        <div className="border border-slate-500 text-black  col-span-1 ">
                                            <input
                                                disabled
                                                className="h-full bg-gray-50 border border-gray-300 p-1 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={sheet?.production?.production["area_of_mc_3" + ele]}
                                            >
                                            </input>

                                        </div>

                                        {/* Effect on */}


                                        <div className="border border-slate-500 text-black  col-span-1 h-full text-center ">

                                            <p
                                                className="bg-gray-50 border border-gray-300 p-1 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-full"
                                            >
                                                {sheet?.production?.production["effect_on_3" + ele]}


                                            </p>
                                        </div>

                                        {/* loss criteria */}
                                        <div className="border border-slate-500 text-black  col-span-2 h-full text-center ">

                                            <p
                                                className="bg-gray-50 border p-1 border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-full"
                                            >
                                                {sheet?.production?.production["loss_criteria_3" + ele]}


                                            </p>
                                        </div>

                                        {/* Production loss reason */}
                                        <div className="border border-slate-500 text-black  col-span-1 h-full ">

                                            <p
                                                className="bg-gray-50 border p-1 border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-full"
                                            >
                                                {sheet?.production?.production["production_loss_reason_3" + ele]}


                                            </p>

                                        </div>

                                        {/* start timing */}
                                        <div className="border border-slate-500 text-black   col-span-1">
                                            <input

                                                disabled
                                                value={sheet?.production?.production["start_timing_3" + ele]}

                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            >

                                            </input>
                                        </div>

                                        {/* stop timing */}
                                        <div className="border border-slate-500 text-black   col-span-1">
                                            <input
                                                disabled
                                                value={sheet?.production?.production["stop_timing_3" + ele]}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            >
                                            </input>
                                        </div>
                                    </>

                                </div>
                            })
                        }

                        <div className='grid grid-cols-12 font-semibold grid-rows-1'>

                            <div className='grid grid-cols-6 col-span-5'>

                                <div className="border border-slate-500 text-black col-span-1 md:col-span-1 md:p-2.5 p-1">Total</div>
                                <div className="border border-slate-500 text-black col-span-2 md:col-span-2 md:p-2.5 p-1">
                                </div>

                                {/* total production */}
                                <div className="border border-slate-500 text-black col-span-1 md:col-span-1 md:p-2.5 p-1">
                                    {sheet?.production?.total["total_production"]}
                                </div>

                                {/* Total actual production */}
                                <div className="border border-slate-500 text-black col-span-1 md:col-span-1 md:p-2.5 p-1">
                                    {sheet?.production?.total["total_actual_production"]}

                                </div>

                                {/* Total loss */}
                                <div className="border border-slate-500 text-black col-span-1 md:col-span-1 md:p-2.5 p-1">
                                    {sheet?.production?.total?.["total_loss"]}

                                </div>
                            </div>


                            <div className="border border-slate-500 text-black col-span-5 md:p-2.5 p-1">

                            </div>


                            {/* Total Time*/}
                            <div className="border border-slate-500 text-black col-span-2 md:p-2.5 p-1">
                                Total Time : {sheet?.production?.total?.["total_time"]}
                                (minutes)
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
                                disabled
                                value={sheet?.details?.qty_modelwise}
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
                                    disabled
                                    value={sheet?.rejections?.process_rejection}
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
                                    disabled
                                    value={sheet?.rejections?.rejection_partname_1}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>

                            <div className="col-span-1 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    disabled
                                    value={sheet?.rejections?.rejection_qty_1}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>

                            <div className="col-span-3 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    disabled
                                    value={sheet?.rejections?.rejection_reason}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>

                            {/* entries 2 */}
                            <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                <input type="text"
                                    disabled
                                    value={sheet?.rejections?.rejection_partname_2}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>

                            <div className="col-span-1 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    disabled
                                    value={sheet?.rejections?.rejection_qty_2}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>
                            <div className="col-span-3 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    disabled
                                    value={sheet?.rejections?.rejection_reason}
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
                                    disabled
                                    value={sheet?.rejections?.vender_rejection}
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
                                    disabled
                                    value={sheet?.rejections?.vender_rejection_partname_1}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>

                            <div className="col-span-1 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    disabled
                                    value={sheet?.rejections?.vender_rejection_qty_1}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>

                            <div className="col-span-3 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    disabled
                                    value={sheet?.rejections?.vender_rejection_reason_1}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>

                            {/* entries 2 */}
                            <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                <input type="text"
                                    disabled
                                    value={sheet?.rejections?.vender_rejection_partname_2}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>
                            <div className="col-span-1 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    disabled
                                    value={sheet?.rejections?.vender_rejection_qty_2}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>
                            <div className="col-span-3 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    disabled
                                    value={sheet?.rejections?.vender_rejection_reason_2}
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

                            {/* Entries1 */}

                            {
                                [1, 2, 3].map(ele => {
                                    return <div className="col-span-8 grid grid-cols-7 " key={ele}>
                                        <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">

                                            <input type="text"
                                                name={"partname_" + ele}
                                                disabled
                                                value={sheet?.qsr?.["partname_" + ele]}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                                placeholder="" >

                                            </input>
                                        </div>


                                        <div className="col-span-1 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                            <input type="text"
                                                disabled
                                                value={sheet?.qsr?.["qty_" + ele]}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                                placeholder="" >

                                            </input>
                                        </div>

                                        <div className="col-span-4 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                            <input type="text"
                                                disabled
                                                value={sheet?.qsr?.["reason_" + ele]}
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
                                    disabled
                                    value={sheet?.qsr?.a}
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
                                    disabled
                                    value={sheet?.qsr?.p}
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
                                    disabled
                                    value={sheet?.qsr?.q}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>

                            {/* OLE */}
                            <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                OLE
                            </div>
                            <div className="col-span-2 border border-slate-500 text-black  flex items-center justify-center font-semibold">
                                <input type="text"
                                    disabled
                                    value={sheet?.qsr?.ole}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                    placeholder="" >

                                </input>
                            </div>
                        </div>

                    </div>


                    {/* Tool Change Details */}
                    <div className="col-span-12 grid grid-cols-10 mt-2">

                        {/* Title of table change details */}

                        <div className=" border-slate-500 text-black  col-span-12  font-semibold">
                            Tool Change Details
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
                                            disabled
                                            value={sheet?.total_changes?.totalChanges["sr_no_" + ele]}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            placeholder="" >

                                        </input>
                                    </div>

                                    <div className="col-span-2 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                        <input type="text"
                                            disabled
                                            value={sheet?.total_changes?.totalChanges["machine_" + ele]}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            placeholder="" >

                                        </input>
                                    </div>

                                    {/* image */}
                                    <div className="col-span-3 border border-slate-500 text-black    flex items-center justify-center font-semibold h-auto">

                                        {
                                            sheet?.tool_changes?.toolImages[0]?.["description" + ele] ?
                                                <Image
                                                    src={
                                                        getImageUrl("files/fdc008d4-dc1c-4622-8069-f54f90d4bd26like-btn.png") || images[0].url
                                                    }
                                                    alt='tool-image'
                                                    className="h-14 w-14"
                                                    width={0}
                                                    height={0}
                                                >

                                                </Image> : <div className='h-full w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0'></div>
                                        }
                                    </div>

                                    <div className="col-span-1 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                        <input type="text"
                                            disabled
                                            value={sheet?.tool_changes?.toolChanges["tool_life_" + ele]}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            placeholder="" >

                                        </input>
                                    </div>

                                    <div className="col-span-3 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                        <input type="text"
                                            disabled
                                            value={sheet?.tool_changes?.toolChanges["remark_" + ele]}
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
                                            disabled
                                            value={sheet?.messages?.["sr_no_" + ele]}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            placeholder="" >

                                        </input>

                                    </div>
                                    <div className="col-span-7 border border-slate-500 text-black    flex items-center justify-center font-semibold">
                                        <input type="text"

                                            disabled
                                            value={sheet?.messages?.["message_" + ele]}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                            placeholder="" >

                                        </input>
                                    </div>
                                </div>
                            })
                        }
                    </div>

                    {/* submitted by */}
                    <div className=" grid grid-cols-10 col-span-12 md:col-span-6 grid-rows-1 mt-2 ">

                        <div className="border border-slate-500 text-black  col-span-3  flex items-center justify-center font-semibold">
                            Submitted by
                        </div>

                        <div className="border border-slate-500 text-black  col-span-7  flex items-center justify-center font-semibold">
                            <input type="text"
                                disabled
                                value={sheet?.submitted_by?.name + " ( " + sheet?.submitted_by?.email + " )"}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-0"
                                placeholder="" >

                            </input>
                        </div>
                    </div>
                </div>

            </div >

            {/* Graphs */}
            <div className="mx-auto container p-1  flex flex-col md:flex-row flex-wrap bg-white rounded-md justify-center ">

                {/* OLE */}
                <div className="">

                    <DailyChart value={Ole} maxValue={100} title={"OLE"} label={"OLE"} />
                </div>

                {/* Availibility */}
                <div className="">

                    <DailyChart value={Availability} maxValue={100} title={"Availability"} label={"Availability"} />
                </div>

                {/* Performance */}
                <div className="">

                    <DailyChart value={Performance} maxValue={100} title={"Performance"} label={"Performance"} />
                </div>

                {/* Quality */}
                <div className="">

                    <DailyChart value={Quality} maxValue={100} title={"Quality"} label={"Quality"} />
                </div>

                {/* Performance */}
                <div className="">

                    <DailyChart value={performance} maxValue={100} title={"Performance"} label={"Performance"} />
                </div>
            </div>
        </>


    )
}

export default Sheet;
