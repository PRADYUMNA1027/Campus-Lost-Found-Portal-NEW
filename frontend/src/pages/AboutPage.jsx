import React from 'react';
import { FiShield, FiLock, FiCheckCircle, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
          <FiShield className="w-4 h-4 text-blue-600" />
          <span>Official Campus Lost & Found System</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          About Our Belongings Recovery Portal
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Designed to connect students, faculty, and security personnel to quickly register, verify, and return lost items across campus.
        </p>
      </div>

      {/* Security & Verification Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FiLock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Privacy Protected Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Specific identification details and serial numbers are kept hidden from public listings. Finders specify custom verification questions that only the true owner can answer.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FiCheckCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Safe Physical Handover</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            High-value items such as laptops, phones, and wallets are held safely at designated campus security desks until claims are reviewed and approved by staff.
          </p>
        </div>
      </div>

      {/* Campus Safety Desk Info */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6">
        <h3 className="text-xl font-bold">Campus Security Office Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="flex items-start space-x-3">
            <FiMapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Location</span>
              <span>Student Union Building, Room 102, Main Campus</span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FiPhone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Phone Helpline</span>
              <span>(555) 019-2834 / Ext. 4400</span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FiMail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Official Email</span>
              <span>lostandfound@campus.edu</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;
