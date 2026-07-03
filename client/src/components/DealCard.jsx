import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';

const DealCard = ({ deal }) => {
  const savings = Math.round(deal.savings);
  
  return (
    <Link to={`/game/${deal.gameID}`} className="card block hover:-translate-y-1 transition-transform duration-300 cursor-pointer group">
      <div className="relative h-48 bg-gray-900">
        <img 
          src={deal.thumb} 
          alt={deal.title} 
          className="w-full h-full object-cover opacity-80"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image' }}
        />
        {savings > 0 && (
          <div className="absolute top-2 right-2 bg-accent text-white px-2 py-1 rounded text-sm font-bold shadow">
            -{savings}%
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg truncate mb-2 text-white" title={deal.title}>{deal.title}</h3>
        
        <div className="flex items-end justify-between mt-4">
          <div>
            <span className="text-gray-400 line-through text-sm mr-2">${deal.normalPrice}</span>
            <span className="text-2xl font-bold text-accent">${deal.salePrice}</span>
          </div>
          
          <div className="text-primary group-hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
            <Tag size={16} /> Details
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DealCard;
