import React, { useState } from 'react';
import { noticeCategories } from '../assets/assets';
import NoticeCard from './NoticeCard';
import CategoryMenu from './CategoryMenu';
import { useAppContext } from '../../context/AppContext';

const Notices = () => {
  const [menu, setMenu] = useState("general");
  const { noticeData = {}, input = '', fetchNotices } = useAppContext();
  const { notices = [], page = 1, totalPages = 1 } = noticeData;

  const filteredNotices = () => {
    if (!notices || notices.length === 0) return [];
    if (input.trim() === '') return notices;

    return notices.filter(
      (notice) =>
        notice.title.toLowerCase().includes(input.toLowerCase()) ||
        notice.category.toLowerCase().includes(input.toLowerCase())
    );
  };

  return (
    <div>
      {/* Categories menu */}
      <CategoryMenu categories={noticeCategories} menu={menu} setMenu={setMenu} />

      {/* Notice List */}
      <div className="flex flex-col gap-4 mb-6 mx-4 sm:mx-8 xl:mx-20">
        {filteredNotices()
          .filter((notice) => menu === "All" ? true : notice.category.toLowerCase() === menu)
          .map((notice) => (
            <NoticeCard key={notice._id} notice={notice} />
          ))}
        {filteredNotices().length === 0 && (
          <p className="text-center text-gray-500">No notices found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => fetchNotices({ pageNum: page - 1, status: "published" })}
        >
          Prev
        </button>
        <span className="text-gray-700 font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => fetchNotices({ pageNum: page + 1, status: "published" })}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Notices;
