const db = require('../db');
const rawgService = require('../services/rawgService');

const extractRam = (ramStr) => {
  if (!ramStr) return 0;
  const match = ramStr.match(/(\d+)\s*GB/i);
  return match ? parseInt(match[1]) : 0;
};

const checkCompatibility = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;

    // 1. Get User Specs
    const specResult = await db.query('SELECT * FROM user_specs WHERE user_id = $1', [userId]);
    if (specResult.rows.length === 0) {
      return res.status(400).json({ message: 'User specs not found. Please set up your specs first.' });
    }
    const userSpecs = specResult.rows[0];

    // 2. Get Game Requirements
    const reqs = await rawgService.getGameRequirements(gameId);
    if (!reqs || (!reqs.minimum && !reqs.recommended)) {
      return res.json({ status: 'unknown', message: 'No system requirements data available for this game.' });
    }

    // 3. Compare Logic
    const userRam = userSpecs.ram || 0;
    
    let passesMinimum = true;
    let passesRecommended = true;
    let failures = [];

    // Check Minimum
    if (reqs.minimum) {
      const minRam = extractRam(reqs.minimum.memory);
      if (minRam > 0 && userRam < minRam) {
        passesMinimum = false;
        failures.push(`RAM: You have ${userRam}GB, but ${minRam}GB is required.`);
      }
      
      // Simple mock string check for OS
      if (reqs.minimum.os && userSpecs.os) {
         if (reqs.minimum.os.toLowerCase().includes('windows 10') && !userSpecs.os.toLowerCase().includes('windows 10') && !userSpecs.os.toLowerCase().includes('windows 11')) {
             passesMinimum = false;
             failures.push(`OS: Windows 10 is required.`);
         }
      }
    }

    // Check Recommended
    if (reqs.recommended) {
      const recRam = extractRam(reqs.recommended.memory);
      if (recRam > 0 && userRam < recRam) {
        passesRecommended = false;
      }
    }

    let status = '🟢 Can Run Smoothly';
    let summary = 'Great news! This game runs smoothly on your system.';

    if (!passesMinimum) {
      status = '🔴 Won\'t Run';
      summary = failures.join(' | ');
    } else if (!passesRecommended) {
      status = '🟡 Can Run (Minimum Only)';
      summary = 'You can run this at minimum settings. Upgrade recommended for a better experience.';
    }

    res.json({
      status,
      summary,
      failures,
      requirements: reqs
    });

  } catch (error) {
    console.error('Compatibility check error:', error);
    res.status(500).json({ message: 'Error checking compatibility' });
  }
};

module.exports = {
  checkCompatibility
};
