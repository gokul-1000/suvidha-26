import React from 'react'

const DocumentUpload = ({ onChange }) => {
  return (
    <div className="border-2 border-dashed rounded-xl p-6 text-center">
      <p className="text-lg font-semibold text-gray-700">
        Document Upload
      </p>
      <p className="text-sm text-gray-500 mt-2">
        DigiLocker / QR Sync / Offline Upload (Mock)
      </p>

      <button
        className="mt-4 bg-[#138808] text-white px-6 py-3 rounded-lg"
        onClick={() => onChange({ mock: true })}
      >
        Simulate Upload
      </button>
    </div>
  )
}

export default DocumentUpload
