import React from "react";
import { X } from "lucide-react";
import { privacyPolicy, termsConditions } from "../../constant/legalContent";

function LegalModal({ type = "privacy", onClose }) {
  const data = type === "privacy" ? privacyPolicy : termsConditions;
  const { title, sections } = data;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="relative flex flex-col items-start bg-white max-w-2xl w-full rounded-2xl p-6 shadow-lg overflow-y-auto max-h-[80vh]">

        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        {data.lastUpdated && (
          <p className="text-sm text-gray-500 mb-4">
            Last updated: {data.lastUpdated}
          </p>
        )}
        {data.effectiveDate && (
          <p className="text-sm text-gray-500 mb-4">
            Effective Date: {data.effectiveDate}
          </p>
        )}

        {sections.map((section, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-medium text-lg mb-1">{section.heading}</h3>
            {Array.isArray(section.content) ? (
              <ul className="list-disc ml-5 space-y-1 text-gray-700">
                {section.content.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">{section.content}</p>
            )}
          </div>
        ))}

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default LegalModal;
