import { useState,useEffect } from "react";
import "../css/Slider.css"

export default function Slider(){
    const images = [
    "https://picsum.photos/id/1015/800/400",
    "https://picsum.photos/id/1016/800/400",
    "https://picsum.photos/id/1018/800/400",
    "https://picsum.photos/id/1020/800/400",
    ];

    const [current,setCurrent] = useState (0)

    const nextSlide = ()=>{
        setCurrent((prev)=>(prev===images.length-1 ? 0 : prev+1))
    }

    const prevSlide = () =>{
        setCurrent((prev)=>(prev===0 ?images.length-1: prev-1))
    }

    useEffect(() => {
        const timer = setInterval(() => {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 5000);

        return () => clearInterval(timer); // cleanup when component unmounts
    }, []);

    return(
        <div className="banner-container">
            <img className="banner-image" src={images[current]} alt="" />
            <button className="prev-button" onClick={prevSlide}><span className="material-symbols-rounded slider-icon">arrow_back_ios</span></button>
            <button className="next-button" onClick={nextSlide}><span className="material-symbols-rounded slider-icon">arrow_forward_ios</span></button>
        </div>
    )
}