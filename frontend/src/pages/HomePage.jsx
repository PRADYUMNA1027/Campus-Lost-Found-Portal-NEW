import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MOCK_ITEMS } from '../data/mockData';
import ItemCard from '../components/items/ItemCard';
import SearchBar from '../components/items/SearchBar';
import { 
  FiPlusCircle, 
  FiShield, 
  FiArrowRight, 
  FiCompass, 
  FiLock 
} from 'react-icons/fi';

const HomePage = () => {
  const navigate = useNavigate();

  const recentLost = MOCK_ITEMS.filter((item) => item.status === 'Lost').slice(0, 3);
  const recentFound = MOCK_ITEMS.filter((item) => item.status === 'Found').slice(0, 3);

  const handleSearchSubmit = (filters) => {
    navigate('/lost-items', { state: { filters } });
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-transparent pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold">
                <FiShield className="w-4 h-4 text-blue-600" />
                <span>Official Campus Belongings Recovery Portal</span>
              </div>

              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight"
              >
                Find Your Lost Items <br className="hidden sm:inline" />
                <span className="text-blue-600">with Ease</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Report, search and recover lost belongings across your campus using one secure platform.
              </motion.p>

              {/* Hero CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Link
                    to="/report-lost"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
                  >
                    <FiPlusCircle className="w-5 h-5" />
                    <span>Report Lost</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Link
                    to="/report-found"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-blue-600 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2"
                  >
                    <FiPlusCircle className="w-5 h-5" />
                    <span>Report Found</span>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Hero Right Visual Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.2 },
                scale: { duration: 0.6, delay: 0.2 },
                y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' }
              }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual card stack illustration */}
                <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                        <FiCompass className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Campus Security Station</h4>
                        <p className="text-xs text-slate-500">Live Item Verification</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </div>

                  {/* Sample visual cards in illustration */}
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          LAPTOP
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Lenovo ThinkPad</p>
                          <p className="text-[11px] text-slate-500">Central Library • Lost</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-blue-600">Matching...</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                          PHONE
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">iPhone 14 Pro</p>
                          <p className="text-[11px] text-slate-500">Engineering • Found</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600">Claim Verified</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/70 rounded-2xl flex items-center space-x-2 text-xs text-blue-800 font-medium">
                    <FiLock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Privacy-protected verification system active.</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* 2. SEARCH SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-xl mx-auto mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Instant Campus Item Search</h2>
          <p className="text-sm text-slate-500 mt-1">Filter by category, location, or keywords across all campus logs.</p>
        </div>
        <SearchBar onSearch={handleSearchSubmit} />
      </motion.section>


      {/* 3. RECENT LOST ITEMS */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recent Lost Items</h2>
            <p className="text-sm text-slate-500 mt-0.5">Recently reported lost by students and campus staff</p>
          </div>
          <Link
            to="/lost-items"
            className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>View All Lost</span>
            <FiArrowRight className="ml-1.5 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentLost.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
            >
              <ItemCard item={item} />
            </motion.div>
          ))}
        </div>
      </motion.section>


      {/* 4. RECENT FOUND ITEMS */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recent Found Items</h2>
            <p className="text-sm text-slate-500 mt-0.5">Turned in at security desks or reported by finders</p>
          </div>
          <Link
            to="/found-items"
            className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>View All Found</span>
            <FiArrowRight className="ml-1.5 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentFound.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
            >
              <ItemCard item={item} />
            </motion.div>
          ))}
        </div>
      </motion.section>


      {/* 5. HOW IT WORKS */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900 text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl font-bold">How Recovery Works</h2>
            <p className="text-slate-400 text-sm">
              Our 4-step secure verification process keeps your belongings safe and returns them to their rightful owners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-bold">Report Item</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Post lost or found belongings with details, location, date, and optional verification questions.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-bold">Automated Match</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                System matches reported lost items against new found items using category and location signals.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-bold">Submit Claim</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Owners submit claim forms answering verification prompts to establish genuine ownership.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                4
              </div>
              <h3 className="text-lg font-bold">Safe Handover</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Campus admin verifies claim answers and releases item safely at the designated security station.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>


      {/* 6. CALL TO ACTION SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8"
      >
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-card max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Lost Something on Campus Today?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Don't worry! Submit a report right now so campus security and fellow students can help reunite you with your item.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/report-lost"
                className="px-6 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all block"
              >
                Report Lost Item Now
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/lost-items"
                className="px-6 py-3.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all block"
              >
                Browse All Listings
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default HomePage;
