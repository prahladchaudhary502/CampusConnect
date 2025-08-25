import React from 'react'
import { useParams } from 'react-router-dom';
import ListBlog from './ListBlog';
import ListNotice from './ListNotice';

const ListContent = () => {

  const { type } = useParams(); // get type param from url

  if (type !== 'blog' && type !== 'notice') {
    return <p>Invalid content type</p>;
  }

  return (
    <>
      {type === 'blog' && (
        <ListBlog statusFilter={["draft", "published"]} />
      )}

      {type === 'notice' && (
        <ListNotice />
      )}
    </>
  );
}

export default ListContent;