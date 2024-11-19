import { AudioLines, MonitorDown, Moon, Sun, X } from 'lucide-react'
import React, { useState } from 'react'

const Navbar = () => {
    const [insData, setinsData] = useState("");
    const instructions = {
        Android: <p>
            <ul className='list-disc ms-4'>
                <li>Open the Google Chrome browser on your Android device.</li>
                <li>Tap the menu button (usually represented by three vertical dots) located in the top right corner of the browser.</li>
                <li>In the menu, scroll down and look for the "Add to Home screen" option. Tap on it.</li>
                <li>A pop-up window will appear, displaying the app's name and icon.</li>
                <li>Tap the "Add" button or "Add to Home screen" to confirm.</li>
                <li>The App will be installed on your device and added to your home screen as an app icon.</li>
            </ul>
        </p>,
        iOS: <p>
            <ul className='list-disc ms-4'>
                <li>Open the Safari web browser on your iOS device.</li>
                <li>tap the Share button at the bottom center of the screen.</li>
                <li>In the Share menu, locate the "Add to Home Screen" option. Tap on it.</li>
                <li>You will be prompted to customize the name of the app</li>
                <li>Tap the Add button in the screen's upper-right corner.</li>
                <li>The App will be installed on your device and added to your home screen as an app icon.</li>
            </ul>
        </p>,
        Mac_Win: <p>
            <ul className='list-disc ms-4'>
                <li>Open the Google Chrome browser.</li>
                <li>Tap the menu button (usually represented by three vertical dots or Bars) located in the top right corner of the browser.</li>
                <li>In the menu, scroll down and look for the "Add to Home screen" option. Tap on it.</li>
                <li>A pop-up window will appear, displaying the app's name and icon.</li>
                <li>Tap the "Add" button or "Add to Home screen" to confirm.</li>
                <li>The App will be installed on your device and added to your home screen as an app icon.</li>
            </ul>
        </p>
    }
    return (
        <>
            <div className="navbar bg-base-100 flex justify-between items-center">
                <div className="font-bold flex gap-x-2">
                    <div className="border-2 p-2 rounded-xl bg-success text-black">
                        <AudioLines className='w-6 h-6 md:w-8 md:h-8' />
                    </div>
                    <span className='text-2xl'>
                        Yo Music
                    </span>

                </div>

                <div className="More_container">

                    <label className="hidden swap swap-rotate"> {/* hidden */}
                        
                        {/* this hidden checkbox controls the state */}
                        <input type="checkbox" />

                        <Moon className="swap-on h-8 w-8" />
                        <Sun className="swap-off h-8 w-8" />

                    </label>
                    <MonitorDown className='h-7 w-7 ms-4' onClick={() => {
                        document.getElementById('download_modal').showModal()
                    }} />
                </div>
            </div>

            {/* INSTALL MODAL */}
            <div>
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <dialog id="download_modal" className="modal">
                    <div className="modal-box">
                        <div className='flex justify-between items-center'>
                        <h3 className="font-bold text-lg">Install the App</h3>
                        <X onClick={()=>{document.getElementById("download_modal").close()}}/>
                        </div>
                        <p className="py-4">
                            Hi, If You Are Enjoying the App, consider installing the app from your browser in one click!
                            Choose Your device below to see the instruction for installing the app.
                            {/* {instructions.Android} */}
                        </p>
                        <div className="modal-action">
                            <form method="dialog" className='flex'>
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn me-1 md:me-4" onClick={() => {
                                    setinsData(instructions.Android);
                                    document.getElementById("instruction_modal").showModal();
                                }}>Android</button>
                                <button className="btn me-1 md:me-4" onClick={() => {
                                    setinsData(instructions.iOS);
                                    document.getElementById("instruction_modal").showModal();
                                }}>iOS</button>
                                <button className="btn me-1 md:me-4" onClick={() => {
                                    setinsData(instructions.Mac_Win);
                                    document.getElementById("instruction_modal").showModal();
                                }}>Mac</button>
                                <button className="btn" onClick={() => {
                                    setinsData(instructions.Mac_Win);
                                    document.getElementById("instruction_modal").showModal();
                                }}>Windows</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>

            {/* INSTRUCTION MODAL */}
            <div>
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <dialog id="instruction_modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Instructions</h3>
                        <p className="py-4">
                            {insData}
                        </p>
                        <div className="modal-action">
                            <form method="dialog">
                                <button className="btn">Done</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
        </>
    )
}

export default Navbar