import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import textToSpeech from '../textToSpeech';


async function azureTTS(chapter) {
    let buffer = [];
    let completed = 0;
    const speechConfig = sdk.SpeechConfig.fromSubscription("7c0dc7d710e54e24b2ad01676daa2fc1", "centralindia");
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
    const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    for (let i = 0; i < chapter.length; i++) {
        console.log("Chapter", chapter[i]);
        let bufferItem = new Promise (() => {
            speechSynthesizer.speakTextAsync(chapter[i],
                result => {
                    if (result) {
                        console.log(chapter[i])

                        console.log("Completed");
                        completed++;
                        return result.audioData;
                    }
                },
                error => {
                    console.log(error);
                    speechSynthesizer.close();
                });
        })

        buffer.push(bufferItem);
    }

    return buffer;


}

export default azureTTS;