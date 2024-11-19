import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { Drawer } from 'vaul';
import { secondsToMMSS } from '../../utils/secondsToMMSS.js';
import { ChevronLeft, ChevronRight, Disc, LoaderCircle, Music, Pause, Play } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { context } from '../../context/Context.jsx';
import RangeBox from '../RangeBox.jsx';

/** this page handles playing of song using /play/song/id */
const Player = () => {
  const [open, setOpen] = useState(false);
  const { playerDetails, setvideoDetails, progressValue } = useContext(context);
  const params = useParams();

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      window.history.back()
    }
  }

  useEffect(() => {
    setvideoDetails({
      id: params.sid,
      type: "video"
    })
    /** set last played for rendering disc view  */
    sessionStorage.setItem("lastIdPlaying", "/song/" + params.sid);
  }, [params.sid])

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#open') {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const { state } = playerDetails;
    if (state === 1) {
      sessionStorage.setItem("isPlay", "true");
    } else if (state === 2) {
      sessionStorage.setItem("isPlay", "false");
    }
  }, [playerDetails.state]);


  return (
    <div className='p-2'>
      <h3 className='text-xl font-bold'>Play Song</h3>

      {/* song card here */}
      <div className="SongCard my-2 p-2 border rounded-xl shadow dark:shadow-white">
        <div className="flex w-full items-center">
          <Music className={`w-6 h-6 me-2 ${playerDetails.state === 1 && "animate-pulse" }`} />
          <div className="title text-sm w-full text-nowrap text-ellipsis overflow-hidden"
            onClick={() => {
              setOpen(!open);
              if (open) {
                window.location.hash = ''; // this removes the hash
              } else {
                window.location.hash = 'open';
              }
            }}>
            {JSON.parse(sessionStorage.getItem("currSongSelect")).title}<br />
            {JSON.parse(sessionStorage.getItem("currSongSelect")).author_name}
          </div>
          {playerDetails.state === 1 ? <Pause className='w-6 h-6 me-2' />: <Play className='w-6 h-6 me-2' />}
        </div>
      </div>




      {/* https://github.com/emilkowalski/vaul */}
      <Drawer.Root open={open} onOpenChange={handleOpenChange}>
        <Drawer.Trigger id='songBottomSheetTrigger'></Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className='fixed inset-0 bg-black/40' />
          <Drawer.Content className='h-fit fixed bottom-0 left-0 right-0 outline-none">
          <div className="p-4 bg-white dark:bg-[#1d232a] rounded-t-xl p-2'>
            <Drawer.Handle />
            <Drawer.Title></Drawer.Title>
            <Drawer.Description></Drawer.Description>

            <div className="w-full px-4 h-[85vh]  flex flex-col justify-between pb-4 py-10">

              {/* thumbnail and song title */}
              <div>
                <div className="imageContainer">
                  <img src={JSON.parse(sessionStorage.getItem("currSongSelect")).thumbnails.mqdefault} 
                  className='h-40 object-cover w-full rounded-2xl' alt="music" />
                </div>
                <div className="titleContainer mt-4">
                  <h3 className='text-xl font-bold text-center overflow-hidden text-nowrap text-ellipsis'>
                    {JSON.parse(sessionStorage.getItem("currSongSelect")).title}<br />
                    {JSON.parse(sessionStorage.getItem("currSongSelect")).author_name}
                  </h3>
                </div>
              </div>

              <div className='mx-auto flex gap-x-2 items-center'>
                <Music className='w-8 h-8' />
                <Disc className='w-8 h-8' />
              </div>

              {/* music deck */}
              <div className="music-player-deck h-24  gap-x-1">
                <div className="timer-container flex justify-between px-2 text-sm">
                  <div className="current-time">{secondsToMMSS(progressValue)}</div>
                  <div className="duration">{
                    secondsToMMSS((playerDetails.duration))
                  }</div>
                </div>

                <div className="progress-bar-container px-1 py-2 cursor-pointer">
                  <RangeBox 
                  min={0} 
                  max={playerDetails.duration} 
                  progress={progressValue < playerDetails.duration ? progressValue : 0} 
                  onfinalValueChange={(value)=>{
                    // console.log("GOT FINAL:",value);
                    playerDetails.seekTo(Math.floor(value))
                  }}/>
                </div>

                <div className="control-buttons flex w-full justify-evenly mt-2">
                  <button className="control-button">
                    <ChevronLeft className='w-8 h-8' />
                  </button>

                  {playerDetails.state === 1 && (<button className="control-button"
                    onClick={() => {
                      playerDetails.pause();
                    }}>
                    <Pause className='w-8 h-8' />
                  </button>)}

                  {playerDetails.state === 2 && (<button className="control-button"
                    onClick={() => {
                      playerDetails.play();
                    }}>
                    <Play className='w-8 h-8' />
                  </button>)}

                  {playerDetails.state === 3 && (<button className="control-button">
                    <LoaderCircle className='w-8 h-8 animate-spin' />
                  </button>)}

                  {playerDetails.state === 5 && (<button className="control-button"
                    onClick={() => {
                      playerDetails.play();
                    }}>
                    <Play className='w-8 h-8' />
                  </button>)}

                  <button className="control-button">
                    <ChevronRight className='w-8 h-8' />
                  </button>
                </div>
              </div>
            </div>

          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}

export default Player