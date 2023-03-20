import React from 'react'
import { useState, useRef } from 'react'
import ePub from 'epubjs';
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png'

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
      if (itemName === name) {
        const ch = await book.load(item['href'])
        const body = ch.getElementsByTagName('body')[0].textContent.split('\n');
        const cleanBody = body.filter(function (el) {
          return el != "";
        });
        const cleanerBody = cleanBody.filter(function (el) {
          //Remove all lines with only whitespace
          return el.trim() != "";
        });
        navigate('/chapter', { state: { chapter: cleanerBody } });
      }
    }))
    setModalHidden(true);
  }

  return (
    <div className='bg-[#F0E8E2] h-screen'>
      {/* Tailwind CSS class with div to show website title as "Ebook" stylized in cursive */}
      <div className=''>
        {/* Align the image to the right end */}
        <div className='col-span-1 flex justify-center'>
          <img src={logo} className='hover:scale-110 transition'></img>
        </div>
        <div className=' mt-10 text-5xl transition flex justify-center
        //Cursive letters
        font-serif
        //Color
        text-[#555555]
        '>Ebook to Audiobook</div>
      </div>
      <div htmlFor="myFileInput" className="mt-10 block text-center font-medium mb-2 text-gray-700">
        Select a file:
      </div>
      <div className='w=full flex items-center justify-center'>
      <input
        type="file"
        id="myFileInput"
        onChange={handleFileUpload}
        className="border border-gray-400 focus:border-blue-500 px-4 py-2 w-1/2 rounded-md"
      />
      </div>
      <div>
        {/* Always visible modal */}
        <div className="fixed z-10 my-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" hidden={modalHidden}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-[#F0E8E2] px-4 pt-5 pb-4 sm:p-6 rounded-md">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                  Select a chapter
                </h3>
                <div className="text-sm text-[#555555]">
                  {toc.map((item, index) => (
                    <div key={index} className="flex items-center mb-2 p-2 rounded-md hover:bg-[#ffdcb6]" onClick={() => selectChapter(index)}>
                      <label htmlFor={item.label} className="ml-2">{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Home