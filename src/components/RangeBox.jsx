import React, { useEffect, useState } from 'react'
import { Range } from "react-range";

const RangeBox = ({progress, min,max,onfinalValueChange}) => {
    const [values, setValues] = useState([progress]);

    useEffect(() => {
      setValues([progress])
    }, [progress]);


    
  return (
    <Range
    //   label="Select your value"
      min={min}
      max={max}
      values={values}
      onChange={(values) => {
        // console.log(values);
        setValues(values)
      }}
      onFinalChange={(values) => {
        // console.log("final:",values);
        onfinalValueChange(values[0])
        // setfinalValues(values[0])
      }}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: "6px",
            width: "100%",
            backgroundColor: "#ccc",
            borderRadius:"10px"
          }}
        >
          {children}
        </div>
      )}
      renderThumb={({ props }) => (
        <div
        className='w-4 h-4 bg-white rounded-full'
          {...props}
          key={props.key}
          style={{
            ...props.style,
          }}
          onDragEnd={(e)=>{
            // console.log("key is up now",e);
          }}
        />
      )}
    />
  )
}

export default RangeBox