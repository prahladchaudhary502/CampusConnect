import React from 'react';
import { useParams } from 'react-router-dom';
import AddBlog from './AddBlog';
import AddNotice from './AddNotice';

const AddContent = () => {
  const { type } = useParams(); // get type param from url

  if (type !== 'blog' && type !== 'notice') {
    return <p>Invalid content type</p>;
  }

  return (
    <div>
      {type === 'blog' && (
        <div>
          <AddBlog/>
        </div>
      )}

      {type === 'notice' && (
        <div>
          <AddNotice/>
        </div>
      )}
    </div>
  );
};

export default AddContent;
