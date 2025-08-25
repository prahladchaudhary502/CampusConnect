import React from "react";

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className }) => (
  <div className={`p-6 ${className || ""}`}>{children}</div>
);

export const DialogHeader = ({ children }) => (
  <div className="mb-4 border-b pb-2 sticky top-0 bg-white z-10">
    {children}
  </div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);
