async function localTTS(chapter) {
    // Array of audio buffers
    let buffer = [];
    let completed = 0;

    for (let i = 0; i < chapter.length; i++) {
        //Generate the audio using the browser's TTS engine
        let utterance = new SpeechSynthesisUtterance(chapter[i]);
        utterance.lang = 'en-US';
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        buffer.push(await new Promise((resolve, reject) => {
            utterance.onend = (event) => {
                resolve(event.currentTarget._audioBuffer);
                completed++;
            }
            utterance.onerror = (event) => {
                reject(event);
            }
            speechSynthesis.speak(utterance);
        }
        ));
    }

    return buffer;

}

export default localTTS;