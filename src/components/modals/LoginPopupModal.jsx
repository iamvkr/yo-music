import React from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPopupModal = () => {
    const navigate = useNavigate();
  return (
    <div>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <dialog id="login_popup_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Login to Enjoy</h3>
            <div className="py-4">
              <p className='flex items-center gap-x-2 my-2'>
                <input type="checkbox" checked={true} className="checkbox" onChange={() => { }} /> Direct song searches
              </p>
              <p className='flex items-center gap-x-2 my-2'>
                <input type="checkbox" checked={true} className="checkbox" onChange={() => { }} /> Save Unlimited Songs
              </p>
              <p className='flex items-center gap-x-2 my-2'>
                <input type="checkbox" checked={true} className="checkbox" onChange={() => { }} /> Save Unlimited Playlist
              </p>
            </div>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn me-4 rounded-full w-24">Close</button>
                <button className="btn btn-success rounded-full w-24 text-black" onClick={() => { navigate("/auth/login") }}>Login</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
  )
}

export default LoginPopupModal