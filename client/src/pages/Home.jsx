import { Link } from 'react-router-dom';
import heroArt from '../assets/hero-art.jpg';

const Home = () => {
  return (
    <section className="relative -mx-4 -mt-6 min-h-[calc(100vh-4.5rem)] overflow-hidden px-4 text-center">
      <img
        src={heroArt}
        alt="A player holding a glowing controller toward a portal of game worlds"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-5xl flex-col items-center justify-center px-4 py-20">
        <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
          Find the best game deals you can <span className="text-primary">actually run</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-base text-gray-200 md:text-xl">
          Stop guessing if a game will work on your setup. Enter your specs once,
          and browse live deals across all major platforms with instant compatibility checks.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link to="/register" className="btn-primary px-8 py-3 text-lg">Get Started</Link>
          <Link to="/deals" className="rounded-md bg-gray-900/80 px-8 py-3 font-medium text-white transition-colors hover:bg-gray-800">Browse Deals</Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
