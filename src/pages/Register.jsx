import React, { useState, useEffect } from "react";
import { Mail, Lock, UserPlus2, Eye, EyeOff, User } from "lucide-react";
import LegalModal from "../components/modals/LegalModal";
import logo from "../assets/skillup-logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/features/auth/authSlice";
import Loader from "../components/loader/Loader";
import background from "../assets/background_2.jpg";

const Register = () => {
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, token,isAuthenticated } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const passwordSeen = () => {
    setShowPassword(!showPassword);
  };

   const {
    data: user,
    isLoading,
    isError,
  } = useGetUserRoleQuery(undefined, {
    skip: !isAuthenticated,
  });


  const handleSubmit = (e) => {
    try {
      e.preventDefault();

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      dispatch(
        registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      );
    } catch (error) {
      throw new Error({ error: error.message, message: "server error" });
    }
  };

  const closeModal = () => setIsModalOpen(null);

  useEffect(() => {
    if (token && user) {
      // role-based redirect
      switch (user.role) {
        case "student":
          navigate("/student");
          break;
        case "instructor":
          navigate("/instructor");
          break;
        case "admin":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    }
  }, [token, user, navigate]);

    if (loading || isLoading) return <Loader />;
  return (
     <div
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className=" text-gray-900 flex justify-center h-screen "
        >
          <div className="max-w-7xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        {/* Left Section */}
        <div className="lg:w-1/2 xl:w-5/12 my-[12%] md:my-[15%] xsm:my-[30%]">
          <img src={logo} className="w-64 mx-auto" alt="SkillUp Logo" />

          <h1 className="text-2xl xl:text-3xl mt-8">
            Sign Up
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-6 mx-auto max-w-xs space-y-5"
          >
            {/* Name */}
            <div className="relative">
              <User size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={passwordSeen}
              >
                {!showPassword ? (
                  <EyeOff size={18} color="#99a1af" />
                ) : (
                  <Eye size={18} color="#99a1af" />
                )}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-5 tracking-wide font-semibold bg-indigo-500 text-white w-full py-3 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-all"
            >
              <UserPlus2 size={20} className="mr-2" />
              Sign Up
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-600 text-center mt-4">
              I agree to the{" "}
              <span
                className="border-b border-gray-500 cursor-pointer"
                onClick={() => setIsModalOpen("terms")}
              >
                Terms of Service
              </span>{" "}
              and{" "}
              <span
                className="border-b border-gray-500 cursor-pointer"
                onClick={() => setIsModalOpen("privacy")}
              >
                Privacy Policy
              </span>
              .
            </p>
          </form>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          />
        </div>
      </div>

      {/* LEGAL MODALS */}
      {isModalOpen === "terms" && (
        <LegalModal type="terms" onClose={closeModal} />
      )}

      {isModalOpen === "privacy" && (
        <LegalModal type="privacy" onClose={closeModal} />
      )}
    </div>
  );
};

export default Register;
