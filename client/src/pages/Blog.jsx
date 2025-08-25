import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Navbar from '../components/Navbar'
import moment from 'moment';
import Footer from '../components/Footer'
import Loader from '../components/Loader';
import CommentSection from '../components/comments/CommentSection';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast'

const Blog = () => {
  const { id } = useParams()

  const { axios } = useAppContext()

  const [data, setData] = useState(null)

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`)
      data.success ? setData(data.blog) : toast.error(data.message)
    } catch (error) {
      console.log.error(error.message)
    }
  }


  useEffect(() => {
    fetchBlogData()
  }, [])

  return data ? (
    <div className='relative'>
      <img src={assets.gradientBackground} alt="" className='absolute -top-50 -z-1 opacity-50' />
      <Navbar />

      <div className='text-center mt-20 text-gray-600'>
        <p
          className={`py-4 font-medium ${data.status === "published"
            ? "text-green-600"
            : data.status === "draft"
              ? "text-yellow-600"
              : data.status === "in-review"
                ? "text-blue-600"
                : data.status === "rejected"
                  ? "text-red-600"
                  : "text-gray-600"
            }`}
        >
          {data.status === "published" && (
            <>Published on {moment(data.createdAt).format("MMMM Do YYYY")}</>
          )}
          {data.status === "draft" && "Currently saved as Draft"}
          {data.status === "in-review" && "This blog is under Review"}
          {data.status === "rejected" && "This blog was Rejected"}
        </p>



        <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>
          {data.title}
        </h1>

        <h2 className='my-5 max-w-lg truncate mx-auto'>{data.subTitle}</h2>

        <p className='inline-block py-1 px-4 rounded-full mb-6 border text-sm border border-primary/35 bg-primary/5 font-medium text-primary'>
          {data.createdBy.username} ({data.createdBy.email})
        </p>
      </div>


      <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
        <img src={data.image} alt="" className='rounded-3xl mb-5' />
        <div className='rich-text max-w-3xl mx-auto' dangerouslySetInnerHTML=
          {{ __html: data.description }}></div>

        {/* comment section */}
        <CommentSection targetId={id} targetType="blog" />

        {/*share buttons */}
        <div className='my-24 max-w-3xl mx-auto'>
          <p className='font-semibold my-4'>Share this article on social media</p>
          <div className='flex'>
            <img src={assets.facebook_icon} width={50} alt="" />
            <img src={assets.twitter_icon} width={50} alt="" />
            <img src={assets.googleplus_icon} width={50} alt="" />
          </div>
        </div>

      </div>
      <Footer />
    </div>
  ) : <Loader />
}

export default Blog