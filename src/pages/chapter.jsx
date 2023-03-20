import React from 'react'
import { useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import createBuffer from '../utils/audio/createBuffer';
import localTTS from '../utils/audio/localTTS';
import azureTTS from '../utils/audio/azureTTS';
import customTTS from '../utils/audio/customTTS';
import logo from '../assets/logo.png'

function Chapter() {
    const [ttsType, setTTSType] = useState(null)
    const [buffer, setBuffer] = useState([])
    const [isPlaying, setIsPlaying] = useState(null);
    const [current, setCurrent] = useState(0);
    let sentenceNo = 0;
    const location = useLocation();
    const chapter = location.state.chapter;
    let speech = new SpeechSynthesisUtterance();
    let audio = new Audio();

    function selectTTS(type) {
        switch (type) {
            case 'local':
                setTTSType('local')
                local()
                break;
            case 'azure':
                setTTSType('azure')
                azure()
                break;
            case 'custom':
                setTTSType('custom')
                custom()
                break;
        }
    }

    async function local() {
        for (let i = current; i < chapter.length; i++) {
            const speech = localTTS(chapter[i])
            console.log('Created the ' + i + 'th buffer', speech)
            const newBuffer = buffer
            newBuffer.push(speech)
            setBuffer(newBuffer)
        }
    }

    async function azure() {
        for (let i = current; i < chapter.length; i++) {
            console.log("Length", chapter.length)
            const speech = await azureTTS(chapter[i])
            console.log('Created the ' + i + 'th buffer', speech)
            let newBuffer = buffer
            newBuffer.push(speech)
            setBuffer(newBuffer)
        }
    }

    async function custom() {
        for (let i = current; i < chapter.length; i++) {
            console.log("I", i);
            const speech = await customTTS(chapter[i])
            console.log('Created the ' + i + 'th buffer', speech)
            let newBuffer = buffer
            newBuffer.push(speech)
            setBuffer(newBuffer)
        }
    }

    const playAudio = async () => {
        if (ttsType === 'local') {
            setIsPlaying(true);
            for (let i = current; i < buffer.length; i++) {
                console.log('playing ' + i + 'th buffer', buffer[i])
                speech = buffer[i];
                speech.onend = () => {
                    setCurrent(i + 1);
                    sentenceNo = i + 1;
                    console.log('finished ' + i + 'th buffer', buffer[i])
                }
                speechSynthesis.speak(speech);
            }
            setIsPlaying(false);
        }
        else if (ttsType === 'azure') {
            setIsPlaying(true);
            let i = sentenceNo;
            console.log("Current", current)
            console.log('playing ' + i + 'th buffer', buffer[i])
            const blob = buffer[i];
            const url = URL.createObjectURL(blob)
            audio.src = url
            audio.onended = () => {
                setCurrent(i + 1);
                sentenceNo = i + 1;
                console.log('finished ' + i + 'th buffer', buffer[i]);
                playAudio()
            }
            audio.play();

            setIsPlaying(false);
        }
        else if (ttsType === 'custom') {
            setIsPlaying(true);
            let i = sentenceNo;
            console.log("Current", current)
            console.log('playing ' + i + 'th buffer', buffer[i])
            const blob = buffer[i];
            console.log("Blob", blob)
            const url = window.URL.createObjectURL(blob)
            audio.src = url
            console.log("URL", url)
            console.log("Audio", audio)
            audio.play().then(() => {
                // Audio is playing.
            })
                .catch(error => {
                    console.log(error);
                });
            audio.onended = () => {
                setCurrent(i + 1);
                sentenceNo = i + 1;
                console.log('finished ' + i + 'th buffer', buffer[i]);
                playAudio()
            }
            setIsPlaying(false);
        }
    };

    // const pauseAudio = () => {
    //     if (ttsType === 'local') {
    //         setIsPlaying(false);
    //         speechSynthesis.pause();
    //     }
    //     else if (ttsType === 'azure') {
    //         setIsPlaying(false);
    //         audio.pause()
    //     }
    // };

    // const resumeAudio = () => {
    //     if (ttsType === 'local') {
    //         setIsPlaying(true);
    //         speechSynthesis.resume();
    //     }
    //     else if (ttsType === 'azure') {
    //         setIsPlaying(true);
    //         audio.resume()
    //     }
    // };


    return (
        <div>
            {/* List of  chapters styled with DaisyUI and tailwind classes*/}
            <div className="flex flex-col items-center justify-center bg-[#F0E8E2]">
                <div className='col-span-1 flex justify-center'>
                    <img src={logo} className='hover:scale-110 transition'></img>
                </div>
                <div className="text-5xl text-center hover:translate-y-4 hover:scale-125 transition">{ }</div>
                <div className='w-1/3 flex justify-center'>
                    {ttsType == null ?
                        <div className="dropdown w-full flex justify-center">
                            <div tabIndex={0} className='w-1/3 py-2 btn m-1 bg-black text-white text-center rounded-lg'>Select TTS</div>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-1/2 mt-20">
                                <li onClick={() => selectTTS('local')}><a>Browser TTS</a></li>
                                <li onClick={() => selectTTS('azure')}><a>Azure TTS</a></li>
                                <li onClick={() => selectTTS('custom')}><a>Custom TTS</a></li>
                            </ul>
                        </div>
                        :
                        <div className="dropdown w-full flex justify-center">
                            <div className='py-2 btn m-1 bg-[#ffdcb6] text-[#555555] hover:bg-[#ffce9a] text-center rounded-lg disabled'>Select TTS</div>
                        </div>
                    }
                    <div className='w-full text-center'>
                        <div tabIndex={0} className='py-2 btn m-1 bg-[#ffdcb6] text-[#555555] hover:bg-[#ffce9a] text-center rounded-lg' onClick={()=>playAudio()}>
                            <div className='flex'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-play ml-1" width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                                <div className='h-full pt-1 px-2'>Play</div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    chapter.map((line, index) => {
                        return (
                            index === current
                                ? <div className="text-xl text-center mx-10 bg-[#ffdcb6] rounded-lg px-5 py-2">{line}</div>
                                : <div className="text-xl text-center mx-10 pb-2">{line}</div>
                        )
                    })
                }
            </div>

        </div >
    )
}

export default Chapter