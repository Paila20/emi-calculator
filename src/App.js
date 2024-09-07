import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { FiSun, FiMoon } from 'react-icons/fi';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const EMICalculator = () => {
  const [theme, setTheme] = useState('light');
  const [breakdown, setBreakdown] = useState([]);
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const { loanAmount, interestRate, loanTenure, extraEMI } = values;
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const months = parseFloat(loanTenure);
    const rate = annualRate / 12;
    const extraPayment = parseFloat(extraEMI) || 0;

    const emiCalc = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);

    let remainingBalance = principal;
    let adjustedMonths = 0;
    const breakdownData = [];

    while (remainingBalance > 0 && adjustedMonths < months) {
      const interestPaid = remainingBalance * rate;
      let principalPaid = emiCalc + extraPayment - interestPaid;

      if (remainingBalance <= emiCalc + extraPayment) {
        principalPaid = remainingBalance;
      }

      remainingBalance -= principalPaid;
      adjustedMonths += 1;

      breakdownData.push({
        month: adjustedMonths,
        emi: Math.min(emiCalc + extraPayment, remainingBalance + interestPaid).toFixed(2),
        interestPaid: interestPaid.toFixed(2),
        principalPaid: principalPaid.toFixed(2),
        balance: Math.max(remainingBalance, 0).toFixed(2),
      });

      if (remainingBalance <= 0) break;
    }

    setBreakdown(breakdownData);
    toast.success('EMI calculation completed successfully!');
  };

  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
  };
  
  

  
  

  return (
    <div className={`container mt-5 ${theme}`}>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="text-center mb-4">EMI Calculator</h2>
        <button onClick={toggleTheme} className="btn btn-secondary">
          {theme === 'light' ? <FiMoon size={24} /> : <FiSun size={24} />}
        </button>
      </div>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Loan Amount"
          name="loanAmount"
          className={`form-item ${theme === 'dark' ? 'dark-mode' : ''}`}
          rules={[
            { required: true, message: 'Please input loan amount!' },
            {
              validator(_, value) {
                if (!value || (value > 0 && value <= 5000000)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Loan amount must be less than or equal to 5,000,000.'));
              },
            },
          ]}
        >
          <Input type="number" className={`input ${theme === 'dark' ? 'dark-mode' : ''}`} />
        </Form.Item>
        <Form.Item
          label="Interest Rate (%)"
          name="interestRate"
          className={`form-item ${theme === 'dark' ? 'dark-mode' : ''}`}
          rules={[
            { required: true, message: 'Please input interest rate!' },
            {
              validator(_, value) {
                if (!value || (value >= 1 && value <= 30)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Interest rate must be between 1% and 30%.'));
              },
            }
          ]}
        >
          <Input type="number" step="0.01" className={`input ${theme === 'dark' ? 'dark-mode' : ''}`} />
        </Form.Item>
        <Form.Item
          label="Loan Tenure (Months)"
          name="loanTenure"
          className={`form-item ${theme === 'dark' ? 'dark-mode' : ''}`}
          rules={[
            { required: true, message: 'Please input loan tenure!' },
            {
              validator(_, value) {
                if (!value || (value >= 1 && value <= 360)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Loan tenure must be between 1 month and 360 months.'));
              },
            },
          ]}
        >
          <Input type="number" className={`input ${theme === 'dark' ? 'dark-mode' : ''}`} />
        </Form.Item>
        <Form.Item
          label="Prepayment/Extra EMI (Optional)"
          name="extraEMI"
          className={`form-item ${theme === 'dark' ? 'dark-mode' : ''}`}
          rules={[
            {
              validator(_, value) {
                const loanAmount = form.getFieldValue('loanAmount');
                
                if (!value || value === '' || loanAmount === undefined) {
                  return Promise.resolve();
                }
        
                if (value > loanAmount / 2 && value > 25000) {
                  return Promise.reject(new Error('Prepayment must be less than or equal to half of the loan amount.'));
                }
        
                return Promise.resolve();
              },
            }
          ]}
        >
          <Input type="number" step="0.01" className={`input ${theme === 'dark' ? 'dark-mode' : ''}`} />
        </Form.Item>
        <Button type="primary" htmlType="submit">Calculate EMI</Button>
      </Form>

      {breakdown.length > 0 && (
        <div className="mt-5">
          <h4>Month-wise Breakdown:</h4>
          <div className="table-responsive">
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Month</th>
                <th>EMI Paid</th>
                <th>Interest Paid</th>
                <th>Principal Paid</th>
                <th>Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((row) => (
                <tr key={row.month}>
                  <td>{row.month}</td>
                  <td>₹{row.emi}</td>
                  <td>₹{row.interestPaid}</td>
                  <td>₹{row.principalPaid}</td>
                  <td>₹{row.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

    </div>
  );
};

export default EMICalculator;

