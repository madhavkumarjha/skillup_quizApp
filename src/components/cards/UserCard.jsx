import React from "react";

function UserCard({ person }) {
  return (
    <div className="flex items-center gap-x-6">
      <div className="w-20 h-20 overflow-hidden rounded-full">
        <img
          alt=""
          src={person?.avatar?.url}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h3 className="text-base/7 font-semibold tracking-tight text-white">
          {person.name}
        </h3>
        <div className="flex gap-2">
          {person?.specializations?.map((skill, index) => (
            <p
              key={index}
              className="text-sm/6 font-semibold text-indigo-400 capitalize"
            >
              {skill}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserCard;
