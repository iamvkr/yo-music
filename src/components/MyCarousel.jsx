import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import React, { useEffect, useRef } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { shuffledArr } from '../utils/jsArrShuffle';

const MyCarousel = ({ title, carouselData, setcarouselData, mode }) => {
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    const navigate = useNavigate();
    
    const getTrendingData = async () => {
        // latest music videos india
        const keyword = "latest bollywood music videos";
        const url = new URL(baseUrl + "/getSearchResults");
        url.searchParams.append("q", keyword);
        try {
                const res = await fetch(url);
                const result = await res.json();
                if (!result.ok) {
                    toast.error("Error fetching Data")
                    return false;
                }
                const { data } = result;
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

            /** cacahing here: */
            localStorage.setItem("cachedTrendingData", JSON.stringify({
                expiresAt:Date.now() + (1000 * 60 * 60), //adds 1hr
                data: formatedArr
            }))

            setcarouselData(shuffledArr(formatedArr));

            // console.log("FETCH SUCCESS");
            // console.log(formatedArr);
        } catch (error) {
            toast.error("Error fetching Data")
        }
    }

    const ref = useRef();
    const handlePrev = () => {
        const carousel = ref.current;
        carousel.scrollLeft -= carousel.offsetWidth;
    }
    const handleNext = () => {
        const carousel = ref.current;
        carousel.scrollLeft += carousel.offsetWidth;
    }

    useEffect(() => {
        if (carouselData && (carouselData.length <= 0)) {
            if (mode === "trending") {
                const cachedTrendingData = JSON.parse(localStorage.getItem("cachedTrendingData"));
                if (cachedTrendingData) {
                    if (Date.now() >= cachedTrendingData.expiresAt) {
                        // cached expired get new:
                        getTrendingData();
                    } else {
                        // use cached data:
                        setcarouselData(shuffledArr(cachedTrendingData.data));
                    }
                } else {
                    getTrendingData();
                }
            }
        }
    }, [])


    return (
        <>
            <div className="flex justify-between px-2">
                <h3 className='text-xl font-bold'>{title}</h3>
                <div className="btns flex gap-x-2">
                    <button className="prev-btn" onClick={handlePrev}><ArrowLeftCircle /></button>
                    <button className="next-btn" onClick={handleNext}><ArrowRightCircle /></button>
                </div>
            </div>
            <div className="carousel mt-4 h-36 w-full mb-2" ref={ref}>

                {mode === "trending" && carouselData && carouselData.length > 0 && carouselData.map((item, i) => {
                    return (<div key={i} className="carousel-item w-1/2 bg-red flex items-center justify-center">
                        <div
                            style={{ '--image-url': `url(${item.thumbnails.mqdefault})` }}
                            className="border rounded-xl h-[8.5rem] w-[9rem] p-2 bg-[image:var(--image-url)] bg-cover bg-center relative"
                            onClick={() => {
                                sessionStorage.setItem("currSongSelect", JSON.stringify(item));
                                navigate("/play/song/" + item.sid);
                            }}>
                            <div
                                className="titlebox absolute bottom-0 left-0 w-full p-1 rounded-b-xl bg-[linear-gradient(#00000000,#000000)] 
                            text-nowrap overflow-hidden text-ellipsis
                            text-sm">
                                {item.title}
                            </div>
                        </div>
                    </div>)
                })}

                {mode === "recent" && carouselData && carouselData.length > 0 && carouselData.map((item, i) => {
                    return (<div key={i} className="carousel-item w-1/2 bg-red flex items-center justify-center">
                        <div
                            style={{ '--image-url': `url(${item.thumbnails.mqdefault})` }}
                            className="border rounded-xl h-[8.5rem] w-[9rem] p-2 bg-[image:var(--image-url)] bg-cover bg-center relative"
                            onClick={() => {
                                sessionStorage.setItem("currSongSelect", JSON.stringify(item));
                                navigate("/play/song/" + item.sid);
                            }}>
                            <div
                                className="titlebox absolute bottom-0 left-0 w-full p-1 rounded-b-xl bg-[linear-gradient(#00000000,#000000)] 
                            text-nowrap overflow-hidden text-ellipsis
                            text-sm">
                                {item.title}
                            </div>
                        </div>
                    </div>)
                }).reverse()}

            </div>
        </>
    )
}

export default MyCarousel