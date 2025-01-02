import {
  Table,
  TableHead,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { Checkbox } from "./checkbox";
import { Edit2, Trash } from "lucide-react";
import { Button } from "./button";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import UpdateExpense from "./UpdateExpense";

const ExpenseTable = () => {
  const { expenses } = useSelector((store) => store.expense);
  const [localExpense, setLocalExpense] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = async (expenseId) => {
    const newStatus = !checkedItems[expenseId];
    try {
      const res = await axios.put(
        `https://mern-expensetrackerapp-backend.onrender.com/api/v1/expense/${expenseId}/done`,
        { done: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setCheckedItems((prevData) => ({
          ...prevData,
          [expenseId]: newStatus,
        }));
        setLocalExpense(
          localExpense.map((exp) =>
            exp._id === expenseId ? { ...exp, done: newStatus } : exp
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLocalExpense(expenses || []);
  }, [expenses]);

  const totalAmount = localExpense.reduce((acc, expense) => {
    if (!checkedItems[expense._id]) {
      return acc + expense.amount;
    }
    return acc;
  }, 0);

  const count = localExpense.length;

  const removeExpenseHandler = async (expenseId) => {
    try {
      const res = await axios.delete(
        `http://localhost:8001/api/v1/expense/remove/${expenseId}`
      );
      if (res.data.success) {
        toast.success(res.data.message);
        const filteredExpenses = localExpense.filter(
          (expense) => expense._id !== expenseId
        );
        setLocalExpense(filteredExpenses);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg shadow-lg bg-white p-4">
      <Table className="w-full">
        <TableCaption className="text-xl font-semibold text-gray-700 mb-4">
          A list of your recent expenses.
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100 text-gray-600">
            <TableHead className="w-[150px] text-left pl-4 py-3">Mark As Done</TableHead>
            <TableHead className="text-left pl-4 py-3">Description</TableHead>
            <TableHead className="text-left pl-4 py-3">Amount</TableHead>
            <TableHead className="text-left pl-4 py-3">Category</TableHead>
            <TableHead className="text-left pl-4 py-3">Date</TableHead>
            <TableHead className="text-right pr-4 py-3">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody
          style={{
            maxHeight: "300px", // Limit height to show only a few rows
            overflowY: "scroll", // Enable scrolling for remaining rows
          }}
        >
          {localExpense.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                Add Your First Expense
              </TableCell>
            </TableRow>
          ) : (
            localExpense.map((expense) => (
              <TableRow
                key={expense._id}
                className={`hover:bg-gray-50 transition-all duration-200 ${expense.done ? "bg-gray-200" : ""}`}
              >
                <TableCell className="text-center py-3">
                  <Checkbox
                    checked={expense.done}
                    onCheckedChange={() => handleCheckboxChange(expense._id)}
                  />
                </TableCell>
                <TableCell
                  className={`text-left pl-4 py-3 ${expense.done ? "line-through text-gray-500" : ""}`}
                >
                  {expense.description}
                </TableCell>
                <TableCell
                  className={`text-left pl-4 py-3 ${expense.done ? "line-through text-gray-500" : ""}`}
                >
                  {expense.amount}
                </TableCell>
                <TableCell
                  className={`text-left pl-4 py-3 ${expense.done ? "line-through text-gray-500" : ""}`}
                >
                  {expense.category}
                </TableCell>
                <TableCell
                  className={`text-left pl-4 py-3 ${expense.done ? "line-through text-gray-500" : ""}`}
                >
                  {expense.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell className="text-right pr-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      onClick={() => removeExpenseHandler(expense._id)}
                      size="icon"
                      className="rounded-full border text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
                      variant="outline"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <UpdateExpense expense={expense} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

        <TableFooter
          className="bg-gray-100 text-gray-700"
          style={{
            position: "sticky", // Stick footer at the bottom
            bottom: 0,
            zIndex: 1,
          }}
        >
          <TableRow>
            <TableCell className="font-bold text-xl text-gray-700 py-3" colSpan={5}>
              Count
            </TableCell>
            <TableCell className="text-right font-bold text-xl py-3">
              {count}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold text-3xl py-3" colSpan={5}>
              Total
            </TableCell>
            <TableCell className="text-right font-bold text-3xl py-3">
              {totalAmount} ₹
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default ExpenseTable;
