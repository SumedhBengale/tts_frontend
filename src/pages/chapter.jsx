import React from 'react'
import { useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import createBuffer from '../utils/audio/createBuffer';
import localTTS from '../utils/audio/localTTS';
import azureTTS from '../utils/audio/azureTTS';

function Chapter() {
    const [length, setLength] = useState(0)
    const [completed, setCompleted] = useState(0)
    const [ttsType, setTTSType] = useState(null)
    const [bufferLength, setBufferLength] = useState(0)
    const [buffer, setBuffer] = useState(null)

    const location = useLocation();
    const chapter = location.state.chapter;

    useEffect(() => {
        setLength(chapter.length)
        console.log(chapter)
        console.log(length)

        // const buffer = createBuffer(chapter)
        //Set the buffer to the audio element
        // const audio = document.getElementById('audio')
        // audio.src = URL.createObjectURL(buffer)
        // audio.play()
    }, [])

    function selectTTS(type) {
        switch (type) {
            case 'local':
                setTTSType('local')
                play()
                break;
            case 'azure':
                setTTSType('azure')
                play()
                break;
            case 'custom':
                setTTSType('custom')
                play()
                break;
        }
    }

    async function local(){
        //Send the next 10 lines of chapter to localTTS()
        setBuffer(await localTTS(chapter.slice(bufferLength, 10)))

        //Set the buffer to the audio element
        const audio = document.getElementById('audio')
        for (let i = 0; i < buffer.length; i++) {
            //Wait for the audio to play and finish
            await new Promise(resolve => {
                function onend() {
                    setBufferLength(bufferLength - 1)
                    setCompleted(completed + 1)
                    console.log(completed)
                    resolve()
                }
                console.log('playing')
                audio.play()
                setBufferLength(bufferLength - 1)
                setCompleted(completed + 1)
                audio.onended = onend()
            })
        }

        //If the chapter is not finished, play the next 10 lines
        if (completed < length) {
            localTTS()
        }
    }

    async function azure(){
        //Send the next 10 lines of chapter to localTTS()
        setBuffer(await azureTTS(chapter.slice(bufferLength, 10)))

        //Set the buffer to the audio element
        const audio = document.getElementById('audio')
        for (let i = 0; i < buffer.length; i++) {
            console.log("playing audio")
            //Wait for the audio to play and finish
            await new Promise(resolve => {
                function onend() {
                    setBufferLength(bufferLength - 1)
                    setCompleted(completed + 1)
                    console.log(completed)
                    resolve()
                }
                console.log('playing')
                audio.play()
                setBufferLength(bufferLength - 1)
                setCompleted(completed + 1)
                audio.onended = onend()
            })
        }

        //If the chapter is not finished, play the next 10 lines
        if (completed < length) {
            azureTTS()
        }

    }

    async function custom(){
        //Send a request to the given ip address
        const response = await fetch('http://20.235.108.4', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({text: chapter.slice(bufferLength, 10)})
        })
        const data = await response.json()
        console.log(data)
        // setBuffer(data)

    }

    function play() {
        if(ttsType == 'local') {
            console.log('local')
            local()
        }
        else if (ttsType == 'azure') {
            console.log('azure')
            azure()
        }
        else if (ttsType == 'custom') {
            console.log('custom')
            custom()
        }
    }

    function pause() {
        const audio = document.getElementById('audio')
        audio.pause()

    }


    return (
        <div>
            {/* List of  chapters styled with DaisyUI and tailwind classes*/}
            <div className="flex flex-col items-center justify-center pt-5">
                <div className="text-5xl text-center hover:translate-y-4 hover:scale-125 transition">Chapter</div>
                {ttsType == null ?
                    <div className="dropdown w-full flex justify-center">
                        <div tabIndex={0} className='w-1/2 py-2 btn m-1 bg-black text-white text-center rounded-lg'>Click</div>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-1/2 mt-20">
                            <li onClick={() => selectTTS('local')}><a>Browser TTS</a></li>
                            <li onClick={() => selectTTS('azure')}><a>Azure TTS</a></li>
                            <li onClick={() => selectTTS('custom')}><a>Custom TTS</a></li>
                        </ul>
                    </div>
                    :
                    <div className="dropdown w-full flex justify-center">
                        <div className='w-1/2 py-2 btn m-1 bg-gray text-gray text-center rounded-lg disabled'>Click</div>
                    </div>
                }
                <div className='w-full text-center'>
                    {/* Play Button play icon small*/}
                    <button className="btn btn-primary btn-square btn-sm m-2" onClick={() => play()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-play ml-1" width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                    </button>

                    {/* Pause Button pause icon small*/}
                    <button className="btn btn-primary btn-square btn-sm m-2" onClick={() => pause()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-pause" width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <rect x="6" y="5" width="4" height="14" rx="1" />
                            <rect x="14" y="5" width="4" height="14" rx="1" />
                        </svg>
                    </button>

                    <progress className="progress w-1/3 m-2" value={completed} max={length}></progress>

                </div>

            </div>

        </div>
    )
}

export default Chapter