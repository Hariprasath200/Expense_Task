import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { format, formatDistanceToNow } from 'date-fns';
import CreateExpenseModal from './CreateExpenseModal';
import ConfirmationModal from './ConfirmationModal'; // Import ConfirmationModal
import { Button, Table, Alert, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './MemberPage.css'; // Import the CSS file

const MemberPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Add state for confirmation modal
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userRole, setUserRole] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [expenseToDelete, setExpenseToDelete] = useState(null); // Add state for the expense to delete
    const navigate = useNavigate();

    const handleShow = (expense = null) => {
        setSelectedExpense(expense);
        setShowModal(true);
    };

    const handleClose = () => {
        setSelectedExpense(null);
        setShowModal(false);
    };

    const handleConfirmClose = () => {
        setShowConfirmModal(false);
    };

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

    const fetchExpenses = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const expensesResponse = await axios.get('http://localhost:8000/api/expenses/', {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            setExpenses(expensesResponse.data.results);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            setError('Failed to fetch expenses.');
        }
    }, [navigate]);

    const handleSave = () => {
        fetchExpenses(); // Refresh the expenses list
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const userResponse = await axios.get('http://localhost:8000/api/user/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                setUserRole(userResponse.data.role);
                setCurrentUser(userResponse.data.id); // Assuming the response includes the user's ID

                fetchExpenses();
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data.');
            }
        };

        fetchUserData();
    }, [fetchExpenses, navigate]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDateChange = (e) => {
        if (e.target.name === 'startDate') {
            setStartDate(e.target.value);
        } else {
            setEndDate(e.target.value);
        }
    };

    const filteredExpenses = Array.isArray(expenses)
        ? expenses.filter(expense => {
            const matchName = expense.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchDate = (!startDate || new Date(expense.date_of_expense) >= new Date(startDate)) &&
                              (!endDate || new Date(expense.date_of_expense) <= new Date(endDate));
            return matchName && matchDate;
        })
        : [];

    const handleDelete = (id) => {
        setExpenseToDelete(id);
        setShowConfirmModal(true);
    };

    return (
        <div>
            <div className="page-header">
                <h1>{userRole === 'Admin' ? 'Admin Page' : 'My Expense Manager'}</h1>
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
                <h3>Start_Date
                </h3><FormControl
                    type="date"
                    name="startDate"
                    value={startDate}
                    onChange={handleDateChange}
                />
                <h3>End_Date
                </h3><FormControl
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
                        <th>Actions</th>
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
                            <td>{expense.created_by === currentUser ? 'me' : expense.created_by_email}</td>
                            <td>
                                {expense.created_by === currentUser && (
                                    <>
                                        <Button variant="warning" onClick={() => handleShow(expense)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDelete(expense.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <CreateExpenseModal show={showModal} handleClose={handleClose} expense={selectedExpense} onSave={handleSave} />
            <ConfirmationModal
                show={showConfirmModal}
                handleClose={handleConfirmClose}
                handleConfirm={handleConfirm}
                message="Are you sure you want to delete this expense?"
            />
        </div>
    );
};

export default MemberPage;
