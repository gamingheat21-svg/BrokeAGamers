import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold mb-6">Find the best game deals you can <span className="text-primary">actually run</span>.</h1>
      <p className="text-xl text-text_muted mb-10 max-w-2xl">
        Stop guessing if a game will work on your setup. Enter your specs once, 
        and browse live deals across all major platforms with instant compatibility checks.
      </p>
      <div className="flex gap-4">
        <Link to="/register" className="btn-primary text-lg px-8 py-3">Get Started</Link>
        <Link to="/deals" className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-md font-medium transition-colors">Browse Deals</Link>
      </div>
    </div>
  );
};

export default Home;
