import React, { useContext, useState } from 'react'
import SearchBox from '../SearchBox'
import { Music, X } from 'lucide-react'
import { context } from '../../context/Context'
import LoginPopupModal from '../modals/LoginPopupModal'
import { useLiveQuery } from 'dexie-react-hooks'
import { AddRecentVideoData, DeleteRecentVideoData, db } from '../../db/dexie'
import toast from 'react-hot-toast'
import { getVideoData } from '../../utils/getVideoData'
import { useNavigate } from 'react-router-dom'

const SearchPage = () => {
  const { user } = useContext(context);
  const recentVideos = useLiveQuery(() => db.recentSearchVideos.toArray());
  const [searchResults, setsearchResults] = useState([]);
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  const navigate = useNavigate();

  const getSearchResults = async (keyword) => {
    // need to fetch data from backend
    const url = new URL(baseUrl + "/getSearchResults");
    url.searchParams.append("q", encodeURI(keyword));
    try {
      const res = await fetch(url);
      const result = await res.json();
      if (!result.ok) {
        toast.error("Error fetching Data")
        return false;
      }
      const { data } = result;
      // console.log("FETCH SUCCESS");
      const formatedArr = data.items.map((item, i) => ({
        sid: item.videoId,
        title: item.title,
        thumbnails: {
          default: `https://img.youtube.com/vi/${item.videoId}/default.jpg`,
          hqdefault: `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`,
          mqdefault: `https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`,
        },
        author_name: item.channel_name,
        author_url: `https://youtube.com${item.channel_username}`
      }));
      setsearchResults(formatedArr);
    } catch (error) {
      toast.error("Error fetching Data")
    }
  }

  const handleSubmit = async (searchData) => {
    if (!searchData.trim()) {
      toast.error("Values cannot be empty");
      return false;
    }
    if (!user.isLoggedIn) {
      /** code for when user not logged in */
      if (!searchData.includes("https://")) {
        toast.error("Invalid Link!");
        return false;
      }
      // get songs data from pasted yt video link;
      const data = await getVideoData(searchData);
      if (!data) {
        toast.error("Invalid Link!");
        return false;
      }
      setsearchResults([{ ...data }])
      // toast.success("Video Added Successfully");
      return true;
    }
    /** code for loggedin user */
    getSearchResults(searchData.trim());
  }

  const handleRecentDelete = async (selectId) => {
    await DeleteRecentVideoData(selectId);
    toast.success("Video Deleted Successfully")
  }

  return (
    <div className='p-2'>

      {/* search box */}
      <div className="flex justify-center mt-2">
        <SearchBox placeholder={user?.isLoggedIn ? "Search Song" : "Paste Youtube Link"} onSubmit={handleSubmit} />
      </div>

      {searchResults && searchResults.length > 0 ? <div className="search_result_container">
        <div className='mt-4'>Search Results</div>
        {searchResults.map((searches, i) => {
          return (<div key={i} className="searchResultsCard my-2 p-2 bg-slate-400/20 rounded-xl">
            <div className="flex w-full items-center">
              <Music className='w-4 h-4 me-2' />
              <div className="title text-sm w-full text-nowrap overflow-hidden text-ellipsis" onClick={async () => {
                /** on click the current search result will be added to recently searched */
                try { const sid = await AddRecentVideoData(searches) } catch (error) { };
                sessionStorage.setItem("currSongSelect", JSON.stringify(searches));
                navigate("/play/song/" + searches.sid);
              }}>
                {searches.title}<br />
                <span className='text-xs'>{searches.author_name}</span>
              </div>
            </div>
          </div>)
        })}
      </div>
        :
        <div className="recent_search_container">
          <div className='mt-4'>Recently Played</div>
          {recentVideos && recentVideos.length > 0 && recentVideos.map((item, i) => {
            return (<div key={i} className="searchCard my-2 px-2 text-slate-400">
              <div className="flex w-full items-center">
                <Music className='w-4 h-4 me-2' />
                <div className="title text-sm w-full text-nowrap overflow-hidden text-ellipsis" onClick={() => {
                  sessionStorage.setItem("currSongSelect", JSON.stringify(item));
                  navigate("/play/song/" + item.sid);
                }}>
                  {item.title}<br />
                  <span className='text-xs'>{item.author_name}</span>
                </div>
                <X className='w-4 h-4' onClick={()=>{handleRecentDelete(item.sid)}} />
              </div>
            </div>)
          })}
        </div>}

      {(user.isLoggedIn !== true) && <div className="login_btn_container mt-6">
        <div className="text-center">Login to Unlock Full Access</div>
        <div className="text-center mt-2">
          <button className='btn rounded-full w-1/2'
            onClick={() => { document.getElementById('login_popup_modal').showModal() }}
          >Details</button>
        </div>
      </div>}

      {/* login details modal */}
      <LoginPopupModal />

    </div>
  )
}

export default SearchPage