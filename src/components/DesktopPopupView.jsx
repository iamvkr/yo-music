import React, { useState } from 'react'

const DesktopPopupView = () => {
    const [isOpen, setisOpen] = useState(true)
    const hidePopUp = ()=>{
        setisOpen(false);
    }
    return (isOpen &&
        <div className="hidden lg:block fixed h-screen w-full bg-black/80 top-0 left-0">
            <div className='h-screen w-full flex flex-col items-center justify-center'>
                <div className='bg-black p-4 text-center rounded-xl'>
                    <h3 className='max-w-md text-center font-bold mb-4'>This web app is not Well Designed for Desktop or large device! Best viewed on smaller device</h3>
                    <button className='btn btn-success rounded-full' onClick={hidePopUp}>Continue Anyways</button>
                </div>
            </div>
        </div>
    )
}

export default DesktopPopupView