import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import Swal from 'sweetalert2';

const Homepage = ({ token }) => {
  let navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch balance and transactions on component mount
  useEffect(() => {
    const fetchBalanceAndTransactions = async () => {
      const { data, error } = await supabase
        .from('bankdb')
        .select('accbaln, recent')
        .eq('user_id', token.user.id)
        .single(); // Ensure we only get one record

      if (error) {
        console.error('Error fetching balance and transactions:', error);
      } else if (data) {
        setBalance(data.accbaln || 0);
        setTransactions(data.recent || []);
      }
    };

    fetchBalanceAndTransactions();
  }, [token.user.id]);

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    Swal.fire({
      icon: 'success',
      title: 'Logout Successful',
    }).then(() => {
      navigate('/');
    });
  };

  // Update balance and transactions in Supabase
  const updateBalanceAndTransactionsInSupabase = async (newBalance, newTransactions) => {
    const { error } = await supabase
      .from('bankdb')
      .upsert({
        user_id: token.user.id,
        accbaln: newBalance,
        recent: newTransactions,
      }, { onConflict: 'user_id' }); // Use upsert with onConflict to update existing records

    if (error) {
      console.error('Error updating balance and transactions:', error);
    }
  };

  // Handle deposit
  const handleDeposit = () => {
    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage('Invalid input. Please enter the amount you wish to deposit.');
      return;
    }

    const newBalance = balance + amount;
    const newTransactions = [...transactions, { type: 'Deposit', amount }];
    setBalance(newBalance);
    setTransactions(newTransactions);
    updateBalanceAndTransactionsInSupabase(newBalance, newTransactions);
    setTransactionAmount('');
    setShowDeposit(false);
    Swal.fire({
      icon: 'success',
      title: 'Deposit successful',
      html: `<div>Deposit of $${amount.toFixed(2)} was successful</div>`,
    });
  };

  // Handle withdraw
  const handleWithdraw = () => {
    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage('Invalid input. Please enter the amount you wish to withdraw.');
      return;
    }

    if (amount > balance) {
      setErrorMessage('Insufficient balance for this withdrawal.');
      return;
    }

    const newBalance = balance - amount;
    const newTransactions = [...transactions, { type: 'Withdraw', amount }];
    setBalance(newBalance);
    setTransactions(newTransactions);
    updateBalanceAndTransactionsInSupabase(newBalance, newTransactions);
    setTransactionAmount('');
    setShowWithdraw(false);
    Swal.fire({
      icon: 'success',
      title: 'Withdrawal successful',
      html: `<div>Withdrawal of $${amount.toFixed(2)} was successful</div>`,
    });
  };

  return (
    <div className='min-h-screen bg-slate-600'>
      <nav className='flex justify-between px-4 items-center py-4 bg-slate-600'>
        <h3 className='text-white'>Welcome back, {token.user.user_metadata.full_name}</h3>
        <button onClick={handleLogout} className='bg-blue-500 rounded-md py-1 px-2 text-white'>Logout</button>
      </nav>
      
      <div className='bg-gray-300 mb-4 p-4 rounded-lg shadow-md'>
        <p>Account number: {token.user.user_metadata.account_number}</p>
        <p>Account Balance: ${balance.toFixed(2)}</p>
        <div className='flex justify-center mt-4 gap-3'>
          <button onClick={() => { setShowDeposit(true); setErrorMessage(''); }} className='bg-green-400 px-4 py-2 rounded-lg'>Deposit</button>
          <button onClick={() => { setShowWithdraw(true); setErrorMessage(''); }} className='bg-red-400 px-4 py-2 rounded-lg'>Withdraw</button>
        </div>
      </div>

      {(showDeposit || showWithdraw) && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-gray-100 p-4 rounded-lg shadow-md flex justify-center items-center flex-col'>
            <h4>{showDeposit ? 'Deposit' : 'Withdraw'}</h4>
            <input
              type='number'
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
              placeholder='Enter amount'
              className='border px-2 py-1'
            />
            {errorMessage && (
              <span className='text-red-500'>{errorMessage}</span>
            )}
            <div className='flex gap-2 mt-2'>
              <button 
                onClick={showDeposit ? handleDeposit : handleWithdraw} 
                className='bg-blue-500 px-4 py-2 rounded-lg text-white'
              >
                Submit
              </button>
              <button 
                onClick={() => { 
                  showDeposit ? setShowDeposit(false) : setShowWithdraw(false);
                  setTransactionAmount('');
                  setErrorMessage('');
                }} 
                className='bg-gray-300 px-4 py-2 rounded-lg'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='recent-transactions bg-gray-200 rounded-2xl mt-8 p-4'>
        <h4 className='text-lg font-bold mb-4 text-center'>Recent Transactions</h4>
        <ul className='flex flex-col gap-2 items-center'>
          {transactions.map((txn, index) => (
            <li key={index}>
              {txn.type}: ${txn.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Homepage;

