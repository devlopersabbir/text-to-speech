
``` ts
async function makeAudio(sentence: string): AudioBuffer[]{
    //
    db.query("")=> audio
    return audio
    //@ts-ignore
    const audio = await textToSpeech(sentence)
    return audio as AudioBuffer[];
}

audio table->
    id, sentence-> [indexing], Audio[blob]


async function handler(){
const section = "my name is raju. I am from Shahjahanpur. I am a student of B.tech. I am in 3rd year"
const sentences = section.split(".")
console.log(sentences)
const audios = await Promise.all(sentences.map(makeAudio));
    audios[0] = "audio of=> my name is raju" -> 5sec, [{
        text: audio
    }, {
        text: audio
    }]
    audios[1] = "audio of=> I am from Shahjahanpur"
}
```