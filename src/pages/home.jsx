import React from 'react'
import { useState, useRef } from 'react'
import ePub from 'epubjs';
import { useNavigate } from "react-router-dom";

function Home() {
  const [toc, setToc] = useState([]);
  const navigate = useNavigate();
  const [modalHidden, setModalHidden] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [book, setBook] = useState(null);

  function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = reader.result;
      const book = ePub(arrayBuffer);
      setBook(book);
      book.ready.then(() => {
        //First check if toc exists
        if (!book.navigation && !book.navigation.toc) return;
        const toc = book.navigation.toc;
        setToc(toc);
        console.log("Book: ", book)
        console.log("TOC: ", toc)
        // navigate('/book', { state: { book: book, toc: toc } });
        setModalHidden(false);
        
      })
    };
    reader.readAsArrayBuffer(file);
  }

  async function selectChapter(index) {
    setSelectedChapter(toc[index].label);
    const spineIndex = book.navigation.toc[index];
    const name = spineIndex['href'].split('/').pop();
    await book.load(book.spine.each(async function (item) {
      const itemName = item['href'].split('/').pop();
      if(itemName === name) {
          const ch = await book.load(item['href'])
          const body = ch.getElementsByTagName('body')[0].textContent.split('\n');
          const cleanBody = body.filter(function (el) {
              return el != "";
          });
          navigate('/chapter', { state: { chapter: cleanBody } });
      }
  }))
    setModalHidden(true);
  }

  return (
    <>
      {/* Tailwind CSS class with div to show website title as "Ebook" stylized in cursive */}
      <div className='grid grid-cols-1'>
        <div className=' mt-10 text-5xl text-center hover:translate-y-4 hover:scale-125 transition'>Ebook to Audiobook</div>

        <div className="flex flex-col items-center justify-center h-screen">

          <label htmlFor="myFileInput" className="block font-medium mb-2 text-gray-700">
            Select a file:
          </label>
          <input
            type="file"
            id="myFileInput"
            onChange={handleFileUpload}
            className="border border-gray-400 focus:border-blue-500 px-4 py-2 w-1/2 rounded-md"
          />


          <div>

            {/* Always visible modal */}
            <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" hidden={modalHidden}>
              <div className="flex items-center justify-center min-h-screen">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                      Select a chapter
                    </h3>
                    <div className="text-sm text-gray-500">
                      {toc.map((item, index) => (
                        <div key={index} className="flex items-center mb-2 p-2 rounded-md hover:bg-gray-200" onClick={()=>selectChapter(index)}>
                          <label htmlFor={item.label} className="ml-2">{item.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home