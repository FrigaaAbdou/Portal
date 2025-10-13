const express = require('express');
const auth = require('../middleware/auth');
const PlayerProfile = require('../models/PlayerProfile');

const router = express.Router();

// Create or update the current user's player profile
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      // Personal
      fullName, dob, city, state, country, heightFeet, heightInches, weightLbs,
      // Background
      school, gpa, positions, highlightUrl1, highlightUrl2, highlightUrls, bio,
      verificationStatus, verificationNote,
      // Stats
      games, gamesStarted, goals, assists, points,
      // Preferences
      division, budget, preferredLocation,
    } = req.body || {};

    const update = {
      fullName, city, state, country,
      heightFeet, heightInches, weightLbs,
      school, gpa,
      positions: Array.isArray(positions) ? positions : [],
      highlightUrls: Array.isArray(highlightUrls)
        ? highlightUrls.filter(Boolean)
        : [highlightUrl1, highlightUrl2].filter(Boolean),
      bio,
      stats: { games, gamesStarted, goals, assists, points },
      division, budget, preferredLocation,
    };

    if (verificationStatus) update.verificationStatus = verificationStatus;
    if (typeof verificationNote === 'string') update.verificationNote = verificationNote;

    const profile = await PlayerProfile.findOneAndUpdate(
      { user: userId },
      { $set: update, $setOnInsert: { user: userId } },
      { new: true, upsert: true }
    );

    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save player profile' });
  }
});

// Get current user's player profile
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await PlayerProfile.findOne({ user: req.user.id });
    res.json(profile || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch player profile' });
  }
});

module.exports = router;
