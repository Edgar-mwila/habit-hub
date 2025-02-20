import { Home, PieChart, Target, FileText, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/finance" 
          className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
        >
          <Home size={24} />
        </Link>
        <Link 
          to="/finance/budgets" 
          className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
        >
          <PieChart size={24} />
        </Link>
        <Link 
          to="/finance/savings" 
          className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
        >
          <Target size={24} />
        </Link>
        <Link 
          to="/finance/bills" 
          className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
        >
          <FileText size={24} />
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;