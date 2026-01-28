import React, { useState, useEffect } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../redux/features/auth/authSlice";
import LegalModal from "../components/modals/LegalModal";
import logo from "../assets/skillup-logo.png";
import background from "../assets/background_2.jpg";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import Loader from "../components/loader/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(null);

  const closeModal = () => setIsModalOpen(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(loginUser({ email, password })).unwrap();

      toast.success("Logged in successfully");

      switch (res.user.role) {
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
    } catch (error) {
      toast.error(error?.message || "Login failed");
    }
  };

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
        {/* Left Section (Form) */}
        <div className="lg:w-1/2 xl:w-5/12 my-[12%] md:my-[15%] xsm:my-[30%]">
          <div>
            <img src={logo} className="w-64 mx-auto" alt="SkillUp Logo" />
          </div>

          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign In</h1>

            <form className="w-full flex-1 mt-8" onSubmit={handleSubmit}>
              {/* --- Email Form --- */}
              <div className="mx-auto max-w-xs space-y-5">
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  />
                </div>

                <button
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  type="submit"
                  disabled={loading}
                  // onClick={handleSubmit}
                >
                  {loading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    <>
                      <LogIn size={20} className="mr-2" />
                      Sign In
                    </>
                  )}
                </button>

                <p className="mt-6 text-xs text-gray-600 text-center">
                  I agree to abide by SkillUp’s{" "}
                  <span
                    onClick={() => setIsModalOpen("terms")}
                    className="border-b cursor-pointer border-gray-500 border-dotted"
                  >
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span
                    onClick={() => setIsModalOpen("privacy")}
                    className="border-b cursor-pointer border-gray-500 border-dotted"
                  >
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>
            </form>
          </div>
        </div>
        {isModalOpen === "terms" && (
          <LegalModal type="terms" onClose={closeModal} />
        )}

        {isModalOpen === "privacy" && (
          <LegalModal onClose={closeModal} type="privacy" />
        )}

        {/* Right Side Image */}
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
    </div>
  );
};

export default Login;
