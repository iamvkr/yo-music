import { Eye, EyeOff, Mail } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { validateInputs } from '../../utils/validateInputs';
import toast from 'react-hot-toast';
import { context } from '../../context/Context';
import { getUser, loginUser, signupUser } from '../../Appwrite/AuthService';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
    const [isLoginmode, setisLoginmode] = useState(true);
    const { user, setuser } = useContext(context);
    const [formData, setformData] = useState({ email: "", password: "" });
    const [isEyeOpen, setisEyeOpen] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const navigate = useNavigate();

    const handleFormChange = (e) => {
        setformData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const { email, password } = formData;
        const validation = validateInputs(email, password);
        if (!validation.status) {
            toast.error(validation.message);
            return false;
        }
        // if inputs are valid: check login mode:
        if (isLoginmode) {
            handleLogin(email, password);// login
        } else {
            handleSignup(email, password);//signup
        }
    }

    const handleLogin = async (email, password) => {
        setisLoading(true);
        const user = await loginUser(email, password);
        if (user) {
            // login success:
            // now get user and save in store:
            const user = await getUser();
            if (user) {
                toast.success("Login success!")
                setuser({
                    isLoggedIn: true,
                    userData: user
                })
                navigate("/account", { replace: true });
            } else {
                toast.error("Invalid Credentials!")
            }
        } else {
            toast.error("Invalid Credentials!")
        }
        setisLoading(false);
    }

    const handleSignup = async (email, password) => {
        setisLoading(true);
        const user = await signupUser(email, password);
        if (user) {
            // user contain all requuied details
            toast.success("Signup Success! Login into Your Account");
            // just change the mode:
            setisLoginmode(true);
        } else {
            toast.error("Signup failed! Rerty!")
        }
        setisLoading(false);
    }

    useEffect(() => {
        if (user.isLoggedIn === true) {
            navigate("/account", { replace: true });
        }
    }, [])
    
    return (
        <div className='p-2'>
            <h3 className="font-bold text-lg my-4 text-center">{isLoginmode ? "Login" : "Register"}</h3>

            <form onSubmit={handleSubmit}>
                <div className="AuthContainer flex flex-col gap-y-4">
                    <label className="input input-bordered flex items-center gap-2">
                        <Mail className="h-4 w-4 opacity-70" />
                        <input type="email" className="grow" placeholder="Email" name='email' onChange={handleFormChange} />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <div onClick={() => { setisEyeOpen(!isEyeOpen) }}>
                            {isEyeOpen ? <Eye className="h-4 w-4 opacity-70" />
                                :
                                <EyeOff className="h-4 w-4 opacity-70" />}
                        </div>
                        <input type={!isEyeOpen ? "password" : "text"} className="grow" placeholder='password' name='password' 
                        onChange={handleFormChange} />
                    </label>
                    <button className='btn btn-success' disabled={isLoading}>
                        {isLoading && <span className="loading loading-spinner loading-sm"></span>}
                        <span>{isLoginmode ? "Login" : "Register"}</span>
                    </button>
                </div>
                <div className='text-center mt-6'>
                    {isLoginmode ? <div>Do not have Account? <span className='underline ms-2 font-bold'
                        onClick={() => { setisLoginmode(!isLoginmode) }}>Register</span></div>
                        :
                        <div>Already have Account? <span className='underline ms-2 font-bold'
                            onClick={() => { setisLoginmode(!isLoginmode) }}>Login</span></div>}
                </div>
            </form>

        </div>
    )
}

export default LoginSignup