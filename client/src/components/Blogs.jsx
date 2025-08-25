import React, { useMemo } from 'react'
import { blogCategories } from '../assets/assets'
import { useState } from 'react';
import BlogCard from './BlogCard';
import { useAppContext } from '../../context/AppContext';
import CategoryMenu from './CategoryMenu';


const Blogs = () => {
  const [menu, setMenu] = useState("all");
  const { blogsByStatus, input = '' } = useAppContext()

  const blogs = useMemo(() => {
    return blogsByStatus["published"] || [];
  }, [blogsByStatus]);


  const filteredBlogs = () => {
    if (input === '') {
      return blogs
    }
    return blogs.filter((blog) => blog.title.toLowerCase().includes(input.
      toLowerCase()) || blog.category.toLowerCase().includes(input.toLowerCase()))
  }


  return (
    <div>
      <CategoryMenu categories={blogCategories} menu={menu} setMenu={setMenu} />

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4
         gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40'>
        {filteredBlogs().filter((blog) => menu === "all" ? true : blog.category.toLowerCase() === menu).
          map((blog) => <BlogCard key={blog._id} blog={blog} />)}
      </div>
    </div>
  )
}

export default Blogs