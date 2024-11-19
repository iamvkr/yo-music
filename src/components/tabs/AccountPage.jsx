import { UserCircleIcon } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { context } from '../../context/Context';
import { logoutUser } from '../../Appwrite/AuthService';
import toast from 'react-hot-toast';

const AccountPage = () => {
  const { user, setuser } = useContext(context);
  const [isLoading, setisLoading] = useState(false)
  const navigate = useNavigate();

  const handleLogout = async () => {
    setisLoading(true);
    const status = await logoutUser();
    if (!status) {
      toast.error("Something went wrong");
      setisLoading(false);
      return false;
    }
    toast.success("logout success")
    setuser({
      isLoggedIn: false,
      userData: null
    })
    setTimeout(() => {
      setisLoading(false);
      navigate("/auth/login");
    }, 2000);
  }

  useEffect(() => {
    if (user.isLoggedIn !== true) {
      navigate("/auth/login", { replace: true });
    }
  }, [])

  return (user.isLoggedIn &&
    <div className='p-2'>
      <h3 className='text-xl font-bold'>Profile</h3>

      <div className="h-32 border rounded-xl mt-4">
        <div className="profile_container flex h-32 items-center gap-x-4 px-4">
          <div className="iconContainer">
            <UserCircleIcon className='w-10 h-10' />
          </div>
          <div className="details flex  w-full justify-between">
            <div className="accountDetails">
              <div className="username text-2xl capitalize">Hello {user.userData.email.split("@")[0].replace(/\d+/g, '')},</div>
              <div className="email">{user.userData.email}</div>
            </div>
            <div className="logoutBtn">
              <button className='btn btn-error flex items-center' disabled={isLoading}
                onClick={() => { document.getElementById('logout_modal').showModal(); }}>
                {isLoading && <span className="loading loading-spinner loading-sm"></span>}
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* logout modal */}
      <dialog id="logout_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Logout?</h3>
          <p className="py-4">Are you sure to logout?</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn me-4">Cancel</button>
              <button className="btn" onClick={handleLogout}>Logout</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default AccountPage