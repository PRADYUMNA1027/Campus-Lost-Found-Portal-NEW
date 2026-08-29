import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiMail, FiPhone, FiMapPin, FiShield, FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                <FiCheckCircle className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Campus <span className="text-blue-400">Lost & Found</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              The official centralized recovery portal connecting students, faculty, and campus safety services to return lost belongings quickly and safely.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/lost-items" className="hover:text-white transition-colors">Browse Lost Items</Link>
              </li>
              <li>
                <Link to="/found-items" className="hover:text-white transition-colors">Browse Found Items</Link>
              </li>
              <li>
                <Link to="/report-lost" className="hover:text-white transition-colors">Report a Lost Item</Link>
              </li>
              <li>
                <Link to="/report-found" className="hover:text-white transition-colors">Report a Found Item</Link>
              </li>
            </ul>
          </div>

          {/* Guidelines & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Verification & Claims</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">How Recovery Works</Link>
              </li>
              <li>
                <Link to="/about#verification" className="hover:text-white transition-colors">Verification Process</Link>
              </li>
              <li>
                <Link to="/about#security" className="hover:text-white transition-colors">Campus Safety Desk</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Student & Staff Portal</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Campus Safety Desk</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>Student Union Building, Room 102, Main Campus</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-blue-400 shrink-0" />
                <span>(555) 019-2834 / Ext. 4400</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-blue-400 shrink-0" />
                <span>lostandfound@campus.edu</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Campus Lost & Found. All Rights Reserved.</p>
          <div className="mt-4 sm:mt-0 flex items-center space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Campus Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
