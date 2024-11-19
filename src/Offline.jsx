import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'

const Offline = () => {
    const [isOffline, setisOffline] = useState(false);
    useEffect(() => {
        if (!window.navigator.onLine) {
            setisOffline(true)
        }
    }, [])
    
    return (isOffline &&
        <div className="fixed top-0 left-0 bg-zinc-800/70  h-screen w-full px-2 pt-4" role="alert" aria-labelledby="toast-message">
            <div className="bg-white text-zinc-800 p-2 border border-black rounded-xl">
                <div className="PWABadge-message mb-4">
                    <span className='font-bold text-xl'>Error Connecting!!</span><br />
                    <span className='text-md'>Check your connection and try again</span>
                </div>
                <div className="flex justify-end gap-x-4">
                    <button className="btn btn-success text-white" onClick={() => { window.location.reload() }}>Try Again</button>
                    {/* <button className="btn btn-success text-white">Close</button> */}
                </div>
            </div>
        </div>
    )
}

export default Offline