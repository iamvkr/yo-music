import { useContext, useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './components/tabs/HomePage'
import SearchPage from './components/tabs/SearchPage'
import AccountPage from './components/tabs/AccountPage'
import PlaylistPage from './components/tabs/PlaylistPage'
import MobileView from './components/MobileView'
import Bottombar from './components/Bottombar'
import LoginSignup from './components/auth/LoginSignup'
import { Toaster } from 'react-hot-toast'
import Player from './components/pages/Player'
import PlaylistView from './components/pages/PlaylistView'
import { context } from './context/Context'
import DiscView from './components/DiscView'
import { getUser } from './Appwrite/AuthService'
import DesktopPopupView from './components/DesktopPopupView'
import PWABadge from './PWABadge'
import { AudioLines } from 'lucide-react'
import Offline from './Offline'

function App() {

  const { playerDetails,user, setuser } = useContext(context);

  useEffect(() => {
    /** BACKGROUND PLAY */
    const addBackgroundEvent = function () {
      // console.log("visisblity changed!!!");
      if (document.visibilityState === "hidden" && sessionStorage.getItem("isPlay") === "true") { //if music was playing
        setTimeout(function () {
          // play the video...
          playerDetails.play();
        }, 300);
      }
    }
    /** for background play */
    document.addEventListener("visibilitychange", addBackgroundEvent);

    if (user.isLoggedIn === undefined) {
      /** check for login status status */
      getUser().then(user => {
        if (user) {
          setuser({
            isLoggedIn: true,
            userData: user
          })
        } else {
          setuser({
            isLoggedIn: false,
            userData: null
          })
        }
      })
        .catch((err) => { })
    }

    return () => {
      document.removeEventListener("visibilitychange", addBackgroundEvent);
    }
  }, []);

  return (
    <MobileView>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/playlist' element={<PlaylistPage />} />
          <Route path='/account' element={<AccountPage />} />
          <Route path='/auth/login' element={<LoginSignup />} />

          <Route path='/play/song/:sid' element={<Player />} />
          <Route path='/play/playlist/:pid' element={<PlaylistView />} />
        </Routes>
        <Bottombar />
        <Toaster />
        <DiscView />
        {/* DESKTOP POPUP VIEW */}
        <DesktopPopupView />
        {/* PWA POPUP */}
        <PWABadge />
        {/* offline */}
        <Offline />
      </BrowserRouter>
    </MobileView>
  )
}

export default App
