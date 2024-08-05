import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { format, formatDistanceToNow } from 'date-fns';
import CreateExpenseModal from './CreateExpenseModal';
import ConfirmationModal from './ConfirmationModal';
import { Button, Table, Alert, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './AllExpensePage.css';

const AllExpensePage = () => {
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    // Show the modal for creating or editing an expense
    const handleShow = (expense = null) => {
        setSelectedExpense(expense);
        setShowModal(true);
    };

    // Close the modal
    const handleClose = () => {
        setSelectedExpense(null);
        setShowModal(false);
    };

    // Close the confirmation modal
    const handleConfirmClose = () => {
        setShowConfirmModal(false);
    };

    // Confirm the expense deletion
    const handleConfirm = async () => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.delete(`http://localhost:8000/api/expenses/${expenseToDelete}/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            setExpenses(expenses.filter(expense => expense.id !== expenseToDelete));
        } catch (err) {
            console.error('Error deleting expense:', err);
            setError('Failed to delete expense.');
        }
        setShowConfirmModal(false);
        setExpenseToDelete(null);
    };

    // Fetch expenses and user data from the backend
    const fetchExpenses = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const [userResponse, expensesResponse] = await Promise.all([
                axios.get('http://localhost:8000/api/user/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                }),
                axios.get('http://localhost:8000/api/expenses/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                })
            ]);

            setUserEmail(userResponse.data.email);
            setExpenses(expensesResponse.data.results);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            setError('Failed to fetch expenses.');
        }
    }, [navigate]);

    // Fetch expenses and user data on component mount
    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    // Handle search term changes
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle date range changes
    const handleDateChange = (e) => {
        if (e.target.name === 'startDate') {
            setStartDate(e.target.value);
        } else {
            setEndDate(e.target.value);
        }
    };

    // Filter expenses based on search term and date range
    const filteredExpenses = Array.isArray(expenses)
        ? expenses.filter(expense => {
            const matchName = expense.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchDate = (!startDate || new Date(expense.date_of_expense) >= new Date(startDate)) &&
                              (!endDate || new Date(expense.date_of_expense) <= new Date(endDate));
            return matchName && matchDate;
        })
        : [];

    return (
        <div>
            <div className="page-header">
                <h1>All Expense Page</h1>
                <Button variant="primary" onClick={() => handleShow()}>
                    + New Expense
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="filters">
                <FormControl
                    placeholder="Search by Expense Name"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <h4>Start Date</h4>
                <FormControl
                    type="date"
                    name="startDate"
                    value={startDate}
                    onChange={handleDateChange}
                />
                <h4>End Date</h4>
                <FormControl
                    type="date"
                    name="endDate"
                    value={endDate}
                    onChange={handleDateChange}
                />
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Date of Expense</th>
                        <th>Amount</th>
                        <th>Updated at</th>
                        <th>Created by</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExpenses.map(expense => (
                        <tr key={expense.id}>
                            <td>{expense.name}</td>
                            <td>{expense.category}</td>
                            <td>{format(new Date(expense.date_of_expense), 'dd MMMM yyyy')}</td>
                            <td>INR {expense.amount}</td>
                            <td>{formatDistanceToNow(new Date(expense.updated_at))} ago</td>
                            <td>{expense.created_by_email === userEmail ? 'me' : expense.created_by_email}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <CreateExpenseModal show={showModal} handleClose={handleClose} expense={selectedExpense} onSave={fetchExpenses} />
            <ConfirmationModal
                show={showConfirmModal}
                handleClose={handleConfirmClose}
                handleConfirm={handleConfirm}
                message="Are you sure you want to delete this expense?"
            />
        </div>
    );
};

export default AllExpensePage;
