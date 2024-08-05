import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const CreateExpenseModal = ({ show, handleClose, expense, onSave }) => {
    const [expenseName, setExpenseName] = useState('');
    const [dateOfExpense, setDateOfExpense] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (expense) {
            setExpenseName(expense.name);
            setDateOfExpense(expense.date_of_expense);
            setCategory(expense.category);
            setDescription(expense.description);
            setAmount(expense.amount);
        } else {
            setExpenseName('');
            setDateOfExpense('');
            setCategory('');
            setDescription('');
            setAmount('');
        }
    }, [expense]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('No authentication token found. Please log in.');
            return;
        }

        const expenseData = {
            name: expenseName,
            date_of_expense: dateOfExpense,
            category: category,
            description: description,
            amount: amount,
        };

        try {
            let response;
            if (expense) {
                // Update existing expense
                response = await axios.put(
                    `http://localhost:8000/api/expenses/${expense.id}/`,
                    expenseData,
                    {
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                console.log('Expense updated successfully!', response.data);
            } else {
                // Create new expense
                response = await axios.post(
                    'http://localhost:8000/api/expenses/',
                    expenseData,
                    {
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                console.log('Expense created successfully!', response.data);
            }

            setSuccess(true);
            setError('');
            onSave(); // Call the onSave function to refresh the expenses list
            setTimeout(() => {
                setSuccess(false);
                handleClose();
            }, 3000);
        } catch (error) {
            console.error('Expense save request failed:', error.response ? error.response.data : error.message);
            setError(
                error.response && error.response.status === 400
                    ? 'Bad request. Please check the input fields.'
                    : error.response && error.response.status === 403
                        ? 'You do not have permission to save an expense.'
                        : 'Expense save request failed. Please check the console for more details.'
            );
            setSuccess(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{expense ? 'Update Expense' : 'Create Expense'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {success && <Alert variant="success">Expense {expense ? 'updated' : 'created'} successfully!</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formExpenseName">
                        <Form.Label>Expense Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter expense name"
                            value={expenseName}
                            onChange={(e) => setExpenseName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    

                    <Form.Group controlId="formCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            as="select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select category</option>
                            <option value="Health">Health</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Travel">Travel</option>
                            <option value="Education">Education</option>
                            <option value="Books">Books</option>
                            <option value="Others">Others</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formDateOfExpense">
                        <Form.Label>Date of Expense</Form.Label>
                        <Form.Control
                            type="date"
                            value={dateOfExpense}
                            onChange={(e) => setDateOfExpense(e.target.value)}
                            required
                        />
                    </Form.Group>

                    

                    <Form.Group controlId="formAmount">
                        <Form.Label>Expense Amount</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-between mt-4">
                        <Button variant="secondary" onClick={handleClose} className="mr-2">
                            Cancel
                        </Button>
                        <Button variant="success" type="submit">
                            {expense ? 'Update Expense' : 'Save Expense'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateExpenseModal;
