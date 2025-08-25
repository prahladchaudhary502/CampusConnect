import React, { useState } from "react";
import NoticeModal from "../pages/NoticeModal"

const NoticeCard = ({ notice }) => {
  const {
    _id,
    title,
    content,
    category,
    audience = [],
    attachments = [],
    status,
    publishedAt,
  } = notice;

  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="w-full border-b border-gray-200 py-4 hover:bg-gray-50 transition"
      >
        {/* Header: title + category */}
        <div className="flex justify-between items-start">
          <h4
            className="text-gray-900 font-medium cursor-pointer hover:underline"
            onClick={() => setOpen(true)}
          >
            {title}
          </h4>
          <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
            {category}
          </span>
        </div>

        {/* Info row: audience, status, date */}
        <div className="flex flex-wrap gap-2 text-gray-500 text-xs mt-1 mb-2">
          <span>Audience: {audience.join(", ")}</span>
          <span>Status: {status}</span>
          {publishedAt && (
            <span>Published: {new Date(publishedAt).toLocaleDateString()}</span>
          )}
        </div>

        {/* Content preview */}
        {content && (
          <div className="text-gray-600 text-sm line-clamp-2 mb-2">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}

        {/* Attachments preview (small links) */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {attachments.map((file, idx) => (
              <a
                key={idx}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-xs hover:underline bg-gray-100 px-2 py-1 rounded"
              >
                {file.filename}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Full modal */}
      <NoticeModal open={open} onClose={setOpen} noticeId={_id} />

    </>
  );
};

export default NoticeCard;
