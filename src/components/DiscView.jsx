import { Disc3 } from 'lucide-react'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const DiscView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (!(location.pathname.includes("/play/")) && sessionStorage.getItem("isPlay") === "true" &&
    <>
    <div className='fixed bottom-16 right-4 md:right-[20%] md:bottom-20'>
      <div onClick={() => {
        const path = sessionStorage.getItem("lastIdPlaying");
        if (!path) {
          return false;
        }
        navigate("/play" + path)
      }}>
        <Disc3 className='w-10 h-10 bg-slate-800 rounded-full animate-spin' />
      </div>
    </div>
    </>
  )
}

export default DiscView