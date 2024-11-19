import React, { useState } from 'react'

const SearchBox = ({placeholder, onSubmit}) => {
    const [searchData, setsearchData] = useState("");
    return (
        <form onSubmit={(e)=>{
            e.preventDefault();
            onSubmit(searchData);
            }}>
            <div className="join">
            <div>
                <input type='search' 
                className="input input-bordered join-item rounded-full w-[75vw] max-w-xs" 
                placeholder={placeholder}
                onChange={(e)=>{setsearchData(e.target.value)}}
                value={searchData} />
            </div>
            <div>
                <button className="btn join-item rounded-full">Search</button>
            </div>
        </div>
        </form>
    )
}

export default SearchBox