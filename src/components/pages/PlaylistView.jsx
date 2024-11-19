import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { Drawer } from 'vaul';
import { secondsToMMSS } from '../../utils/secondsToMMSS.js';
import { ChevronLeft, ChevronRight, Disc, LoaderCircle, Music, Pause, Play } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { context } from '../../context/Context.jsx';
import RangeBox from '../RangeBox.jsx';
import toast from 'react-hot-toast';

const PlaylistView = () => {
  const [open, setOpen] = useState(false);
  const [playlistItems, setplaylistItems] = useState([]);
  const { playerDetails, setvideoDetails, progressValue } = useContext(context);
  const params = useParams();
  const [page, setpage] = useState(1);

  /** this complex logic for getting current song playing index in the list of playlist songs to render play pause icon on that particular song */
  const [currentSongPlaying, setcurrentSongPlaying] = useState({
    index: Number(sessionStorage.getItem("currPlaylistIndexPlay")) || 0,
    details: {
      title: JSON.parse(sessionStorage.getItem("currPlaylistFetchRes")) ?
        JSON.parse(sessionStorage.getItem("currPlaylistFetchRes"))[Number(sessionStorage.getItem("currPlaylistIndexPlay")) || 0].title : "",
      thumbnail: JSON.parse(sessionStorage.getItem("currPlaylistFetchRes")) ?
        JSON.parse(sessionStorage.getItem("currPlaylistFetchRes"))[Number(sessionStorage.getItem("currPlaylistIndexPlay")) || 0].thumbnail_url : "",
    }
  });

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      window.history.back()
    }
  }

  useEffect(() => {
    setvideoDetails({
      id: params.pid,
      type: "playlist"
    })
    /** set last played for rendering disc view  */
    sessionStorage.setItem("lastIdPlaying", "/playlist/" + params.pid);
  }, [])

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

  /** this function gets all individual video details from the given playlist id WITH CACHING ENABLED  */
  const fetchPlaylistData = async (idArr, limit = 10) => {
    const startIndex = (page - 1) * limit;
    let endIndex = startIndex + limit;

    if (startIndex >= idArr.length) {
      // requested index is out of bound
      // we can toast here no more item
      toast.error("That's It")
      return false;
    }
    if (endIndex >= idArr.length) {
      // end index exceed array so set:
      endIndex = idArr.length;
    }

    const getDATA = (id) => {
      return (fetch(encodeURI(`https://www.youtube.com/oembed?url=https://youtube.com/watch?v=${id}&format=json`)));
    }

    const promiseArr = [];
    const tArr = idArr.slice(startIndex, endIndex);
    tArr.forEach((id, i) => {
      promiseArr.push(getDATA(id));
    });

    const result = await Promise.all(promiseArr);
    // console.log("RESULT COMPLETE", result);

    const resultArr = [];
    for (let i = 0; i < result.length; i++) {
      const data = await result[i].json();
      resultArr.push(data);
    }

    // console.log("RESULT", resultArr);
    // set playlistItems 
    setplaylistItems([...playlistItems, ...resultArr]);
    // also increment page number for next fetch
    setpage(page + 1);
    // this will be executed once at the start of app as playlist item at start would be empty:
    if (playlistItems.length <= 0) {
      setcurrentSongPlaying({
        index: 0,
        details: {
          title: resultArr[0].title,
          thumbnail: resultArr[0].thumbnail_url
        }
      })
    }
    /** caching here + used while next and prev buttons */
    sessionStorage.setItem("currPlaylistFetchRes", JSON.stringify([...playlistItems, ...resultArr]))
  }

  useEffect(() => {
    const { state } = playerDetails;
    /** if state 5 then fetch  */
    if (state === 5 && playlistItems.length <= 0 && !(JSON.parse(sessionStorage.getItem("currPlaylistFetchRes")))) {
      const idArr = playerDetails.getPlaylist();
      fetchPlaylistData(idArr);
    } else {
      const result = JSON.parse(sessionStorage.getItem("currPlaylistFetchRes"));
      if (result) {
        // calculate page no. based on the stored result: (here 10 is limit)
        let q = result.length / 10;
        let pageNo = (q > Math.floor(q)) ? (Math.floor(q) + 2) : (Math.floor(q)+1);
        setpage(pageNo)
        setplaylistItems(result);
      }
    }

  }, [playerDetails.state])


  return (
    <div className='p-2'>
      <h3 className='text-xl font-bold'>Play Playlist</h3>

      {/* song card here */}
      {playlistItems && playlistItems.length > 0 && playlistItems.map((item, i) => {
        return (<div key={i} className="SongCard my-2 p-2 border rounded-xl shadow dark:shadow-white">
          <div className="flex w-full items-center">
            <Music className={`w-6 h-6 me-2 ${i == currentSongPlaying.index && "animate-pulse"}`} />
            <div className="title text-sm w-full text-nowrap text-ellipsis overflow-hidden"
              onClick={() => {
                setOpen(!open);

                if (open) {
                  window.location.hash = ''; // Remove the hash
                } else {
                  window.location.hash = 'open';
                }
                if (currentSongPlaying.index !== i) {
                  // console.log(item);
                  playerDetails.playVideoAt(i);
                  setcurrentSongPlaying({
                    ...currentSongPlaying,
                    index: i,
                    details: {
                      title: item.title,
                      thumbnail: item.thumbnail_url
                    }
                  })
                  sessionStorage.setItem("currPlaylistIndexPlay", String(i))
                }
              }}>
              {item.title}<br />
              {item.author_name}
            </div>
            {playerDetails.state === 1 && i == currentSongPlaying.index ? <Pause className='w-6 h-6 me-2' /> : <Play className='w-6 h-6 me-2' />}

          </div>
        </div>)
      })}

      {/* load more button */}
      {playlistItems && playlistItems.length > 0 && <div className='text-center mt-4'>
        <button className='btn btn-outline w-36' onClick={() => {
          const idArr = playerDetails.getPlaylist();
          fetchPlaylistData(idArr);
        }}>Load More</button>
      </div>}




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
              <div className="">
                <div className="imageContainer">
                  <img src={currentSongPlaying.details.thumbnail} className='h-40 object-cover w-full rounded-2xl' alt="music" />
                </div>
                <div className="titleContainer mt-4">
                  <h3 className='text-xl font-bold text-center overflow-hidden text-nowrap text-ellipsis'>
                    {currentSongPlaying.details.title}<br />
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
                    secondsToMMSS(playerDetails.duration)
                  }</div>
                </div>

                <div className="progress-bar-container px-1 py-2 cursor-pointer">
                  <RangeBox
                    min={0}
                    max={(playerDetails.duration)}
                    progress={progressValue}
                    onfinalValueChange={(value) => {
                      // console.log("GOT FINAL:",value);
                      playerDetails.seekTo(Math.floor(value))
                    }} />
                </div>

                <div className="control-buttons flex w-full justify-evenly mt-2">
                  <button className="control-button"
                    onClick={() => {
                      if (currentSongPlaying.index > 0) {
                        playerDetails.prev();
                        setcurrentSongPlaying({
                          ...currentSongPlaying,
                          index: currentSongPlaying.index - 1,
                          details: {
                            title: JSON.parse(sessionStorage.getItem("currPlaylistFetchRes"))[currentSongPlaying.index - 1].title,
                            thumbnail: JSON.parse(sessionStorage.getItem("currPlaylistFetchRes"))[currentSongPlaying.index - 1].thumbnail_url
                          }
                        });
                        sessionStorage.setItem("currPlaylistIndexPlay", String(currentSongPlaying.index - 1))
                      }
                    }}>
                    <ChevronLeft className='w-8 h-8' />
                  </button>

                  {playerDetails.state === 1 && (<button className="control-button"
                    onClick={() => {
                      playerDetails.pause();
                      sessionStorage.setItem("isPlay", "false");
                    }}>
                    <Pause className='w-8 h-8' />
                  </button>)}

                  {playerDetails.state === 2 && (<button className="control-button"
                    onClick={() => {
                      playerDetails.play();
                      sessionStorage.setItem("isPlay", "true");
                    }}>
                    <Play className='w-8 h-8' />
                  </button>)}

                  {playerDetails.state === 3 && (<button className="control-button">
                    <LoaderCircle className='w-8 h-8 animate-spin' />
                  </button>)}

                  {playerDetails.state === 5 && (<button className="control-button"
                    onClick={() => {
                      playerDetails.play();
                      sessionStorage.setItem("isPlay", "true");
                    }}>
                    <Play className='w-8 h-8' />
                  </button>)}

                  <button className="control-button"
                    onClick={() => {
                      if (currentSongPlaying.index < playlistItems.length - 1) {
                        playerDetails.next()
                        setcurrentSongPlaying({
                          ...currentSongPlaying,
                          index: currentSongPlaying.index + 1,
                          details: {
                            title: JSON.parse(sessionStorage.getItem("currPlaylistFetchRes"))[currentSongPlaying.index + 1].title,
                            thumbnail: JSON.parse(sessionStorage.getItem("currPlaylistFetchRes"))[currentSongPlaying.index + 1].thumbnail_url
                          }
                        });
                        sessionStorage.setItem("currPlaylistIndexPlay", String(currentSongPlaying.index + 1));
                      }
                    }}>
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



export default PlaylistView