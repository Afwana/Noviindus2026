import BgImage from "../public/images/bgImage.png";
import Image from "next/image";
import commonImage from "../public/images/SideImage.png";
import GetStarted from "@/components/getStarted";
export default function Page() {
  return (
    <div
      className="flex w-full h-screen overflow-hidden"
      style={{ backgroundImage: `url(${BgImage.src})` }}>
      <div className="flex justify-center items-center m-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl bg-gradient-to-b from-[#1C3141] to-[#487EA7] justify-center items-center p-3">
          <div className="hidden md:block relative w-[400px] lg:w-[462px] h-[501px]">
            <Image
              src={commonImage}
              alt="Login image"
              fill
              objectFit="contain"
            />
          </div>
          <div className="bg-white rounded-lg h-full">
            <GetStarted />
          </div>
        </div>
      </div>
    </div>
  );
}
