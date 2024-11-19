import { useEffect, useState } from "react";
import { useYoutube } from "../hooks/useYoutube";

const musicContext = () => {
  const [videoDetails, setvideoDetails] = useState({
    id: "",
    type: ""
  });
  const youtube = useYoutube(videoDetails);
  const { playerDetails, progressValue } = youtube;

  return {
    videoDetails,
    setvideoDetails,
    playerDetails,
    progressValue,
  }

}

export default musicContext; //used at main.js