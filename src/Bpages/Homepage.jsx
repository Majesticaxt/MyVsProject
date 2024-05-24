import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client';

const Homepage = ({ token }) => {
  const navigate = useNavigate();
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [accountBalance, setAccountBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    insertUserProfile();
    fetchUserProfile();
  }, [token.user.id]);

  let insertUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .insert([
          {
            id: (token.user.id),
            acc_balance: 0,
            recent_transaction: [],
          },
        ]);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error inserting user profile:', error.message);
    }
  };

  let fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('acc_balance, recent_transaction')
        .eq('id', token.user.id)
        .single();
      if (error) {
        throw error;
      }
      else if (data) {
        setAccountBalance(data.acc_balance || 0);
        setRecentTransactions(data.recent_transaction || []);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
    }
  };

  // useEffect(() => {
  //   fetchUserProfile();
  // }, [token.user.id]);

  // let fetchUserProfile = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('profile')
  //       .select('acc_balance, recent_transaction')
  //       .eq('id', token.user.id)
  //       .single();

  //     if (error) {
  //       throw error;
  //     }

  //     if (data) {
  //       setAccountBalance(data.acc_balance || 0);
  //       setRecentTransactions(data.recent_transaction || []);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user profile:', error.message);
  //   }
  // };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/');
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    } console.log(amount);
    setError('');
    try {
      const updatedBalance = accountBalance + amount;
      await supabase
        .from('profile')
        .update({ acc_balance: updatedBalance })
        .eq('id', token.user.id);
      setAccountBalance(updatedBalance);
      setDepositAmount('');
      setShowDepositForm(false);
      setRecentTransactions([...recentTransactions, { amount, type: 'deposit', timestamp: new Date() }]);
    } catch (error) {
      console.error('Error depositing:', error.message);
    }
  };


  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (amount > accountBalance) {
      setError('Insufficient funds.');
      return;
    }
    setError('');
    try {
      const updatedBalance = accountBalance - amount;
      await supabase
        .from('profile')
        .update({ acc_balance: updatedBalance })
        .eq('id', token.user.id);
      setAccountBalance(updatedBalance);
      setWithdrawalAmount('');
      setShowWithdrawForm(false);
      setRecentTransactions([
        ...recentTransactions,
        { amount: -amount, type: 'withdrawal', timestamp: new Date() }
      ]);
    } catch (error) {
      console.error('Error withdrawing:', error.message);
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="px-4 py-2 flex justify-between items-center">
        <h3 className="text-lg font-bold">Welcome back, {token.user.user_metadata.full_name}</h3>
        <button onClick={handleLogout} className="text-red-600">Logout</button>
      </div>
      <div className="px-4 py-8">
        <div className="bg-blue-300 rounded-lg p-4 mb-4">
          <p className="text-lg">Account Number: {token.user.user_metadata.account_number}</p>
          <p className="text-lg">Account Balance: ${accountBalance.toFixed(2)}</p>
          <div className="flex justify-center mt-4">
            <button onClick={() => setShowDepositForm(true)} className="bg-green-500 text-white px-4 py-2 mr-2 rounded">Deposit</button>
            <button onClick={() => setShowWithdrawForm(true)} className="bg-red-500 text-white px-4 py-2 rounded">Withdraw</button>
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg p-4">
          <h4 className="text-lg font-bold mb-4">Recent Transactions</h4>
          <ul>
            {recentTransactions.map((transaction, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{transaction.amount}</span>
                <span>{transaction.type}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {showDepositForm && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <button onClick={() => setShowDepositForm(false)} className="left-56 bottom-4 relative font-bold">X</button>
            <input
              type="number"
              value={depositAmount}
              onChange={e => setDepositAmount(e.target.value)}
              placeholder="Enter amount"
              className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded"
            />
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <button onClick={handleDeposit} className="bg-green-500 text-white px-4 py-2 rounded">Deposit</button>
          </div>
        </div>
      )}
      {showWithdrawForm && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <button onClick={() => setShowWithdrawForm(false)} className="left-56 bottom-4 relative font-bold">X</button>
            <input
              type="number"
              value={withdrawalAmount}
              onChange={e => setWithdrawalAmount(e.target.value)}
              placeholder="Enter amount"
              className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded"
            />
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <button onClick={handleWithdraw} className="bg-red-500 text-white px-4 py-2 rounded">Withdraw</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;