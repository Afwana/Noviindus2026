import { createProfileThunk } from "@/features/auth/auth-slice";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";

export default function Details({ phoneNumber }: { phoneNumber: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qualification, setQualification] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfilePicture(null);
    setPreviewUrl(null);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!qualification.trim()) {
      newErrors.qualification = "Qualification is required";
    }
    if (!profilePicture) {
      newErrors.profilePicture = "Profile image is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleGetStart = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const response = await dispatch(
        createProfileThunk({
          mobile: phoneNumber,
          name: name.trim(),
          email: email.trim(),
          qualification,
          profile_image: profilePicture as File,
        }),
      ).unwrap();

      if (response.success) {
        router.push("/instructions");
      } else {
        alert(response.message || "Profile creation failed");
      }
    } catch (error) {
      alert((error as string) || "Failed to create profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between h-full p-7">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 text-[#1C3141]">
            <h2 className="text-2xl font-semibold">Add Your Details</h2>
          </div>
          <div className="flex flex-col gap-5 overflow-y-auto h-[340px]">
            <div className="flex justify-center">
              <div className="relative w-[132px]">
                <label
                  htmlFor="profile-picture"
                  className="cursor-pointer block"
                >
                  <div className="relative flex items-center justify-center border border-dashed border-[#CECECE] rounded-lg h-32 w-[132px] overflow-hidden">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="profile-picture"
                        objectFit="contain"
                        width={120}
                        height={110}
                        className="rounded-lg object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <ImagePlus className="w-6 h-6" color="#343330" />
                        <p className="text-[#CECECE] text-[9px] font-medium mt-2">
                          Add Your Profile picture
                        </p>
                      </div>
                    )}
                  </div>
                </label>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 z-10 bg-[#1C3141] text-white rounded-full p-1 hover:bg-[#324a63]"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {errors.profilePicture && (
              <p className="text-red-500 text-xs">{errors.profilePicture}</p>
            )}
            <div className="relative w-full">
              <div className="flex items-center h-16 w-full border border-[#CECECE] rounded-xl px-4 gap-3 bg-white">
                <label
                  htmlFor="name"
                  className="absolute -top-2 left-4 bg-white px-1 text-xs text-black"
                >
                  Name*
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your Full Name"
                  className="flex-1 outline-none text-[#1C3141] placeholder-gray-400 text-base"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>
            <div className="relative w-full">
              <div className="flex items-center h-16 w-full border border-[#CECECE] rounded-xl px-4 gap-3 bg-white">
                <label
                  htmlFor="email"
                  className="absolute -top-2 left-4 bg-white px-1 text-xs text-black"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="Enter your Email Address"
                  className="flex-1 outline-none text-[#1C3141] placeholder-gray-400 text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
            <div className="relative w-full">
              <div className="flex items-center h-16 w-full border border-[#CECECE] rounded-xl px-4 gap-3 bg-white">
                <label
                  className="absolute -top-2 left-4 bg-white px-1 text-xs text-black"
                  htmlFor="qualification"
                >
                  Your Qualification*
                </label>
                <select
                  id="qualification"
                  className={`flex-1 outline-none text-base ${
                    qualification ? "text-[#1C3141]" : "text-gray-400"
                  }`}
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                >
                  <option className="text-gray-400" value="">
                    Select your Qualification
                  </option>
                  <option className="text-[#1C3141]" value="10th">
                    10th Grade
                  </option>
                  <option className="text-[#1C3141]" value="12th">
                    12th Grade
                  </option>
                  <option className="text-[#1C3141]" value="UG">
                    Under Graduate
                  </option>
                  <option className="text-[#1C3141]" value="PG">
                    Post Graduate
                  </option>
                  <option className="text-[#1C3141]" value="diploma">
                    Diploma
                  </option>
                </select>
              </div>
              {errors.qualification && (
                <p className="text-red-500 text-xs">{errors.qualification}</p>
              )}
            </div>
          </div>
        </div>
        <div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleGetStart()}
            className="btn rounded-[10px] h-[45px] w-full bg-[#1C3141] text-white text-base cursor-pointer"
          >
            {isSubmitting ? "Loading..." : "Get started"}
          </button>
        </div>
      </div>
    </>
  );
}
