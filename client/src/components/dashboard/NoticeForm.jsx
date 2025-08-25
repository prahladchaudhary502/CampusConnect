import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill';
import { useAppContext } from '../../../context/AppContext';
import toast from 'react-hot-toast';
import { noticeCategories } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const NoticeForm = ({ existingNotice = null, onSuccess }) => {
  const { axios, user } = useAppContext();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [title, setTitle] = useState(existingNotice?.title || '');
  const [category, setCategory] = useState(existingNotice?.category || 'general');
  const [audience, setAudience] = useState(existingNotice?.audience || ['all']);
  const [attachments, setAttachments] = useState([]);
  const [status, setStatus] = useState(existingNotice?.status || 'draft');
  const [expiresAt, setExpiresAt] = useState(existingNotice?.expiresAt || '');

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' });

      if (existingNotice?.content) {
        quillRef.current.root.innerHTML = existingNotice.content;
      }
    }
  }, [existingNotice]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const notice = {
        title,
        content: quillRef.current.root.innerHTML,
        category,
        audience,
        status,
        expiresAt,
        createdBy: user._id,
      };

      const formData = new FormData();
      formData.append('notice', JSON.stringify(notice));
      attachments.forEach((file) => formData.append('attachments', file));

      let res;
      if (existingNotice) {
        // UPDATE
        res = await axios.put(`/api/notice/${existingNotice._id}`, formData);
      } else {
        // CREATE
        res = await axios.post('/api/notice', formData);
      }

      if (res.data.success) {
        toast.success(existingNotice ? 'Notice updated successfully' : 'Notice added successfully');
        if (!existingNotice) {
          setTitle('');
          quillRef.current.root.innerHTML = '';
          setAttachments([]);
          setStatus('draft');
          setExpiresAt('');
        }
        onSuccess?.(res.data.notice); // callback for parent to refresh list
        navigate('/dashboard/list/notice');
      } else {
        toast.error(res.data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex-1 bg-gray-50 text-gray-700 h-full w-full'>
      <div className='bg-white w-full p-6 md:p-10 sm:m-10 shadow rounded space-y-6'>

        {/* Title */}
        <div>
          <label className='block font-medium'>Notice Title</label>
          <input
            type="text"
            placeholder='Enter notice title'
            required
            className='w-full p-2 border border-gray-300 rounded mt-2'
            onChange={e => setTitle(e.target.value)}
            value={title}
          />
        </div>

        {/* Category */}
        <div>
          <label className='block font-medium'>Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value.toLowerCase())}
            className='w-full p-2 border border-gray-300 rounded mt-2'
          >
            {noticeCategories.map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {/* Audience */}
        <div>
          <label className='block font-medium'>Audience</label>
          <input
            type="text"
            placeholder='Comma separated (e.g. CSE, ECE, all)'
            className='w-full p-2 border border-gray-300 rounded mt-2'
            onChange={e => setAudience(e.target.value.split(",").map(a => a.trim()))}
            value={audience.join(", ")}
          />
          <p className='text-xs text-gray-500 mt-1'>Default is "all"</p>
        </div>

        {/* Content */}
        <div>
          <label className='block font-medium'>Notice Content</label>
          <div ref={editorRef} className='border border-gray-300 rounded mt-2 min-h-[150px]'></div>
        </div>

        {/* Attachments */}
        <div>
          <label className="block font-medium">Attachments</label>
          <div className="space-y-2 mt-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-gray-700">📎 {file.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={(e) => {
              if (e.target.files[0] && attachments.length < 5) {
                setAttachments([...attachments, e.target.files[0]]);
              }
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={attachments.length >= 5}
            onClick={() => document.getElementById("fileInput").click()}
            className={`mt-3 px-3 py-1 rounded text-sm ${attachments.length >= 5
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            + Add Attachment
          </button>
          {attachments.length >= 5 && (
            <p className="text-xs text-gray-500 mt-1">Max 5 files allowed</p>
          )}
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block font-medium">Expiry Date</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">Leave blank if the notice has no expiry.</p>
        </div>

        {/* Status */}
        <div>
          <label className='block font-medium'>Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded mt-2'
          >
            <option value="draft">Draft</option>
            <option value="published">Publish Now</option>
          </select>
        </div>

        {/* Submit */}
        <button
          disabled={isSubmitting}
          type="submit"
          className='w-40 h-10 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
        >
          {isSubmitting ? (existingNotice ? 'Updating...' : 'Adding...') : (existingNotice ? 'Update Notice' : 'Add Notice')}
        </button>
      </div>
    </form>
  )
}

export default NoticeForm;
