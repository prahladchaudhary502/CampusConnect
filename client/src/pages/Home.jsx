import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Blogs from '../components/Blogs';
import Notices from '../components/Notices';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

const Home = () => {
  const [activeTab, setActiveTab] = useState('Blog'); // 'Blog' or 'Notice'

  return (
    <>
      <Navbar />
      <Header />

      {/* Tab Switcher */}
      <div className="flex justify-center gap-4 my-6">
        {['Blog', 'Notice'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-medium transition
              ${activeTab === tab ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-primary hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Blog' ? <Blogs /> : <Notices />}

      <Newsletter/>
      <Footer />
    </>
  );
};

export default Home;
