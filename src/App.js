import './App.css';
import {useForm} from "react-hook-form";
import {useEffect, useRef, useState} from "react";
import {useCoolDown} from "./hooks/useCoolDown";
import Hls from "hls.js";

function App() {

    const [audioMuted, setAudioMuted] = useState(true);

    const videoRef = useRef();
    const audioRef = useRef();

    const form = useForm();
    const changed = useCoolDown(500, () => {
        const [videoSrc, audioSrc] = form.getValues(["video", "audio"]);
        if (!videoSrc) {
            return;
        }

        if (!Hls.isSupported() || !videoRef.current) {
            return;
        }

        const audioHls = new Hls();
        audioHls.loadSource(audioSrc);
        audioHls.attachMedia(audioRef.current);

        const videoHls = new Hls();
        videoHls.loadSource(videoSrc);
        videoHls.on(Hls.Events.FRAG_LOADED, (event, data) => {
            if (audioHls.media) {
                if (data.frag.startPTS !== undefined) {
                    audioHls.seek(data.frag.startPTS);
                }
            }
        });
        videoHls.attachMedia(videoRef.current);

        videoRef.current.play();
        audioRef.current.play();
    })

    useEffect(() => {
        form.watch(() => {
            changed();
        })

        form.setValue("video", "https://zdf-hls-06.akamaized.net/hls/live/2016301/de/ade8a11e5e3d333b3da01169a08b0453/4/4.m3u8");
        form.setValue("audio", "https://zdf-hls-06.akamaized.net/hls/live/2016301/de/ade8a11e5e3d333b3da01169a08b0453/5/5.m3u8");
        changed();
    }, [form, changed]);

    return (
        <div className={"app"}>
            <div className="controls">
                <div className="input">
                    <label htmlFor={"video"}>Video Stream</label>
                    <input {...form.register("video")} type="text" placeholder={"Video Url..."}/>
                </div>
                <div className="audio-row">
                    <div className="input">
                        <label htmlFor={"audio"}>Audio Stream</label>
                        <input {...form.register("audio")} type="text" placeholder={"Audio Url..."}/>
                    </div>
                    <button className="muted" onClick={() => {
                        setAudioMuted(!audioMuted)
                    }}>
                        {audioMuted ? <svg xmlns="http://www.w3.org/2000/svg"
                                           viewBox="0 0 640 512">
                                <path
                                    d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.1 386.2C556.7 352 576 306.3 576 256c0-60.1-27.7-113.8-70.9-149c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C507.3 170.7 528 210.9 528 256c0 39.1-15.6 74.5-40.9 100.5L449 326.6c19-17.5 31-42.7 31-70.6c0-30.1-13.9-56.9-35.4-74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C425.1 227.6 432 241 432 256s-6.9 28.4-17.7 37.3c-1.3 1-2.4 2.2-3.4 3.4L352 250.6V64c0-12.6-7.4-24-18.9-29.2s-25-3.1-34.4 5.3L197.8 129.8 38.8 5.1zM352 373.3L82.9 161.3C53.8 167.4 32 193.1 32 224v64c0 35.3 28.7 64 64 64h67.8L298.7 471.9c9.4 8.4 22.9 10.4 34.4 5.3S352 460.6 352 448V373.3z"/>
                            </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 576 512">
                                <path
                                    d="M333.1 34.8C344.6 40 352 51.4 352 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L163.8 352H96c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L298.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zm172 72.2c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C507.3 341.3 528 301.1 528 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C466.1 199.1 480 225.9 480 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C425.1 284.4 432 271 432 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5z"/>
                            </svg>}
                    </button>
                </div>
            </div>
            <div className="video">
                <video ref={videoRef} controls>
                    <audio ref={audioRef} muted={audioMuted}/>
                </video>
            </div>
        </div>
    );
}

export default App;
