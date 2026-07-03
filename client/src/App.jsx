import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CompatibilityCheck from './pages/CompatibilityCheck';
import Deals from './pages/Deals';
import Search from './pages/Search';
import GameDetail from './pages/GameDetail';
import Wishlist from './pages/Wishlist';
import Recommendations from './pages/Recommendations';
import FreeGames from './pages/FreeGames';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <Router>
      <AppProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/setup-specs" element={<CompatibilityCheck />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/search" element={<Search />} />
              <Route path="/game/:id" element={<GameDetail />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/free-games" element={<FreeGames />} />
              {/* Other routes will go here */}
            </Routes>
          </main>
        </div>
        </AuthProvider>
      </AppProvider>
    </Router>
  );
}

export default App;
