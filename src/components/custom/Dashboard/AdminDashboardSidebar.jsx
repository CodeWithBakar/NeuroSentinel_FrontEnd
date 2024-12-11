import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  DollarSign,
  UserCog,
  User,
  LogOutIcon,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarNavItems = [
  {
    title: "Home",
    href: "/admin/home",
    icon: Home,
  },
  {
    title: "Manage Patients",
    href: "/admin/registered-patients",
    icon: Users,
  },
  {
    title: "Manage Doctors",
    href: "/admin/registered-doctors",
    icon: UserCog,
  },
  {
    title: "Doctor Requests",
    href: "/admin/doctor-requests",
    icon: UserPlus,
  },
  {
    title: "Payments",
    href: "/admin/payments-history",
    icon: DollarSign,
  },
];

export function AdminDashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleAdminLogout = () => {
    localStorage.removeItem("adminCredentials");
    navigate("/login");
  };

  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-[100px] items-center border-b px-6">
          <span className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <User />
            Admin Dashboard
          </span>
        </div>
        <nav className="grid items-start gap-4 px-4 text-sm font-medium">
          {sidebarNavItems.map((item, index) => (
            <Link key={index} to={item.href}>
              <span
                className={`text-[16px] group flex  items-center rounded-md px-3 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 ${
                  location.pathname === item.href
                    ? "bg-gray-200 dark:bg-gray-800"
                    : "transparent"
                } cursor-pointer`}
              >
                <item.icon className="mr-2 h-6 w-6" />
                <span>{item.title}</span>
              </span>
            </Link>
          ))}
        </nav>
        <div className="flex mt-auto h-[100px] items-center border-t px-4">
          <Button
            onClick={handleAdminLogout}
            className="w-full flex gap-2 justify-start text-md"
          >
            <LogOutIcon />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
