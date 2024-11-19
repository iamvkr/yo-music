import React, { useEffect, useState } from "react";

/** currently not used in app */
export const useDebounce = (inputValue) => {
  // console.log("inp",inputValue);
  const [debouncedInputValue, setDebouncedInputValue] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedInputValue(Math.floor(inputValue));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [inputValue, 500]);

  return debouncedInputValue
};

/** USAGE
 * const App = () => {
  const [inputValue, setInputValue] = React.useState("");
  const {debouncedInputValue} = useDebounce({inputValue})

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <br/>
      debouncedInputValue:{debouncedInputValue}
    </div>
  )
}
 */