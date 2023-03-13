// import textToSpeech from './textToSpeech';
// import { useNavigate } from 'react-router-dom';
// async function getChapters(book, name) {
//     const navigate = useNavigate();

//     await book.load(book.spine.each(async function (item) {
//         //Get only chapter name + .xhtml from href
//         const itemName = item['href'].split('/').pop();
//         if(itemName === name) {
//             //Get the chapter text from the item href
            
//             const ch = await book.load(item['href'])

//             const body = ch.getElementsByTagName('body')[0].textContent.split('\n');
//             //Clean the array from empty strings
//             const cleanBody = body.filter(function (el) {
//                 return el != "";
//             });
//             cleanBody.forEach((line) => {
//                 console.log(line)
//             })

//             // textToSpeech(cleanBody[10]);
//             navigate('/chapter', { state: { book: book, chapter: cleanBody } });


//             //Send the clean body to the text to speech function
//             // textToSpeech(cleanBody);
//         }
//     }))
// }

// export default getChapters;