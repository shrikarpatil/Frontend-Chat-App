"use client";

import { Country, getCountryCodes } from "@/actions/registrationPageActions";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useLoading } from "@/hooks/context/LoadingContext";
import toast from "react-hot-toast";
import { createData } from "@/actions/crud-actions";
import { USERS } from "@/config/constants";

const registerSchema = z.object({
  firstName: z.string().min(1, "First Name is required."),
  lastName: z.string().min(1, "Last Name is required."),
  countryCode: z.string().min(1, "Select a country code"),
  mobileNumber: z
    .string()
    .min(10, "Mobile Number must be exactly 10 digits.")
    .max(10, "Mobile Number must be exactly 10 digits.")
    .regex(/^\d{10}$/, "Mobile Number must be exactly 10 digits."),
});

type RegisterType = z.infer<typeof registerSchema>;

const Registration = () => {
  const [countryCodes, setCountryCodes] = useState<Country[]>([]);
  const [showOtpfield, setShowOtpField] = useState<Boolean>(false);
  const [userStatus, setUserStatus] = useState<Boolean>(false);
  const { setLoading: setModalLoading } = useLoading();

  useEffect(() => {
    setModalLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function getDataAsync() {
      const fetchedCountryCodes = await getCountryCodes();
      setCountryCodes(fetchedCountryCodes);
    }
    getDataAsync();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterType) => {
    setModalLoading(true);
    const response = createData(USERS, data, "mobileNumber");

    if (response.status == 200) {
      setModalLoading(false);
      setUserStatus(true);
      toast.success("User creation successful");
      setTimeout(() => {
        toast.success("OTP sent successfully!");
        setShowOtpField(true);
      }, 1000);
    } else if (response.status == 409) {
      setModalLoading(false);
      toast.error("User already exists");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100 dark:bg-gray-900 transition-colors">
      <div className="text-slate-700 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <div>
          <h2 className="text-center font-bold text-xl p-4">Sign Up</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          <div>
            <label className="block mb-1 font-bold">First Name</label>
            <input
              {...register("firstName")}
              type="text"
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-100 transition-colors"
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-bold">Last Name</label>
            <input
              {...register("lastName")}
              type="text"
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-100 transition-colors"
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-bold">Country Code</label>
            <select
              {...register("countryCode")}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-100 transition-colors"
            >
              <option value="">Select a country code</option>
              {countryCodes.map((c) => (
                <option key={c.code} value={c.dialCode}>
                  {c.name} ({c.dialCode})
                </option>
              ))}
            </select>
            {errors.countryCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.countryCode.message}
              </p>
            )}
          </div>

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
                onClick={() => toast.success("OTP verified")}
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
      </div>
    </div>
  );
};

export default Registration;
