
// async function textToSpeech(text) {
//     // const utterance = new SpeechSynthesisUtterance();
//     // utterance.text = text;
//     // utterance.lang = 'en-US';
//     // utterance.volume = 1;
//     // utterance.rate = 1;
//     // utterance.pitch = 5;
//     en - US - JessaNeural

//     // window.speechSynthesis.speak(utterance);


//     //Send the text to the azure tts speech api
//     const response = await fetch('https://centralindia.api.cognitive.microsoft.com/sts/v1.0/issuetoken', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/ssml+xml',
//             'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
//             'Authorization': '7c0dc7d710e54e24b2ad01676daa2fc1',
//             'User-Agent': 'ebook-to-audiobook'
//         },
//         body: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
//         <voice name="">
//             ${text}
//         </voice>
//     </speak>`
//     }).then((response) => {
//         //Get the response blob and play the audio

//     });

// }


// const subscriptionKey = '7c0dc7d710e54e24b2ad01676daa2fc1';
// const region = 'centralindia';
// const voiceName = 'en - US - JessaNeural';
// const format = 'audio-16khz-32kbitrate-mono-mp3'; // Output audio format

// const textToSpeechEndpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

// // Function to send the text to Azure Text-to-Speech service and get the audio blob
// async function textToSpeech(text) {
//     const response = await fetch(`${textToSpeechEndpoint}/synthesize`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/ssml+xml',
//             'X-Microsoft-OutputFormat': format,
//             'Authorization': `Bearer ${await getAccessToken()}`
//         },
//         body: `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${voiceName}'>${text}</voice></speak>`
//     });

//     if (!response.ok) {
//         throw new Error(`Failed to synthesize speech: ${response.status} - ${await response.text()}`);
//     }

//     const blob = response.blob();
//     const audio = new Audio(URL.createObjectURL(blob));
//     audio.play();
// }

// // Function to get the access token required for Azure Text-to-Speech service
// async function getAccessToken() {
//     const response = await fetch(`https://centralindia.api.cognitive.microsoft.com/sts/v1.0/issuetoken`, {
//         method: 'POST',
//         headers: {
//             'Ocp-Apim-Subscription-Key': subscriptionKey
//         }
//     });

//     if (!response.ok) {
//         throw new Error(`Failed to get access token: ${response.status} - ${await response.text()}`);
//     }

//     return await response.text();
// }
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

function textToSpeech(text) {
    const speechConfig = sdk.SpeechConfig.fromSubscription("7c0dc7d710e54e24b2ad01676daa2fc1", "centralindia");
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();

    const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    speechSynthesizer.speakTextAsync(text,
        result => {
            if (result) {
                speechSynthesizer.close();
                //Play the audio
                const audio = new Audio(URL.createObjectURL(result.audioData));
                audio.play();
            }
        },
        error => {
            console.log(error);
            speechSynthesizer.close();
        });
}

export default textToSpeech