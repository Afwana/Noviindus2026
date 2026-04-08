/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Modal.tsx
import { Clock, Copy } from "lucide-react";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitting: boolean;
  remainingTime: string;
  answeredCount: number;
  totalQuestions: number;
  markedForReviewCount: number;
  answers: any;
}

const SubmitTestModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  remainingTime,
  answeredCount,
  totalQuestions,
  markedForReviewCount,
  answers,
}) => {
  console.log(answers);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000CC] bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full md:w-[361px] relative border border-[#CECECE]">
        <div className="flex items-center justify-between">
          <p className="text-base font-medium text-[#1C3141]">
            Are you sure you want to submit the test?
          </p>
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="absolute top-2 right-2 text-xl font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>
        <hr className="my-4 h-0.5 text-[#CECECE]" />
        <div className="flex flex-col text-base text-[#1C3141] font-medium gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-[31px] w-[31px] flex items-center justify-center bg-black rounded-[6px]">
                <Clock color="white" size={14} />
              </div>
              <p className="text-sm text-[#1C3141]">Remaining Time:</p>
            </div>
            <p className="text-lg font-bold">{remainingTime}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-[31px] w-[31px] flex items-center justify-center bg-[#DDA428] rounded-[6px]">
                <Copy color="white" size={14} />
              </div>
              <p className="text-sm text-[#1C3141]">Total Questions:</p>
            </div>
            <p className="text-lg font-bold">
              {String(totalQuestions).padStart(3, "0")}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-[31px] w-[31px] flex items-center justify-center bg-[#4CAF50] rounded-[6px]">
                <Copy color="white" size={14} />
              </div>
              <p className="text-sm text-[#1C3141]">Questions Answered:</p>
            </div>
            <p className="text-lg font-bold">
              {String(answeredCount).padStart(3, "0")}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-[31px] w-[31px] flex items-center justify-center bg-[#800080] rounded-[6px]">
                <Copy color="white" size={14} />
              </div>
              <p className="text-sm text-[#1C3141]">Marked for review:</p>
            </div>
            <p className="text-lg font-bold">
              {String(markedForReviewCount).padStart(3, "0")}
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-center items-center">
          <button
            type="button"
            disabled={submitting}
            onClick={onSubmit}
            className="btn rounded-[10px] h-[46px] w-full md:w-[361px] bg-[#1C3141] text-white text-base cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitTestModal;
