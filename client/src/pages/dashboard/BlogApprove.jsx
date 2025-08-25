import React from 'react'
import ListBlog from './ListBlog';

const BlogApprove = () => {

  return (
    <ListBlog statusFilter={["in-review", "rejected"]}/>
  );
}

export default BlogApprove;