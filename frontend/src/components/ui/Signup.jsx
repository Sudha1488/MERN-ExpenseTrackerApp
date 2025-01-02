import React, { useState } from 'react';
import { Label } from './label';
import { Input } from './input';
import Logo from '../shared/Logo.jsx';
import { Button } from './button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://mern-expensetrackerapp-backend.onrender.com/api/v1/user/register", input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.res.data.message);
        }
    }

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
            <form onSubmit={submitHandler} className="w-96 p-8 bg-white rounded-lg shadow-lg flex flex-col gap-5">
                <div className="w-full flex justify-center mb-5">
                    <Logo />
                </div>
                <div>
                    <Label>Full Name</Label>
                    <Input 
                        value={input.fullname} 
                        onChange={changeHandler} 
                        type="text" 
                        name="fullname" 
                        className="p-3 border border-gray-300 rounded-md w-full mb-3" 
                    />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input 
                        value={input.email} 
                        onChange={changeHandler} 
                        type="email" 
                        name="email" 
                        className="p-3 border border-gray-300 rounded-md w-full mb-3" 
                    />
                </div>
                <div>
                    <Label>Password</Label>
                    <Input 
                        value={input.password} 
                        onChange={changeHandler} 
                        type="password" 
                        name="password" 
                        className="p-3 border border-gray-300 rounded-md w-full mb-5" 
                    />
                </div>
                <Button className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Signup
                </Button>
                <p className="text-sm text-center mt-5">
                    Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
                </p>
            </form>
        </div>
    )
}

export default Signup;
