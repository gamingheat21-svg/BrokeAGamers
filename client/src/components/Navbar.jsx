import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, LogOut, User, Search as SearchIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.searchQuery.value;
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      e.target.searchQuery.value = '';
    }
  };

  return (
    <nav className="bg-card border-b border-gray-800 py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Gamepad2 size={32} />
          <span>GameDeal<span className="text-white">Hunt</span></span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/deals" className="text-text_muted hover:text-white transition-colors">Deals</Link>
          
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input 
              type="text" 
              name="searchQuery"
              placeholder="Search games..." 
              className="bg-gray-900 border border-gray-700 text-white rounded-full py-1.5 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-primary text-sm w-48 transition-all focus:w-64"
            />
            <button type="submit" className="absolute right-3 text-gray-400 hover:text-white">
              <SearchIcon size={16} />
            </button>
          </form>
          <Link to="/free-games" className="text-text_muted hover:text-white transition-colors flex items-center gap-1 text-accent font-medium">Free!</Link>
          
          {user ? (
            <>
              <Link to="/recommendations" className="text-text_muted hover:text-white transition-colors">For You</Link>
              <Link to="/wishlist" className="text-text_muted hover:text-white transition-colors">Wishlist</Link>
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-700">
                <Link to="/profile" className="flex items-center gap-2 text-sm text-text_muted hover:text-white">
                  <User size={16} />
                  {user.name}
                </Link>
                <button onClick={logout} className="text-red-400 hover:text-red-300 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-700">
              <Link to="/login" className="text-text_muted hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
