import { Home, PieChart, Target, FileText, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

const Navigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg">
      <div className="flex justify-around items-center h-16">
        <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
          <Home size={24} />
        </Link>
        <Link to="/budgets" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
          <PieChart size={24} />
        </Link>
        <Link to="/savings" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
          <Target size={24} />
        </Link>
        <Link to="/bills" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
          <FileText size={24} />
        </Link>
        <Link to="/settings" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
          <Settings size={24} />
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navigation;

