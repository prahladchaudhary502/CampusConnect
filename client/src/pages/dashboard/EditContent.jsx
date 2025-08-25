import React from 'react';
import { useParams } from 'react-router-dom';
import EditNotice from './EditNotice';
import EditBlog from './EditBlog';

const EditContent = () => {
  const { type } = useParams();

  if (type !== 'blog' && type !== 'notice') {
    return <p>Invalid content type</p>;
  }

  return (
    <div>
      {type === 'blog' && (
        <div>
          <EditBlog/>
        </div>
      )}

      {type === 'notice' && (
        <div>
          <EditNotice/>
        </div>
      )}
    </div>
  );
};

export default EditContent;
