"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";

export default function CommingSoonPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2023-12-31T00:00:00");

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });

      if (difference < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the email submission
    console.log("Email submitted");
  };

  return (
    <div className="h-[82vh] rounded-md flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-2xl text-white max-w-xl w-full shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <Avatar className="h-20 w-20">
            <AvatarImage src={`/assets/images/logo.png` || ""} alt={""} />
          </Avatar>
        </motion.div>

        <h1 className="text-5xl font-bold mb-4 text-center">Coming Soon</h1>
        <p className="text-center mb-8 text-lg">
          This feature is under process !
        </p>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <motion.div
              key={unit}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.4,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="text-center bg-white bg-opacity-20 rounded-lg p-3"
            >
              <div className="text-4xl font-bold">{value}</div>
              <div className="text-sm uppercase tracking-wide">{unit}</div>
            </motion.div>
          ))}
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-grow bg-white bg-opacity-20 border-none placeholder:text-white placeholder-opacity-70 text-white"
            />
            <Button
              type="submit"
              className="bg-white text-purple-600 hover:bg-opacity-90 transition-colors"
            >
              Notify Me
            </Button>
          </div>
        </motion.form>

        <motion.div
          className="flex justify-center space-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[Facebook, Twitter, Instagram, Mail].map((Icon, index) => (
            <a
              key={index}
              href="#"
              className="text-white hover:text-purple-200 transition-colors"
              aria-label={Icon.name}
            >
              <Icon size={24} />
            </a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
