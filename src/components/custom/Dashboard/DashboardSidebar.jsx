import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BriefcaseMedical,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function DashboardSidebar({ navLinks, personDetails }) {
  const [expanded, setExpanded] = useState(true);
  const [openItems, setOpenItems] = useState({});
  const [userDetails, setUserDetails] = useState(null);

  const location = useLocation();
  const toggleSidebar = () => setExpanded(!expanded);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:9002/auth/logout", {
        withCredentials: true,
      });
      setUser(null);
      if (res.status == 200) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      setUserDetails(user);
    }
  }, [user]);

  const toggleItem = (name) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-gray-800 text-white",
        expanded ? "w-80" : "w-16",
        "transition-all duration-300 ease-in-out h-screen relative"
      )}
    >
      <div className="flex flex-col">
        <div className={cn("flex h-16 items-center justify-between px-3 py-2")}>
          {expanded && (
            <Link to="/" className="flex items-center gap-4 text-white">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={`/assets/images/brain-logo.png` || ""}
                  alt={""}
                />
              </Avatar>
              <span className="text-lg font-extrabold text-center">
                NeuroSentinel
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 bg-neutral-400 hover:bg-neutral-100 text-white hover:text-white",
              expanded ? "ml-auto" : "mx-auto"
            )}
            onClick={toggleSidebar}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
        {expanded && (
          <div className="flex flex-col items-center text-center gap-3 px-3 py-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={
                  `http://localhost:9002/uploads/${userDetails?.profileImage}` ||
                  ""
                }
                alt={userDetails?.firstName}
              />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold">
                {`${userDetails?.firstName} ${userDetails?.lastName}`}
              </span>
              <span className="text-xs text-muted-foreground font-semibold">
                {userDetails?.role}
              </span>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-grow mt-4">
        <nav className="flex flex-col gap-3 pl-2 relative z-20">
          {navLinks &&
            navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <div key={item.href}>
                  <button
                    className={cn(
                      "flex items-center rounded-l-full text-lg gap-3 w-full px-4 py-2 font-medium text-white transition-all hover:bg-gray-500 hover:text-foreground",
                      isActive ? "bg-gray-500 hover:bg-gray-500" : "",
                      !expanded && "justify-center"
                    )}
                    onClick={() =>
                      item.subItems
                        ? toggleItem(item.name)
                        : navigate(item.href)
                    }
                  >
                    <Icon className="h-6 w-6 flex-shrink-0" />
                    {expanded && <span>{item.name}</span>}
                    {item.subItems && expanded && (
                      <span className="ml-auto">
                        {openItems[item.name] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </button>

                  {item.subItems && expanded && (
                    <motion.ul
                      className="ml-8 mt-2 space-y-1"
                      initial="collapsed"
                      animate={openItems[item.name] ? "open" : "collapsed"}
                      variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: {
                          opacity: 0,
                          height: 0,
                          overflow: "hidden",
                        },
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        return (
                          <li key={subItem.name} className="ps-4">
                            <Link
                              to={`${subItem.href}`}
                              className="flex items-center gap-2 p-2 text-md rounded-lg hover:bg-gray-500 transition-colors"
                            >
                              <SubIcon className="h-4 w-4 flex-shrink-0" />
                              {subItem.name}
                            </Link>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </div>
              );
            })}
        </nav>
      </ScrollArea>

      <div className="p-2">
        <Button
          onClick={handleLogout}
          variant="default"
          type="button"
          className={cn(
            "w-full justify-start gap-2 text-md rounded-full p-6 bg-gray-500 text-white hover:bg-neutral-300/70",
            !expanded && "justify-center"
          )}
        >
          <LogOut className="h-6 w-6 flex-shrink-0" />
          {expanded && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
