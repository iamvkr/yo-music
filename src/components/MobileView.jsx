import React from 'react'

const MobileView = ({children}) => {
  return (
    <div className='max-w-md md:max-w-[70%] bg-red-5 h-[calc(100vh_-_4rem)] mx-auto'>
        {children}
        <div className="h-16"></div>
    </div>
  )
}

export default MobileView