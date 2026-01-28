import { useState } from "react";
import InputBox from "../InputFields";
import { X, Plus, Eye, EyeOff } from "lucide-react";
function InstructorForm({
  setInstructorData,
  instructorData,
  addExpertise,
  updateExpertise,
  deleteExpertise,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setInstructorData({
      ...instructorData,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.name, e.target.value);
  };

  const passwordSeen = () => {
    setShowPassword(!showPassword);
  };

  return (
    <fieldset className="flex flex-col gap-4 mx-[5%] bg-green-300 rounded-xl">
      <legend className=" text-3xl font-semibold font-Montserrat text-center text-orange-500">
        Instructor Details
      </legend>
      {/* <legend>Instructor</legend> */}
      <form className="grid md:grid-cols-2 grid-cols-1 gap-4 px-6 py-8 rounded-md  w-full">
        <InputBox
          label="Full Name"
          type="text"
          name="name"
          value={instructorData.name}
          onChange={handleInputChange}
        />
        <InputBox
          label="Email"
          type="email"
          name="email"
          value={instructorData.email}
          onChange={handleInputChange}
        />
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-white text-lg font-semibold font-Montserrat"
          >
            Password
          </label>
          <div className="relative">
            <input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              className="shadow-md rounded-lg px-4 py-2  focus:outline-none border-b border-white text-white font-semibold w-full"
              onChange={handleInputChange}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={passwordSeen}
            >
              {!showPassword ? (
                <EyeOff size={18} color="#fff" />
              ) : (
                <Eye size={18} color="#fff" />
              )}
            </span>
          </div>
        </div>
        <InputBox
          label="Phone No."
          type="text"
          name="phone"
          value={instructorData.phone}
          onChange={handleInputChange}
        />

        <div className=" flex flex-col gap-1">
          <label
            className="text-white text-lg font-semibold font-Montserrat"
            htmlFor="bio"
          >
            About
          </label>
          <textarea
            id="bio"
            value={instructorData.bio}
            name="bio"
            rows={2}
            onChange={handleInputChange}
            className="shadow-md rounded-lg px-4 py-2  focus:outline-none border-b border-white text-white font-semibold"
          />
        </div>
        <div>
          <label className="flex gap-2 text-white text-lg font-semibold font-Montserrat">
            Experties{" "}
            <Plus
              className="bg-blue-500 rounded-full"
              cursor={"pointer"}
              onClick={addExpertise}
            />
          </label>
          {instructorData.experties.map((exp, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={exp}
                onChange={(e) => updateExpertise(index, e.target.value)}
                className="shadow-md rounded-lg px-4 py-2  focus:outline-none border-b border-white text-white font-semibold w-full"
              />
              <X
                onClick={() => deleteExpertise(index)}
                className="cursor-pointer text-red-500"
              />
            </div>
          ))}
        </div>
      </form>
    </fieldset>
  );
}

export default InstructorForm;
