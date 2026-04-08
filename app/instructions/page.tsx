"use client";

import Header from "@/components/layout/Header";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <Header />
      <div className="flex flex-col gap-5 w-full md:w-[682px] h-full items-center justify-center p-5 m-auto bg-[#F4FCFF]">
        <p className="text-xl md:text-[26px] font-medium text-[#1C3141]">
          Ancient Indian History MCQ
        </p>
        <div className="h-[200px] md:h-[135px] w-full flex items-center justify-center bg-[#1C3141] rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            <div className="border-b-2 md:border-b-0 md:border-r-2 border-white flex md:flex-col justify-center items-center text-white gap-1">
              <p className="text-[15px] font-semibold">Total MCQ&apos;s:</p>
              <h2 className="text-xl md:text-[42px]">100</h2>
            </div>
            <div className="border-b-2 md:border-b-0 md:border-r-2 border-white flex md:flex-col justify-center items-center text-white gap-1">
              <p className="text-[15px] font-semibold">Total marks:</p>
              <h2 className="text-xl md:text-[42px]">100</h2>
            </div>
            <div className="flex md:flex-col justify-center items-center text-white gap-1">
              <p className="text-[15px] font-semibold">Total time:</p>
              <h2 className="text-xl md:text-[42px]">90:00</h2>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 text-[#5C5C5C]">
          <h2 className="text-base font-semibold">Instructions:</h2>
          <ol className="list-decimal list-inside text-base" type="1">
            <li>You have 100 minutesto complete the test.</li>
            <li>Test consist of 100 multiple-choice q&apos;s.</li>
            <li>
              You are allowed 2retest attemptsif you do not pass on the first
              try.
            </li>
            <li>Each incorrect answer will incur a negative mark of -1/4.</li>
            <li>
              Ensure you are in quiet environment and have stable internet
              connection.
            </li>
            <li>
              Kepp an eye on the timer, and try to answer all questions within
              the given time.
            </li>
            <li>
              Do not use any external resources such as dictionaries, websites
              or assistance.
            </li>
            <li>
              Complete the test honostly to accurately assess your proficiency
              level.
            </li>
            <li>Check answers before submitting.</li>
            <li>
              Your test result will be displayed immediately after submission,
              indicating whether you have passed or need to retake the test.
            </li>
          </ol>
        </div>
        <div className="w-full flex items-center justify-center">
          <button
            type="button"
            onClick={() => router.push("/test")}
            className="btn rounded-[10px] h-12 w-full bg-[#1C3141] text-white text-base cursor-pointer md:w-[361px]"
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
}
