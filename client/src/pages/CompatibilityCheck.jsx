import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Monitor, Cpu, HardDrive, LayoutGrid } from 'lucide-react';

const CompatibilityCheck = () => {
  const [specs, setSpecs] = useState({
    os: 'Windows 10',
    gpu: '',
    cpu: '',
    ram: 8,
    directx: 'DirectX 12'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if specs already exist and pre-fill
    const fetchSpecs = async () => {
      try {
        const res = await api.get('/specs');
        if (res.data) {
          setSpecs({
            os: res.data.os || 'Windows 10',
            gpu: res.data.gpu || '',
            cpu: res.data.cpu || '',
            ram: res.data.ram || 8,
            directx: res.data.directx || 'DirectX 12'
          });
        }
      } catch (err) {
        console.error('Error fetching specs', err);
      }
    };
    fetchSpecs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSpecs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/specs', specs);
      navigate('/deals');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save specs');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-4">Set Up Your Rig</h1>
        <p className="text-text_muted">Tell us what you're running, and we'll instantly check if you can run any game.</p>
        <div className="bg-gray-800 p-4 rounded-lg mt-6 text-sm text-left inline-block max-w-xl border border-gray-700">
          <p className="font-semibold text-accent mb-2">💡 Quick tip (Windows):</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-300">
            <li>Press <strong>Win + R</strong></li>
            <li>Type <code className="bg-gray-900 px-1 py-0.5 rounded text-primary">dxdiag</code> and hit Enter</li>
            <li>Check the <strong>System</strong> tab for OS, CPU, RAM</li>
            <li>Check the <strong>Display</strong> tab for your GPU (Name)</li>
          </ol>
        </div>
      </div>

      <div className="card p-8">
        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-6">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium"><LayoutGrid size={16} /> Operating System</label>
              <select name="os" value={specs.os} onChange={handleChange} className="input">
                <option value="Windows 11">Windows 11</option>
                <option value="Windows 10">Windows 10</option>
                <option value="Windows 8">Windows 8</option>
                <option value="Windows 7">Windows 7</option>
                <option value="macOS">macOS</option>
                <option value="Linux">Linux</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium"><HardDrive size={16} /> RAM (GB)</label>
              <input 
                type="number" 
                name="ram" 
                value={specs.ram} 
                onChange={handleChange} 
                className="input" 
                min="2" max="128"
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium"><Cpu size={16} /> Processor (CPU)</label>
              <input 
                type="text" 
                name="cpu" 
                placeholder="e.g. Intel Core i5-10400F or Ryzen 5 3600" 
                value={specs.cpu} 
                onChange={handleChange} 
                className="input" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium"><Monitor size={16} /> Graphics Card (GPU)</label>
              <input 
                type="text" 
                name="gpu" 
                placeholder="e.g. NVIDIA GTX 1660 Ti or RX 570" 
                value={specs.gpu} 
                onChange={handleChange} 
                className="input" 
                required 
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">DirectX Version</label>
              <select name="directx" value={specs.directx} onChange={handleChange} className="input">
                <option value="DirectX 12">DirectX 12</option>
                <option value="DirectX 11">DirectX 11</option>
                <option value="DirectX 10">DirectX 10</option>
                <option value="DirectX 9">DirectX 9</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-4 text-lg">
            {loading ? 'Saving...' : 'Save Specs & Find Deals'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompatibilityCheck;
