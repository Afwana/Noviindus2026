import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold">
          ×
        </button>
        <div className="text-lg">
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
