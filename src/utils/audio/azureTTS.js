import * as sdk from 'microsoft-cognitiveservices-speech-sdk';


async function azureTTS(text) {
    const speechConfig = sdk.SpeechConfig.fromSubscription("7c0dc7d710e54e24b2ad01676daa2fc1", "centralindia");
    const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

    const result = await new Promise((resolve, reject) => {
        try {
            speechSynthesizer.speakTextAsync(text)
            speechSynthesizer.synthesisCompleted = (s, e) => {
                const audio = e.result.audioData;
                //Generate wav file from the audio
                console.log("Synthesis completed.")
                const wav = new Blob([audio], { type: 'audio/wav' });
                resolve(wav);
            }
        } catch (error) {
            console.log(error)
            reject(error);
        }
    });

    return result;


}

export default azureTTS;