"use client";

import { Country, getCountryCodes } from "@/actions/registrationPageActions";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useLoading } from "@/hooks/context/LoadingContext";
import toast from "react-hot-toast";
import { getData } from "@/actions/crud-actions";
import { DASHBOARD_PAGE, REGISTRATION_PAGE, USERS } from "@/config/constants";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "@/store/authSlice";
import type { AppDispatch } from "@/store";

const signinSchema = z.object({
  mobileNumber: z
    .string()
    .min(10, "Mobile Number must be exactly 10 digits.")
    .max(10, "Mobile Number must be exactly 10 digits.")
    .regex(/^\d{10}$/, "Mobile Number must be exactly 10 digits."),
});

type SigninType = z.infer<typeof signinSchema>;

const Signin = () => {
  const [showOtpfield, setShowOtpField] = useState<Boolean>(false);
  const [userStatus, setUserStatus] = useState<Boolean>(false);
  const { setLoading: setModalLoading } = useLoading();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninType>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = (data: SigninType) => {
    setModalLoading(true);
    const response = getData(USERS, "mobileNumber", data.mobileNumber);

    if (response.mobileNumber) {
      setModalLoading(false);
      dispatch(setCurrentUser(response));
      sessionStorage.setItem("currentUser", JSON.stringify(response));
      setUserStatus(true);
      setTimeout(() => {
        toast.success("OTP sent successfully!");
        setShowOtpField(true);
      }, 1000);
    } else {
      setModalLoading(false);
      toast.error("User does not exist.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100 dark:bg-gray-900 transition-colors">
      <div className="text-slate-700 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <div>
          <h2 className="text-center font-bold text-xl p-4">Sign In</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          <div>
            <label className="block mb-1 font-bold">Mobile Number</label>
            <input
              {...register("mobileNumber")}
              type="tel"
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-100 transition-colors"
              placeholder="9876543210"
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mobileNumber.message}
              </p>
            )}
          </div>

          {showOtpfield && userStatus ? (
            <div>
              <div className="mb-2">
                <label className="block mb-1 font-bold">Enter OTP</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-100 transition-colors"
                />
              </div>
              <button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                onClick={() => {
                  setModalLoading(true);
                  router.push(DASHBOARD_PAGE);
                  toast.success("OTP verified");
                }}
              >
                Verify OTP
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
            >
              Send OTP
            </button>
          )}
        </form>
        <div className="p-2">
          <p
            className="text-blue-500 text-right hover:underline cursor-pointer"
            onClick={() => {
              setModalLoading(true);
              router.push(REGISTRATION_PAGE)
            }}
          >
            Register Here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
