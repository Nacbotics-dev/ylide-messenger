import React from 'react';
import { Link,useLocation } from 'react-router-dom';

function IndexHeader(props) {
    const location = useLocation();
    const url = location.pathname.split('/')[1];
    return (

        <>
            {url !== "chats" &&
            <div className='absolute top-0 w-full p-5'>
                <Link to={"/"}>
                    <div className='w-full h-full max-w-[220px] lg:max-w-[300px]'>
                        <img className='w-full h-full' src="/Images/logo_long.svg" alt="" />
                    </div>
                </Link>
                
            </div>
            }
        </>
       
    );
}

export default IndexHeader;