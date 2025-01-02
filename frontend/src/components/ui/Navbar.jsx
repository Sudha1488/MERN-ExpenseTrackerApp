import React from 'react';
import Logo from '../shared/Logo';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './button';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import { setExpenses } from '@/redux/expenseSlice';

const Navbar = () => {
    const { user } = useSelector(store => store.auth); // Access user info from Redux
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logoutHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get("http://localhost:8001/api/v1/user/logout");
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setExpenses([]));
                localStorage.removeItem('authToken');
                sessionStorage.removeItem('authToken');
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    }

    return (
        <div style={{
            borderBottom: '1px solid #D1D5DB', 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
            backgroundColor: '#fff'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                maxWidth: '112rem',
                margin: '0 auto',
                height: '4rem',
                padding: '0 1.5rem',
                transition: 'all 0.3s ease-in-out'
            }}>
                <Logo />
                {
                    user ? (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#F9FAFB',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s ease-in-out'
                        }}>
                            {/* Display User Info before Avatar */}
                            <div style={{ textAlign: 'left' }}>
                                <h3 style={{
                                    fontWeight: '600',
                                    fontSize: '1.125rem', 
                                    color: '#1F2937' // dark text
                                }}>
                                    {user.name}
                                </h3>
                                <p style={{
                                    fontSize: '0.875rem', 
                                    color: '#6B7280' // gray-500
                                }}>
                                    {user.email}
                                </p>
                            </div>
                            {/* Avatar and Logout Button */}
                            <Popover>
                                <PopoverTrigger>
                                    <Avatar style={{
                                        width: '40px', 
                                        height: '40px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        border: '2px solid #4CAF50',
                                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
                                    }}>
                                        <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent style={{
                                    padding: '1rem',
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    width: '150px'
                                }}>
                                    <Button variant="link" onClick={logoutHandler} style={{
                                        color: '#DC2626', 
                                        fontWeight: '600', 
                                        padding: '0.5rem', 
                                        width: '100%',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        border: 'none',
                                        background: 'transparent'
                                    }}>
                                        Logout
                                    </Button>
                                </PopoverContent>
                            </Popover>
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <Link to="/login">
                                <Button variant="outline" style={{
                                    padding: '0.5rem 1.5rem',
                                    borderColor: '#4CAF50',
                                    color: '#4CAF50',
                                    borderRadius: '4px',
                                    backgroundColor: 'transparent',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    borderWidth: '2px',
                                    fontWeight: '500'
                                }}>
                                    Login
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="gradient" style={{
                                    backgroundColor: '#16A34A', // green-600
                                    color: 'white',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '4px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    border: 'none'
                                }}>
                                    Signup
                                </Button>
                            </Link>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Navbar;
