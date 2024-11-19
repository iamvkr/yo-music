import { useEffect, useState } from "react";

let player;
let timer;
const initializeIframe = (id) => {
    const iframe = document.createElement("div");
    iframe.id = `youtube-player-${id}`;
    // iframe.style.height = "300px";
    // iframe.style.width = "300px";
    iframe.style.setProperty("display", "none");
    document.body.appendChild(iframe);
};

const loadApi = (id, options) => {
    if (document.querySelector("[data-youtube]") && window.YT) {
        player = new YT.Player(`youtube-player-${id}`, options);
        return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.dataset.youtube = "true";
    const firstScriptTag = document.getElementsByTagName("head")[0];
    firstScriptTag.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => {
        player = new YT.Player(`youtube-player-${id}`, options);
    };
};

export const useYoutube = ({ id, type, options }) => {
    const getPlayerOptions = (type, options) => ({
        videoId: type === "video" ? id : undefined,
        host: options?.host,
        playerVars: {
            listType: type === "playlist" ? type : undefined,
            list: type === "playlist" ? id : undefined,
            origin: options?.origin,
            autoplay: options?.autoplay ? 1 : 0,
            loop: options?.loop ? 1 : 0,
            mute: options?.mute ? 1 : 0,
            start: options?.start,
            end: options?.end,
        },
        events: {
            onReady: (event) => {
                // console.log("PLAYER IS READY");
                setOnReadyState(event);
            },
            onStateChange: (event) => {
                // console.log("PLAYER STATE CHANGED");
                setState(event);
            },
            onError: (event) => {
                // console.log("PLAYER ON ERROR");
            },
        },
    });

    const [playerDetails, setPlayerDetails] = useState({
        id: "",
        state: -1,
        title: "",
        duration: "",
        /** actions: */
        play: () => { },
        pause: () => { },
        stop: () => { },
        getCurrentTime: () => { return 0 },
        seekTo: (value) => { },
        /** playlist */
        getPlaylist: () => { },
        next: () => { },
        prev: () => { },
    });
    const [progressValue, setprogressValue] = useState(0);

    useEffect(() => {
        initializeIframe(id);
        loadApi(id, getPlayerOptions(type, options));

        return () => {
            player?.destroy();
            /** also destroy previous div */
            // console.log("THIS SECTION EXECUTED NOW", id);
            let element = document.getElementById(`youtube-player-${id}`);
            element.parentNode.removeChild(element);
        };
    }, [id, type]);

    const setOnReadyState = (event) => {
        // console.log("SET ONREADY EXEC", event);
        const videoDATA = event.target.getVideoData();
        if (!videoDATA.title.trim()) {
            // console.log("NO ITEM LOADED");
            return false;
        }
        // console.log("A video added to player");
        setPlayerDetails({
            ...playerDetails,
            id: videoDATA.video_id,
            state: event.target.getPlayerState(),
            title: videoDATA.title,
            duration: Math.floor(event.target.getDuration()),
            /** actions: */
            play: () => { event.target.playVideo() },
            pause: () => { event.target.pauseVideo() },
            stop: () => { event.target.stopVideo() },
            getCurrentTime: () => { return event.target.getCurrentTime() },
            next: () => { event.target.nextVideo() },
            prev: () => { event.target.previousVideo() },
            seekTo: (value) => { event.target.seekTo(value) },
            getPlaylist: () => { return event.target.getPlaylist() },
            playVideoAt: (index) => { event.target.playVideoAt(index) },
        })
    };

    const setState = (event) => {
        // console.log("SET STATE EXEC", event);
        const videoDATA = event.target.getVideoData();
        setPlayerDetails({
            ...playerDetails,
            state: event.data,
            id: videoDATA.video_id,
            title: videoDATA.title,
            duration: Math.floor(event.target.getDuration()),
            /** actions: */
            play: () => { event.target.playVideo() },
            pause: () => { event.target.pauseVideo() },
            stop: () => { event.target.stopVideo() },
            getCurrentTime: () => { return event.target.getCurrentTime() },
            next: () => { event.target.nextVideo() },
            prev: () => { event.target.previousVideo() },
            seekTo: (value) => { event.target.seekTo(value) },
            getPlaylist: () => { return event.target.getPlaylist() },
            playVideoAt: (index) => { event.target.playVideoAt(index) },
        });

        if (event.data === 1) {
            // set time interval
            timer = setInterval(() => {
                setprogressValue(Math.floor(event.target.getCurrentTime()));
            }, 1000);
        } else {
            clearInterval(timer)
        }
    };

    return {
        playerDetails,
        progressValue,
    };
};