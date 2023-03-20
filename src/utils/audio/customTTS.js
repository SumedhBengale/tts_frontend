import axios from "axios";

async function customTTS(text) {
    //Send a request to the server with plain text to get the audio file

    //Set response type to blob to get the audio file
    axios.defaults.responseType = 'blob';

    const result = await axios.post('/synthesize', {text}, {
        
        Headers: {
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*',
            'Content-Length': text.length,
        },
        responseType: 'blob'
    })

    const audio = result.data;
    console.log(audio)
    //Generate wav file from the audio
    const wav = new Blob([audio], { type: 'audio/wav' });
    return wav;


}

export default customTTS;