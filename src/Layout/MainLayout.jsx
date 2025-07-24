




















import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar/Navbar';
import Footer from './footer/Footer';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      {/* <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
      > */}
        <Outlet />
      {/* </motion.main> */}
      <Footer />
    </>
  );
};

export default MainLayout;
