import React from 'react';
import "./wheelloader.css"

function WheelLoader(props) {
    return (
        <div className='min-h-screen grid place-content-center'>
            <div className='absolute w-full h-full flex flex-col justify-center top-0 bg-red-500 opacity-10 left-0 right-0'></div>
            <div className='w-full justify-center flex flex-col items-center'>
                <div className='loader-wrapper'>
                    <div className='loader'>
                        <div className='loader loader-inner'></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WheelLoader;