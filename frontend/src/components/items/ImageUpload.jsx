import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiTrash2, FiImage, FiAlertCircle } from 'react-icons/fi';

const ImageUpload = ({ onImageChange, error }) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    setValidationError('');

    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setValidationError('Please upload a valid image file (PNG, JPG, or JPEG).');
      return;
    }

    // Validate file size (Max 5 MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setValidationError('Image size must be less than 5 MB.');
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      if (onImageChange) {
        onImageChange(file, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    validateAndProcessFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setValidationError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageChange) {
      onImageChange(null, null);
    }
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-semibold text-slate-800">
        Upload Item Photo <span className="text-slate-400 font-normal">(Optional but recommended)</span>
      </label>

      {preview ? (
        /* Image Preview Box - Shown ONLY after selecting an image */
        <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4 overflow-hidden group">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
              <img
                src={preview}
                alt="Selected Item Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <FiImage className="mr-1.5" /> Photo Attached Successfully
              </div>
              <p className="text-sm font-medium text-slate-700">
                Ready for submission with report.
              </p>
              
              <button
                type="button"
                onClick={handleRemoveImage}
                className="inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
              >
                <FiTrash2 className="w-4 h-4 mr-1.5" /> Remove Image
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload State - Displayed on page load */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
          />

          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <FiUploadCloud className="w-6 h-6" />
          </div>

          <p className="text-sm font-semibold text-slate-800">
            Drag & Drop an image here
          </p>
          <p className="text-xs text-slate-400 mt-1 mb-3">
            or click to browse your files
          </p>

          <span className="inline-block px-4 py-2 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors">
            Choose File
          </span>

          <p className="text-[11px] text-slate-400 mt-3 font-medium">
            PNG, JPG, JPEG — Max 5 MB
          </p>
        </div>
      )}

      {/* Error messages */}
      {(validationError || error) && (
        <div className="flex items-center space-x-1.5 text-xs text-red-600 mt-1">
          <FiAlertCircle className="shrink-0" />
          <span>{validationError || error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
