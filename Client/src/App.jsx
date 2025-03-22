import React from "react";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Middle from "./Components/Middle";
import Partner from "./Components/Partner";
import Last from "./Components/last";
import Play from "./Components/Play";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Book from "./Components/book";
import Train from "./Components/train";
import Footer from "./Components/footer";
import Signup from "./Components/signup";
import Login from "./Components/login";
import Profile from "./Components/profile";
import InnerPlay from "./Components/innerplay";
import InnerBook from "./Components/innerbook";
import Booknow from   "./Components/booksuccess"


function App() {
  const location = useLocation(); // Get current location for animation

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        fontFamily: "Poppins",
        minHeight: "100vh",
        marginLeft: "15vh",
        marginRight: "15vh",
        marginTop: "2vh",
      }}
    >
      {/* Translate Component */}
      <Navbar />   
      {/* Wrap Routes inside AnimatePresence */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <Home />
                <Middle />
                <Partner />
              </>
            }
          />
         <Route
            path="/signup"
            element={
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.5 }}
              >
                <Signup />
              </motion.div>
            }
          />
            <Route
            path="/login"
            element={
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.5 }}
              >
                <Login />
              </motion.div>
            }
          />
          <Route
            path="/profile"
            element={
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.5 }}
              >
                <Profile />
              </motion.div>
            }
          />
          <Route
            path="/play/:id"
            element={
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.5 }}
              >
                <InnerPlay />
              </motion.div>
            }
          />
          <Route
            path="/book/:id"
            element={
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.5 }}
              >
                <InnerBook />
              </motion.div>
            }
          />
            <Route
            path="/book/:id/booknow"
            element={
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.5 }}
              >
                <Booknow />
              </motion.div>
            }
          />

          {/* Play Page with Motion Animation */}
          <Route
            path="/play"
            element={
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.5 }}
              >
                <Play />
              </motion.div>
            }
          />
            <Route
            path="/book"
            element={
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.5 }}
              >
                <Book />
              </motion.div>
            }
          />
           <Route
            path="/train"
            element={
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.5 }}
              >
                <Train />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
      <Last />
      <Footer />
    </div>
  );
}

export default App;
