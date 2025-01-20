import React from 'react';
import { Bill } from '../../../services/FinanaceStorageManager';
import { useFinance } from '../components/FinanceProvider';

const BillsPage = () => {
  const { bills, updateBill } = useFinance();

  const handlePayBill = (bill: Bill) => {
    updateBill({ ...bill, isPaid: true });
  };

  return (
    <div className="container mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Bills</h1>
      <div className="space-y-4">
        {bills.map((bill) => (
          <div key={bill.id} className="bg-white dark:bg-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{bill.name}</h2>
            <div className="flex justify-between items-center">
              <div>
                <p>Amount: ${bill.amount.toFixed(2)}</p>
                <p>Due Date: {new Date(bill.dueDate).toLocaleDateString()}</p>
                <p>Status: {bill.isPaid ? 'Paid' : 'Unpaid'}</p>
              </div>
              {!bill.isPaid && (
                <button
                  onClick={() => handlePayBill(bill)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillsPage;

