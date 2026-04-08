"use client";

import Header from "@/components/layout/Header";
import { Clock, LetterText, StepForward } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ComprehensiveModal from "@/components/ComprehensiveModal";
import SubmitTestModal from "@/components/SubmitTestModal";
import { useRouter } from "next/navigation";
import axios from "axios";

interface IQuestionOption {
  id: number;
  option: string;
  is_correct: boolean;
  image: string;
}

const getOptionKey = (index: number) => String.fromCharCode(65 + index);

interface Questions {
  question_id: number;
  question: string;
  image: string;
  options: IQuestionOption[];
  comprehension: string;
  number: number;
}

interface IQuestionApiResponse {
  success: boolean;
  questions_count: number;
  total_marks: number;
  total_time: number;
  time_for_each_question: number;
  mark_per_each_answer: number;
  negative_mark: number;
  instruction: string;
  questions: Questions[];
}

interface ISubmitAnswerRequestItem {
  question_id: number;
  selected_option_id: number | null;
}

interface ISubmitAnswerResponse {
  success: boolean;
  exam_history_id: string;
  score: number;
  correct: number;
  wrong: number;
  not_attended: number;
  submitted_at: string;
  details: Array<Record<string, unknown>>;
}

export default function Page() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [questionStatus, setQuestionStatus] = useState<Record<number, string>>(
    {},
  );
  const [timeLeft, setTimeLeft] = useState(90 * 60);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/question/list`,
          {
            headers: {
              Authorization: `Bearer ${token || ""}`,
            },
          },
        );
        console.log(response);
        const responseData = response.data as IQuestionApiResponse;
        setQuestions(responseData?.questions);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again later.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenSubmitModal = () => {
    setIsTimerRunning(false);
    setIsSubmitModalOpen(true);
  };

  const handleCloseSubmitModal = () => {
    setIsTimerRunning(true);
    setIsSubmitModalOpen(false);
  };

  const handleOptionChange = (optionId: number) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption) {
      setQuestionStatus((prev) => ({
        ...prev,
        [currentQuestion.number]: "attended",
      }));
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.question_id]: selectedOption,
      }));
    } else {
      setQuestionStatus((prev) => ({
        ...prev,
        [currentQuestion.number]: "not-attended",
      }));
    }
    setSelectedOption(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleOpenSubmitModal();
    }
  };

  const handleMarkForReview = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption) {
      setQuestionStatus((prev) => ({
        ...prev,
        [currentQuestion.number]: "answered-marked",
      }));
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.question_id]: selectedOption,
      }));
    } else {
      setQuestionStatus((prev) => ({
        ...prev,
        [currentQuestion.number]: "marked",
      }));
    }
    setSelectedOption(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  const answeredCount =
    Object.keys(questionStatus).filter(
      (key) => questionStatus[Number(key)] === "attended",
    ).length +
    Object.keys(questionStatus).filter(
      (key) => questionStatus[Number(key)] === "answered-marked",
    ).length;
  const markedForReviewCount = Object.keys(questionStatus).filter(
    (key) => questionStatus[Number(key)] === "marked",
  ).length;

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimerRunning(false);
      handleOpenSubmitModal();
    }
  }, [timeLeft]);

  const handleSubmitTest = async () => {
    try {
      setIsSubmitting(true);
      setIsSubmitModalOpen(false);
      const payload: ISubmitAnswerRequestItem[] = questions.map((question) => {
        const selected = answers[question.question_id];
        return {
          question_id: question.question_id,
          selected_option_id:
            selected === null || selected === undefined ? null : selected,
        };
      });

      const formData = new FormData();
      formData.append("answers", JSON.stringify(payload));
      const token = localStorage.getItem("authToken");
      console.log(token);

      const response = await axios.post<ISubmitAnswerResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/answers/submit`,
        formData,
        {
          timeout: 20000,
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        },
      );
      console.log(response);

      if (response.data?.success === false) {
        alert("Failed to submit test");
        setIsSubmitModalOpen(true);
        return;
      }

      localStorage.setItem(
        "examResult",
        JSON.stringify({
          success: response.data.success ?? true,
          exam_history_id: response.data.exam_history_id ?? "",
          score: response.data.score ?? 0,
          correct: response.data.correct ?? 0,
          wrong: response.data.wrong ?? 0,
          not_attended: response.data.not_attended ?? 0,
          submitted_at: response.data.submitted_at ?? "",
          total_questions: questions.length,
        }),
      );

      router.push("/result");
    } catch (err) {
      console.error("Error submitting answers:", err);
      setIsSubmitModalOpen(true);
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to submit test");
      } else {
        alert("Failed to submit test");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-sm">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (questions?.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-sm">No questions available</p>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F4FCFF]">
        <p className="text-base font-medium text-[#1C3141]">
          Submitting test...
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className="flex flex-col gap-2 w-full">
      <Header />
      <div className="flex flex-col md:flex-row w-full justify-between items-start bg-[#F4FCFF] pt-3">
        <div className="flex-grow flex-col gap-3 md:border-r border-[#E9EBEC] px-5">
          <div className="flex justify-between items-center p-2">
            <p className="text-lg font-medium text-[#1C3141]">
              Ancient Indian History MCQ
            </p>
            <p className="bg-white rounded-sm text-[16px] font-medium p-2 shadow-lg">
              {`${currentQuestion?.number}/${questions.length}`}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 bg-white rounded-[10px] p-5 shadow-lg">
              <button
                type="button"
                onClick={handleOpenModal}
                className="btn rounded-[10px] h-11 w-[293px] bg-[#177A9C] cursor-pointer flex justify-between items-center"
              >
                <div className="flex justify-center items-center w-5 h-5 bg-white rounded-sm ms-4">
                  <LetterText size={14} color="#177A9C" className="" />
                </div>
                <span className="text-white text-[13px] font-medium">
                  Read Comprehensive Paragraph
                </span>
                <div className="flex justify-center items-center w-3.5 h-2 me-4">
                  <StepForward color="white" />
                </div>
              </button>
              <p className="text-lg font-medium text-[#1C3141]">
                {`${currentQuestion?.number}. ${currentQuestion?.question}`}
              </p>
              {currentQuestion?.image && (
                <div className="relative h-[161px] w-[288px]">
                  <Image
                    src={currentQuestion?.image}
                    alt="attachment"
                    fill
                    objectFit="cover"
                    className="rounded-[10px]"
                  />
                </div>
              )}
            </div>
            <p className="text-[#5C5C5C] text-sm font-medium">
              Choose the answer:
            </p>
            {currentQuestion?.options.map((opt, index) => (
              // Map API option shape to UI choice key/value
              <label
                key={index}
                className="flex items-center justify-between border border-[#CECECE] rounded-[8px] w-full h-14 px-5 cursor-pointer"
              >
                <span className="text-lg font-medium text-[#1C3141]">{`${getOptionKey(index)}. ${opt.option}`}</span>
                <input
                  type="radio"
                  value={opt.id}
                  checked={selectedOption === opt.id}
                  onChange={() => handleOptionChange(opt.id)}
                  className="w-5 h-5"
                  color="#1C3141"
                />
              </label>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 mt-3">
            <button
              type="button"
              onClick={handleMarkForReview}
              className="btn rounded-[10px] h-[46px] w-full bg-[#800080] text-white text-base cursor-pointer"
            >
              Mark for review
            </button>
            <button
              type="button"
              onClick={handlePrevious}
              className="btn rounded-[10px] h-[46px] w-full bg-[#CECECE] text-black text-base cursor-pointer"
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="btn rounded-[10px] h-[46px] w-full bg-[#1C3141] text-white text-base cursor-pointer"
            >
              {currentQuestionIndex === questions.length - 1 ? "Save" : "Next"}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-3 w-full md:w-[674px] ms-4 md:ms-0">
          <div className="flex justify-between items-center">
            <p className="text-base font-medium text-[#1C3141]">
              Question No. Sheet:
            </p>
            <div className="flex gap-2 items-center text-base font-medium">
              <p>Remaining Time:</p>
              <p className="bg-black rounded-sm text-base font-medium p-2 shadow-lg text-white timer-div flex items-center gap-2">
                <Clock size={16} /> {formatTime(timeLeft)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-5 lg:grid-cols-10 gap-2 mt-4">
            {Array.from({ length: 100 }, (_, index) => {
              const qNum = index + 1;
              const status = questionStatus[qNum];
              let className =
                "border rounded-lg h-[54px] w-[54px] flex justify-center items-center text-[#1C3141] text-lg font-medium";

              if (status === "attended") {
                className += " bg-[#4CAF50] text-white";
              } else if (status === "not-attended") {
                className += " bg-[#EE3535] text-white";
              } else if (status === "marked") {
                className += " bg-[#800080] text-white";
              } else if (status === "answered-marked") {
                className +=
                  " border-4 border-[#4CAF50] bg-[#800080] text-white";
              }

              return (
                <div key={qNum} className={className}>
                  {qNum}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col lg:flex-row justify-between lg:items-center w-full">
            <div className="flex gap-2 items-center">
              <p className="border rounded-[4px] h-4 w-4 bg-[#4CAF50] border-[#CECECE]"></p>
              <p className="text-[13px] font-semibold">Attended</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className="border rounded-[4px] h-4 w-4 bg-[#EE3535] border-[#CECECE]"></p>
              <p className="text-[13px] font-semibold">Not Attended</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className="border rounded-[4px] h-4 w-4 bg-[#800080] border-[#CECECE]"></p>
              <p className="text-[13px] font-semibold">Marked For Review</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className="border-3 rounded-[4px] h-4 w-4 bg-[#4CAF50] border-[#800080]"></p>
              <p className="text-[13px] font-semibold">
                Answered and Marked For Review
              </p>
            </div>
          </div>
        </div>
      </div>
      <ComprehensiveModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <SubmitTestModal
        isOpen={isSubmitModalOpen}
        onClose={handleCloseSubmitModal}
        onSubmit={handleSubmitTest}
        submitting={isSubmitting}
        remainingTime={formatTime(timeLeft)}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        markedForReviewCount={markedForReviewCount}
        answers={answers}
      />
    </div>
  );
}
