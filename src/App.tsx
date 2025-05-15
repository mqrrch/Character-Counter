import { useMemo, useState } from 'react'
import './App.css'

export default function App() {
  const [text, setText] = useState<string>("");
  const [letterDensity, setLetterDensity] = useState<[string, number][]>([]);
  const [isExcludeSpace, setIsExcludeSpace] = useState<boolean>(false);
  const [isSeeMore, setIsSeeMore] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const prefersDarkScheme = window.matchMedia("(prefers-colour-scheme: dark)").matches;
  useMemo(() => {
    if (prefersDarkScheme){
      setIsDarkMode(true);
    } else{
      setIsDarkMode(false);
    }
  }, [prefersDarkScheme])

  const charCount = (text: string): number => {
    if (isExcludeSpace){
      return text.replace(/\s+/g, '').length;
    } else{
      return text.length;
    }
  };

  const wordCount = (text: string):number => {
    const matches = text.match(/\b[\w']+\b/g);
    return matches?.length || 0;
  }

  const letterArray = (text: string) => {
    const matches = text.toUpperCase().match(/[a-zA-z]/g);
    return matches;
  }

  const letterTotal = (text: string): number => {
    const matches = text.match(/[a-zA-z]/g);
    return matches?.length || 0;
  }

  const sentenceCount = (text: string): number => {
    const matches = text.match(/\w[.?!](\s|$)/g);
    return matches?.length || 0;
  }

  useMemo(() => {
    const letters = letterArray(text);
    if (!letters){
      setLetterDensity([]);
      return;
    };
    const count = letters.reduce((prev, char) => {
      prev[char] = (prev[char] || 0) + 1;
      return prev;
    }, {} as Record<string, number>);
    const sortedCount = Object.entries(count).sort((a, b) => {
      return b[1] - a[1]
    })
    setLetterDensity(sortedCount);
  }, [text])

  return (
    <>
      <div className={`fixed top-0 left-0 w-full h-screen ${isDarkMode ? 'bg-[rgb(14,14,14)]' : 'bg-[#f1f1f1]'} z-[-2]`}></div>
      <div className={`my-3 w-[90%] max-w-[800px] mx-auto ${isDarkMode ? 'text-gray-300' : 'text-slate-800'}`}>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg'>Character Counter</h3>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`fa-solid fa-sun cursor-pointer ${isDarkMode ? 'bg-[rgb(40,40,40)]' : 'bg-[#d1d1d1]'} rounded p-1.5`}
          ></button>
        </div>

        <h1 className='text-3xl font-semibold text-center mt-6'>Analyze your text.</h1>
        <textarea 
          className='border-2 border-[rgb(60,60,60)] rounded resize-none w-full mt-4 p-2 text-sm'
          rows={6} 
          name='text'
          id='text'
          onChange={(e) => setText(e.currentTarget.value)}
          value={text}
        ></textarea>

        <div className='flex items-center gap-2'>
          <input 
            type='checkbox' 
            name='exclude-space-checkbox' 
            id='exclude-space-checkbox' 
            onChange={() => setIsExcludeSpace(!isExcludeSpace)}
            checked={isExcludeSpace}
            className='w-4 h-4 appearance-none border-2 border-[rgb(60,60,60)] rounded checked:bg-green-400'
          ></input>
          <label 
            htmlFor='exclude-space-checkbox'
            className='mt-0.5'
          >
              Exclude space
          </label>
        </div>

        <div className='flex flex-col sm:flex-row mt-6 gap-4'>
          <div className={`bg-indigo-500 p-4 rounded-lg text-[rgb(14,14,14)] flex-1 shadow-md ${isDarkMode ? 'shadow-black' : 'shadow-gray-500'}`}>
            <p className='text-3xl font-semibold'>{charCount(text)}</p>
            <p className='text-xl'>Total Characters</p>
          </div>
          <div className={`bg-orange-400 p-4 rounded-lg text-[rgb(14,14,14)] flex-1 shadow-md ${isDarkMode ? 'shadow-black' : 'shadow-gray-500'}`}>
            <p className='text-3xl font-semibold'>{wordCount(text)}</p>
            <p className='text-xl'>Total Words</p>
          </div>
          <div className={`bg-red-500 p-4 rounded-lg text-[rgb(14,14,14)] flex-1 shadow-md ${isDarkMode ? 'shadow-black' : 'shadow-gray-500'}`}>
            <p className='text-3xl font-semibold'>{sentenceCount(text)}</p>
            <p className='text-xl'>Total Sentences</p>
          </div>
        </div>

        <div className='mt-6'>
          <h3 className='text-lg'>Letter Density</h3>
          {letterDensity.length === 0 && (
            <p>-</p>
          )}
          <div className={`mt-2 flex flex-col gap-2 overflow-hidden ${isSeeMore ? 'h-auto' : `${letterDensity.length > 5 ? 'h-[8.5rem]' : 'h-auto'}`}`}>
            {letterDensity.map((letter, index) => (
              <div 
                key={index}
                className='flex gap-2 items-center'
              >
                <p className='w-5 text-sm'>{letter[0]}</p>
                <div className='flex-1 h-4 bg-[rgb(20,20,20)] rounded-full'>
                  <div className='h-full bg-blue-400 rounded-full' style={{width: `${(letter[1] / letterTotal(text) * 100).toFixed(2)}%`}}></div>
                </div>
                <p className='text-nowrap w-[11ch] text-right text-sm'>{letter[1]} ({(letter[1] / letterTotal(text) * 100).toFixed(2)}%)</p>
              </div>
            ))}
          </div>
          {letterDensity.length > 5 && (
            <button 
              className='cursor-pointer mt-1'
              onClick={() => setIsSeeMore(!isSeeMore)}
            >
              {isSeeMore ? 'See less' : 'See more'}
            </button>
          )}
        </div>
      </div>
    </>
  )
}