import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";

export default function PaymentsHistoryPage() {
  const [data, setData] = useState([]);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9002/payment/payments-history"
      );
      setData(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Error occured while fetching records !");
    }
  };
  useEffect(() => {
    fetchPayments();
  }, []);
  return (
    <React.Fragment>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payments Record</h1>
      </div>
      {data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient Name</TableHead>
              <TableHead>Doctor Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((payment, index) => (
              <TableRow key={index}>
                <TableCell>{payment.patientName}</TableCell>
                <TableCell>{payment.doctorName}</TableCell>
                <TableCell>${payment.amount}</TableCell>
                <TableCell>{format(parseISO(payment.date), "PP")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <h1>No Payments history found !</h1>
      )}
    </React.Fragment>
  );
}
