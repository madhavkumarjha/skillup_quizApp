// InputBox.js
import React from "react";

const InputBox = ({ label, type, name, value, onChange}) => {
  return (
    <div className=" flex flex-col gap-1">
      <p className=" text-lg font-semibold font-Montserrat">
        {label}
      </p>
      <input
        type={type}
        value={value}
        name={name}
        min={type==="number" ? 1 : null}
        onChange={onChange}
        className="shadow-md w-full rounded-lg px-4 py-2  focus:outline-none border-b text-gray-600 border-white  "
      />
    </div>
  );
};

export default InputBox;

