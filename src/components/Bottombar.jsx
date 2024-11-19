import { Home, ListMusic, PlusCircle, Search, UserCircle } from 'lucide-react'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Bottombar = () => {
    const location = useLocation();
    const { pathname } = location;
    const navigate = useNavigate();
    return (
        <div className="btm-nav max-w-md md:max-w-[70%] mx-auto">
            <button className={pathname === "/" ? "active" : ""}
                onClick={() => { navigate("/") }}>
                <span className={`px-4 py-1 rounded-full ${pathname === "/" && "bg-slate-300"}`}>
                    <Home className={`w-6 h-6 ${pathname === "/" && "dark:text-black"}`} type="solid" />
                </span>
                <span className="btm-nav-label">Home</span>
            </button>
            <button className={pathname === "/search" ? "active" : ""}
                onClick={() => { navigate("/search") }}>
                <span className={`px-4 py-1 rounded-full ${pathname === "/search" && "bg-slate-300"}`}>
                    <Search className={`w-6 h-6 ${pathname === "/search" && "dark:text-black"}`} />
                </span>
                <span className="btm-nav-label">Search</span>
            </button>
            <button className={pathname === "/playlist" ? "active" : ""}
                onClick={() => { navigate("/playlist") }}>
                <span className={`px-4 py-1 rounded-full ${pathname === "/playlist" && "bg-slate-300"}`}>
                    <ListMusic className={`w-6 h-6 ${pathname === "/playlist" && "dark:text-black"}`} />
                </span>
                <span className="btm-nav-label">Playlist</span>
            </button>
            <button className={pathname === "/account" ? "active" : ""}
                onClick={() => { navigate("/account") }}>
                <span className={`px-4 py-1 rounded-full ${pathname === "/account" && "bg-slate-300"}`}>
                    <UserCircle className={`w-6 h-6 ${pathname === "/account" && "dark:text-black"}`} />
                </span>
                <span className="btm-nav-label">Account</span>
            </button>
        </div>
    )
}

export default Bottombar