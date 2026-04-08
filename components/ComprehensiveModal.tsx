// components/Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComprehensiveModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000CC] bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full md:w-4/5 relative border border-[#CECECE] h-[630px] lg:h-[690px]">
        <div className="flex items-center justify-between">
          <p className="text-base font-medium text-[#1C3141]">
            Comprehensive Paragraph
          </p>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-xl font-bold cursor-pointer">
            ×
          </button>
        </div>
        <hr className="my-4 h-0.5 text-[#CECECE]" />
        <div className="flex flex-col text-base text-[#1C3141] font-medium gap-3 h-[450px] overflow-scroll lg:overflow-hidden">
          <p>
            Ancient Indian history spans several millennia and offers a profound
            glimpse into the origins of one of the world&apos;s oldest and most
            diverse civilizations. It begins with the Indus Valley Civilization
            (c. 2500-1500 BCE), which is renowned for its advanced urban
            planning, architecture, and water management systems. Cities like
            Harappa and Mohenjo-Daro were highly developed, with sophisticated
            drainage systems and well-organized streets, showcasing the early
            brilliance of Indian civilization. The decline of this civilization
            remains a mystery, but it marks the transition to the next
            significant phase in Indian history. Following the Indus Valley
            Civilization, the Vedic Period (c. 1500-600 BCE) saw the arrival of
            the Aryans in northern India. This period is characterized by the
            composition of the Vedas, which laid the foundations of Hinduism and
            early Indian society.
          </p>
          <p>
            It was during this time that the varna system (social hierarchy)
            began to develop, which later evolved into the caste system. The
            Vedic Age also witnessed the rise of important kingdoms and the
            spread of agricultural practices across the region, significantly
            impacting the social and cultural fabric of ancient India.
          </p>
          <p>
            The 6th century BCE marked a turning point with the emergence of new
            religious and philosophical movements. Buddhism and Jainism, led by
            Gautama Buddha and Mahavira, challenged the existing Vedic orthodoxy
            and offered alternative paths to spiritual enlightenment. These
            movements gained widespread popularity and had a lasting influence
            on Indian society and culture. During this time, the kingdom of
            Magadha became one of the most powerful, laying the groundwork for
            future empires.
          </p>
          <p>
            The Maurya Empire (c. 322-185 BCE), founded by Chandragupta Maurya,
            became the first large empire to unify much of the Indian
            subcontinent. Under Ashoka the Great, the empire reached its zenith,
            and Buddhism flourished both in India and abroad. Ashoka&apos;s
            support for non-violence, his spread of Buddhist teachings, and his
            contributions to governance and infrastructure had a lasting legacy
            on Indian history. His reign marks one of the earliest and most
            notable examples of state-sponsored religious tolerance and moral
            governance.
          </p>
        </div>
        <div className="mt-5 flex justify-end items-center">
          <button
            type="button"
            onClick={onClose}
            className="btn rounded-[10px] h-[46px] w-full md:w-[361px] bg-[#1C3141] text-white text-base cursor-pointer">
            Minimize
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveModal;
