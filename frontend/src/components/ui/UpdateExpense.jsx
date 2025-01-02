import React, { useEffect, useState } from 'react';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogHeader, DialogFooter } from './dialog';
import { Label } from './label';
import { Input } from './input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Edit2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setExpenses, setSingleExpense } from '@/redux/expenseSlice';

const UpdateExpense = ({ expense }) => {
    const { expenses, singleExpense } = useSelector(store => store.expense);
    const [formData, setFormData] = useState({
        description: singleExpense?.description,
        amount: singleExpense?.amount,
        category: singleExpense?.category
    });

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    
    useEffect(() => {
        setFormData({
            description: singleExpense?.description,
            amount: singleExpense?.amount,
            category: singleExpense?.category
        });
    }, [singleExpense]);

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData, [name]: value
        }));
    };

    const changeCategoryHandler = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            category: value
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.put(`http://localhost:8001/api/v1/expense/update/${expense._id}`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedExpenses = expenses.map(exp => exp._id === expense._id ? res.data.expense : exp);
                dispatch(setExpenses(updatedExpenses));
                toast.success(res.data.message);
                setIsOpen(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => {
                        dispatch(setSingleExpense(expense));
                        setIsOpen(true);
                    }} size="icon" className="rounded-full border border-green-600 text-green-600 hover:border-transparent hover:bg-green-600 hover:text-white">
                        <Edit2 />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-800">Update Expense</DialogTitle>
                        <DialogDescription className="text-sm text-gray-600">
                            Update expense here. Click update when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right text-gray-700">Description</Label>
                                <Input
                                    id="description"
                                    placeholder="Description..."
                                    name="description"
                                    className="col-span-3 border rounded-lg p-2 text-sm"
                                    value={formData.description}
                                    onChange={changeEventHandler} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right text-gray-700">Amount</Label>
                                <Input
                                    id="amount"
                                    placeholder="xxx in ₹"
                                    name="amount"
                                    className="col-span-3 border rounded-lg p-2 text-sm"
                                    value={formData.amount}
                                    onChange={changeEventHandler} />
                            </div>
                            <Select value={formData.category} onValueChange={changeCategoryHandler}>
                                <SelectTrigger className="w-[180px] border rounded-lg p-2">
                                    <SelectValue placeholder="Select a Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Investments">Investments</SelectItem>
                                        <SelectItem value="Food">Food</SelectItem>
                                        <SelectItem value="Salary">Salary</SelectItem>
                                        <SelectItem value="Shopping">Shopping</SelectItem>
                                        <SelectItem value="Others">Others</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            {
                                loading ? <Button className="w-full bg-gray-500 text-white my-4" disabled>
                                    <Loader2 className="mr-2 h-4 animate-spin" /> Please wait
                                </Button> : <Button type="submit" className="w-full bg-blue-600 text-white my-4">
                                    Update
                                </Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UpdateExpense;
