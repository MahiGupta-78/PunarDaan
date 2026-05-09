/**
 * Punardaan AI Engine Simulation
 * Contains mock AI algorithms for Smart Matching, Freshness Detection, and Emergency Routing.
 */

const AIEngine = {
  // 1. Smart Match Algorithm
  // Matches available donations with open requests based on type, distance, and urgency.
  simulateSmartMatch: function(donations, requests) {
    console.log("[AI Engine] Running Smart Match...");
    const matches = [];

    donations.forEach(donation => {
      // Find compatible requests
      let possibleRequests = requests.filter(r => r.type === donation.type && r.status === 'open');

      if (possibleRequests.length > 0) {
        // Score them based on urgency and distance
        possibleRequests.forEach(req => {
          let score = 100;
          score -= (req.distance * 5); // penalty for distance
          if (req.urgency === 'critical') score += 50;
          if (req.urgency === 'high') score += 30;
          req.aiScore = score;
        });

        // Sort by highest score
        possibleRequests.sort((a, b) => b.aiScore - a.aiScore);

        // Best match
        const bestMatch = possibleRequests[0];
        matches.push({
          donationId: donation.id,
          requestId: bestMatch.id,
          confidenceScore: bestMatch.aiScore > 100 ? 99 : Math.floor(bestMatch.aiScore)
        });
      }
    });

    console.log(`[AI Engine] Found ${matches.length} optimal matches.`);
    return matches;
  },

  // 2. Food Freshness Predictor
  // Predicts how long food will remain safe based on time prepared and type
  predictFreshness: function(foodType, hoursSincePrepared) {
    let baseLife = 24; // Hours
    if (foodType === 'cooked') baseLife = 12;
    if (foodType === 'bakery') baseLife = 48;
    if (foodType === 'raw') baseLife = 72;

    const remainingLife = baseLife - hoursSincePrepared;
    const freshnessScore = Math.max(0, Math.min(100, (remainingLife / baseLife) * 100));

    return {
      score: freshnessScore.toFixed(1),
      status: freshnessScore > 50 ? 'Safe to distribute' : (freshnessScore > 20 ? 'Distribute Immediately' : 'Unsafe / Expired')
    };
  },

  // 3. Emergency Prioritization
  // Sorts blood or medical requests dynamically
  emergencyRouting: function(requests) {
    const urgencyWeights = { 'critical': 3, 'high': 2, 'medium': 1, 'low': 0 };

    return requests.sort((a, b) => {
      // Sort primarily by urgency weight, then by distance
      const weightA = urgencyWeights[a.urgency] || 0;
      const weightB = urgencyWeights[b.urgency] || 0;

      if (weightA !== weightB) {
        return weightB - weightA;
      }
      return a.distance - b.distance;
    });
  }
};

window.AIEngine = AIEngine;
