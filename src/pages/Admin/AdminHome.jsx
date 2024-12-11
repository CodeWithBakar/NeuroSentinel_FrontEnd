import { TotalRevenue } from "@/components/custom/TotalRevenue";
import axios from "axios";
import React from "react";

const AdminHome = () => {
  const [data, setData] = React.useState([]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9002/admin/statistics"
      );
      setData(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Error occured while fetching records !");
    }
  };
  React.useEffect(() => {
    fetchRequests();
  }, []);
  return (
    <React.Fragment>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome to Admin Dashboard</h1>
      </div>
      <TotalRevenue stats={data} />
    </React.Fragment>
  );
};

export default AdminHome;
