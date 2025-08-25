import React, { useRef } from 'react'
import { assets } from '../assets/assets';
import { useAppContext } from '../../context/AppContext';

const Header = () => {
  const { setInput, input } = useAppContext()
  const inputRef = useRef()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setInput(inputRef.current.value)
  }

  const onClear = () => {
    setInput('')
    inputRef.current.value = ''
  }

  return (
    <div className='mx-8 sm:mx-16 xl:mx-24 relative'>
      <div className='text-center mt-20 mb-8'>
        <div className="inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm">
          <p className="font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide drop-shadow-sm">
            New: <span className="text-primary">AI feature integrated</span>
          </p>
          <img src={assets.star_icon} className="w-2.5" alt="star" />
        </div>

        <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-600'>
          MNNIT <span className='text-violet-500'>Blogging & Notice</span> Platform.
        </h1>

        <p className='my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500'>
          For students, faculty, and staff to post, browse, and stay updated with college-wide blogs and notices.
          Role-based access, tag-based discovery, and content you can trust.
        </p>

        <form onSubmit={onSubmitHandler} className='flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-grey-300 bg-white rounded overflow-hidden'>
          <input
            ref={inputRef}
            type="text"
            placeholder='Search blogs and notices'
            required
            className='w-full pl-4 outline-none'
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-md shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-200 cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      <div className='text-center'>
        {
          input && (
            <button onClick={onClear} className='border font-light text-xs py-1 px-3 rounded-sm shadow-custom-sm cursor-pointer'>
              Clear Search
            </button>
          )
        }
      </div>

      <img src={assets.gradientBackground} alt="" className='absolute -top-50 -z-1 opacity-50' />
    </div>
  )
}

export default Header
