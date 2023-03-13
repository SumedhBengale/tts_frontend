function createBuffer(chapter){
    //Create a buffer
    const buffer = new AudioBuffer({
        length: chapter.length,
        sampleRate: 44100,
        numberOfChannels: 2
    });

    //Fill the buffer with data
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        // This gives us the actual array that contains the data
        const nowBuffering = buffer.getChannelData(channel);
        for (let i = 0; i < buffer.length; i++) {
            // Math.random() is in [0; 1.0]
            // audio needs to be in [-1.0; 1.0]
            nowBuffering[i] = Math.random() * 2 - 1;
        }
    }

    return buffer;
}

export default createBuffer;