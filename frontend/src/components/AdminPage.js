import React, { useState } from 'react';

import RegisterPage from './RegisterPage';
import CreateExpensePage from './CreateExpensePage';
import AllExpensePage from './AllExpensePage';
import './AdminPage.css'; // Import the CSS for styling

const AdminPage = () => {
    const [activePage, setActivePage] = useState(null);

    const handlePageChange = (page) => {
        setActivePage(page);
    };

    return (
        <div className="admin-page">
            <h1>Admin Page</h1>
            <div className="button-group">
                
                <button className="admin-button" onClick={() => handlePageChange('createExpense')}>
                    Create Expense
                </button>
                <button className="admin-button" onClick={() => handlePageChange('allExpense')}>
                    All Expense
                </button>
                <button className="admin-button" onClick={() => handlePageChange('register')}>
                    Register
                </button>
                
            </div>
            <div className="page-content">
                {activePage === 'createExpense' && <CreateExpensePage />}
                {activePage === 'allExpense' && <AllExpensePage />}
                {activePage === 'register' && <RegisterPage />}
            </div>
        </div>
    );
};

export default AdminPage;
