import { ListMusic, Music, Pen, Plus, Trash } from 'lucide-react';
import React, { useContext, useState } from 'react'
import AddModal from '../modals/AddModal';
import { db } from '../../db/dexie';
import { useLiveQuery } from 'dexie-react-hooks'
import UpdateModal from '../modals/UpdateModal';
import DeleteModal from '../modals/DeleteModal';
import { useNavigate } from 'react-router-dom';
import { context } from '../../context/Context';
import LoginPopupModal from '../modals/LoginPopupModal';

/** this page renders user saved songs and playlist data */
const PlaylistPage = () => {
  const { user } = useContext(context);
  const songs = useLiveQuery(() => db.songs.toArray());
  const playlists = useLiveQuery(() => db.playlists.toArray());
  const [tabIndex, settabIndex] = useState(0);
  const [mode, setmode] = useState("songs");
  const [selectId, setselectId] = useState("");
  const navigate = useNavigate();
  const SONG_LIMIT = 20;
  const PLAYLIST_LIMIT = 10;

  return (
    <div className='p-2'>
      <div className="tabs_container">
        <div role="tablist" className="tabs tabs-bordered">
          <a role="tab" className={`tab ${tabIndex === 0 && "tab-active"}`} onClick={() => { settabIndex(0); }}>Videos</a>
          <a role="tab" className={`tab ${tabIndex === 1 && "tab-active"}`} onClick={() => { settabIndex(1); }}>Playlist</a>
        </div>

        {/* tab views */}
        {tabIndex === 0 && (<div className='song-tab mt-2'>
          {/* songs header */}
          <div className="flex justify-between items-center">
            <h3 className='text-xl font-bold'>Your Songs</h3>
            <div className='flex gap-x-3 items-center'>
              {!user?.isLoggedIn && <span>{songs ? `${songs.length}/20` : "0/20"}</span>}
              <button onClick={() => {
                if (!user?.isLoggedIn) {
                  if (songs.length >= SONG_LIMIT) {
                    /** limit exceeded: show login popup */
                    document.getElementById('login_popup_modal').showModal();
                    return false;
                  }
                }
                setmode("songs");
                document.getElementById('add_modal').showModal();
              }}><Plus /></button>
            </div>
          </div>
          {/* songs header ends*/}

          <div className="songsContainer">

            {songs && songs.length > 0 && songs.map((song, i) => {
              return (<div key={i} className="songCard my-2 p-2 border rounded-xl shadow dark:shadow-white">
                <div className="flex w-full items-center">
                  <Music className='w-6 h-6 me-2' />
                  <div className="title text-sm w-full text-nowrap text-ellipsis overflow-hidden"
                    onClick={() => {
                      navigate(`/play/song/${song.sid}`);
                      sessionStorage.setItem("currSongSelect", JSON.stringify(song));
                    }}>
                    {song.title}<br />
                    {song.author_name}
                  </div>
                  <div className="bUTTONS flex justify-between w-14">
                    <button onClick={() => {
                      setmode("songs");
                      setselectId(song.sid);
                      document.getElementById("update_modal").showModal()
                    }}><Pen className='w-4 h-4' />
                    </button>
                    <button onClick={() => {
                      setmode("songs");
                      setselectId(song.sid);
                      document.getElementById("delete_modal").showModal()
                    }}><Trash className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </div>)
            })}

          </div>
        </div>)}

        {tabIndex === 1 && <div className='playlist-tab mt-2'>
          <div className="flex justify-between items-center">
            <h3 className='text-xl font-bold'>Your Playlist</h3>
            <div className='flex gap-x-3 items-center'>
              {!user?.isLoggedIn && <span>{playlists ? `${playlists.length}/10` : "0/10"}</span>}
              <button onClick={() => {
                if (!user?.isLoggedIn) {
                  if (playlists.length >= PLAYLIST_LIMIT) {
                    /** limit exceeded: show login popup */
                    document.getElementById('login_popup_modal').showModal();
                    return false;
                  }
                }
                setmode("playlist");
                document.getElementById('add_modal').showModal();
              }}><Plus /></button>
            </div>
          </div>

          {/* playlist header ends*/}
          <div className="playlistContainer">

            {playlists && playlists.length > 0 && playlists.map((playlist, i) => {
              return (<div key={i} className="playlistCard my-2 p-2 border rounded-xl shadow dark:shadow-white">
                <div className="flex w-full items-center">
                  <ListMusic className='w-6 h-6 me-2' />
                  <div className="title text-sm w-full text-nowrap text-ellipsis overflow-hidden"
                    onClick={() => { navigate(`/play/playlist/${playlist.pid}`); sessionStorage.setItem("currplaylistSelect", JSON.stringify(playlist)) }}>
                    {playlist.title}<br />
                    {playlist.author_name}
                  </div>
                  <div className="bUTTONS flex justify-between w-14">
                    <button onClick={() => {
                      setmode("playlist");
                      setselectId(playlist.pid);
                      document.getElementById("update_modal").showModal()
                    }}><Pen className='w-4 h-4' /></button>
                    <button onClick={() => {
                      setmode("playlist");
                      setselectId(playlist.pid);
                      document.getElementById("delete_modal").showModal()
                    }}><Trash className='w-4 h-4' /></button>
                  </div>
                </div>
              </div>)
            })}

          </div>
        </div>}
      </div>

      {/* MODALS */}
      <AddModal mode={mode} />
      <UpdateModal mode={mode} selectId={selectId} />
      <DeleteModal mode={mode} selectId={selectId} />

      {/* login details modal */}
      <LoginPopupModal />
    </div>
  )
}

export default PlaylistPage