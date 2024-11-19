import React, { useState } from 'react'
import MyCarousel from '../MyCarousel';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/dexie';

const HomePage = () => {
  const [trendingData, settrendingData] = useState([]);
  const recentVideos = useLiveQuery(() => db.recentSearchVideos.toArray());

  return (
    <div className='p-2'>
      <div className="image mb-2 relative h-40 w-full">
        
        <img src="/imgs/guitar-1699501_640.jpg" className='h-40 w-full object-cover object-top rounded-2xl absolute top-0 left-0' alt="music" />
        <div className=" h-40 w-full  absolute top-0 left-0 flex items-center justify-center">
          <span className='text-xl font-bold text-center mt-auto mb-2'>Ultimate Youtube Music Player</span>
        </div>
      </div>
      {/* Top Trending: */}
      <MyCarousel title={"Top Trending"} carouselData={trendingData} setcarouselData={settrendingData} mode={"trending"} />

      {/* recently searched */}
      {(recentVideos && recentVideos.length > 0) ? <MyCarousel title={"Recently Searched"} 
      carouselData={recentVideos} 
      setcarouselData={()=>{}} 
      mode={"recent"} />
        :
      <div className="recentEmptyContainer">
        <h3 className='text-xl font-bold'>Recently Searched</h3>
        <div className="text-center">No Items Found</div>
        <div className="text-center mt-2">
          <Link to={"/search"} className='btn rounded-full w-1/2'>Get Started</Link>
        </div>
      </div>}

    </div>
  )
}

export default HomePage