import Image from 'next/image';
import React from 'react'

function pageNotFound() {
    return (
        <div className='flex justify-center p-5'>
            <Image
                src="/src/page_not_found.svg"
                // fill
                height={350}
                width={350}
                className='m-20'

            ></Image>

        </div>
    )
}

export default pageNotFound;