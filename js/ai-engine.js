// ===============================================
// PUNARDAAN AI ENGINE
// Smart Matching & Recommendation System
// Enhanced with Language Support & Advanced Features
// ===============================================

class AIMatchingEngine {
  constructor() {
    this.ngos = [];
    this.requests = [];
    this.donations = [];
    this.userHistory = {};
    this.confidenceThreshold = 0.6;
  }

  // Initialize with data
  initializeData(ngos, requests, donations) {
    this.ngos = ngos || [];
    this.requests = requests || [];
    this.donations = donations || [];
  }

  // Load user donation history
  loadUserHistory(userId) {
    this.userHistory[userId] = getFromStorage(`user_history_${userId}`) || {
      donations: [],
      requests: [],
      preferences: {},
      location: null
    };
  }

  // Calculate match score between donation and request
  calculateMatchScore(donation, request) {
    let score = 0;
    let maxScore = 100;

    // Category matching (40 points)
    if (donation.category === request.category) {
      score += 40;
    } else if (this.areCategoriesRelated(donation.category, request.category)) {
      score += 20;
    }

    // Location proximity (25 points)
    const distance = this.calculateDistance(donation.location, request.location);
    if (distance <= 5) score += 25; // Within 5km
    else if (distance <= 15) score += 15; // Within 15km
    else if (distance <= 50) score += 5; // Within 50km

    // Urgency factor (15 points)
    const urgencyMultiplier = this.getUrgencyMultiplier(request.urgency);
    score += (15 * urgencyMultiplier);

    // NGO reputation (10 points)
    const ngoRating = this.getNgoRating(request.ngoId);
    score += (10 * ngoRating);

    // Time sensitivity (10 points)
    const timeScore = this.calculateTimeScore(request.createdAt);
    score += timeScore;

    return Math.min(score, maxScore);
  }

  // Check if categories are related
  areCategoriesRelated(cat1, cat2) {
    const relatedCategories = {
      'food': ['medical', 'shelter'],
      'clothes': ['shelter', 'medical'],
      'books': ['education'],
      'medical': ['food', 'shelter'],
      'education': ['books'],
      'shelter': ['food', 'clothes', 'medical']
    };

    return relatedCategories[cat1]?.includes(cat2) || relatedCategories[cat2]?.includes(cat1);
  }

  // Calculate distance between two locations
  calculateDistance(loc1, loc2) {
    if (!loc1 || !loc2) return 999;

    // Simple distance calculation (in km)
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(loc2.lat - loc1.lat);
    const dLon = this.toRadians(loc2.lng - loc1.lng);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(loc1.lat)) * Math.cos(this.toRadians(loc2.lat)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Get urgency multiplier
  getUrgencyMultiplier(urgency) {
    const multipliers = {
      'low': 0.5,
      'medium': 0.75,
      'high': 1.0,
      'critical': 1.5
    };
    return multipliers[urgency] || 0.75;
  }

  // Get NGO rating (0-1)
  getNgoRating(ngoId) {
    const ngo = this.ngos.find(n => n.id === ngoId);
    return ngo ? (ngo.rating / 5) : 0.5; // Default to 2.5/5
  }

  // Calculate time sensitivity score
  calculateTimeScore(createdAt) {
    const now = new Date();
    const created = new Date(createdAt);
    const hoursDiff = (now - created) / (1000 * 60 * 60);

    // More recent requests get higher scores
    if (hoursDiff < 24) return 10; // Last 24 hours
    if (hoursDiff < 72) return 7; // Last 3 days
    if (hoursDiff < 168) return 4; // Last week
    return 1; // Older
  }

  // Get smart recommendations for a user
  getSmartRecommendations(userId, userLocation = null, limit = 5) {
    this.loadUserHistory(userId);

    const recommendations = [];
    const userPrefs = this.userHistory[userId]?.preferences || {};

    // Filter requests based on user preferences and location
    let filteredRequests = this.requests.filter(request => {
      // Skip if user already donated to this request
      if (this.userHistory[userId]?.donations?.includes(request.id)) {
        return false;
      }

      // Check location preference
      if (userLocation && request.location) {
        const distance = this.calculateDistance(userLocation, request.location);
        if (distance > 100) return false; // Too far
      }

      return true;
    });

    // Score and sort requests
    const scoredRequests = filteredRequests.map(request => ({
      ...request,
      matchScore: this.calculateMatchScore({
        category: userPrefs.preferredCategory || 'food',
        location: userLocation
      }, request),
      confidence: this.calculateConfidence(request, userPrefs)
    }));

    // Sort by match score and confidence
    scoredRequests.sort((a, b) => {
      if (Math.abs(a.matchScore - b.matchScore) < 5) {
        return b.confidence - a.confidence;
      }
      return b.matchScore - a.matchScore;
    });

    return scoredRequests.slice(0, limit).map(req => ({
      id: req.id,
      title: req.title,
      category: req.category,
      ngoName: this.getNgoName(req.ngoId),
      location: req.location,
      urgency: req.urgency,
      matchScore: req.matchScore,
      confidence: req.confidence,
      reason: this.generateRecommendationReason(req, userPrefs)
    }));
  }

  // Calculate confidence score
  calculateConfidence(request, userPrefs) {
    let confidence = 0.5; // Base confidence

    // Category preference match
    if (userPrefs.preferredCategory === request.category) {
      confidence += 0.2;
    }

    // Location proximity
    if (request.location && userPrefs.location) {
      const distance = this.calculateDistance(userPrefs.location, request.location);
      if (distance < 10) confidence += 0.15;
      else if (distance < 50) confidence += 0.1;
    }

    // NGO trust score
    const ngoRating = this.getNgoRating(request.ngoId);
    confidence += (ngoRating - 0.5) * 0.2;

    // Urgency factor
    if (request.urgency === 'critical' || request.urgency === 'high') {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  // Generate recommendation reason
  generateRecommendationReason(request, userPrefs) {
    const reasons = [];

    if (userPrefs.preferredCategory === request.category) {
      reasons.push(`Matches your preferred ${request.category} donations`);
    }

    if (request.urgency === 'critical' || request.urgency === 'high') {
      reasons.push('High urgency request');
    }

    const ngo = this.ngos.find(n => n.id === request.ngoId);
    if (ngo && ngo.rating >= 4) {
      reasons.push('Highly rated NGO');
    }

    if (request.location && userPrefs.location) {
      const distance = this.calculateDistance(userPrefs.location, request.location);
      if (distance < 10) {
        reasons.push('Very close to your location');
      }
    }

    return reasons.length > 0 ? reasons[0] : 'Good match for your profile';
  }

  // Predict donation trends
  predictDonationTrends() {
    const categories = ['food', 'clothes', 'books', 'medical', 'education', 'shelter'];
    const predictions = {};

    categories.forEach(category => {
      const recentRequests = this.requests.filter(req =>
        req.category === category &&
        new Date(req.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );

      const recentDonations = this.donations.filter(don =>
        don.category === category &&
        new Date(don.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );

      const demand = recentRequests.length;
      const supply = recentDonations.length;
      const ratio = supply > 0 ? demand / supply : demand;

      predictions[category] = {
        demand: demand,
        supply: supply,
        ratio: ratio,
        trend: ratio > 1.5 ? 'high' : ratio > 1 ? 'medium' : 'low',
        recommendation: this.getTrendRecommendation(ratio, category)
      };
    });

    return predictions;
  }

  getTrendRecommendation(ratio, category) {
    if (ratio > 2) {
      return `High demand for ${category}. Consider donating!`;
    } else if (ratio > 1.5) {
      return `Growing need for ${category} donations.`;
    } else if (ratio < 0.5) {
      return `Good supply of ${category}, but always welcome.`;
    }
    return `Balanced ${category} donations.`;
  }

  // Predict blood shortage
  predictBloodShortage(location = null, radius = 50) {
    const bloodRequests = this.requests.filter(req =>
      req.category === 'medical' &&
      req.subCategory === 'blood'
    );

    if (location) {
      bloodRequests.filter(req => {
        const distance = this.calculateDistance(location, req.location);
        return distance <= radius;
      });
    }

    const recentRequests = bloodRequests.filter(req =>
      new Date(req.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    const shortageLevel = recentRequests.length > 10 ? 'critical' :
                         recentRequests.length > 5 ? 'high' :
                         recentRequests.length > 2 ? 'medium' : 'low';

    return {
      level: shortageLevel,
      requestCount: recentRequests.length,
      message: this.getBloodShortageMessage(shortageLevel),
      actionRequired: shortageLevel === 'critical' || shortageLevel === 'high'
    };
  }

  getBloodShortageMessage(level) {
    const messages = {
      critical: 'Critical blood shortage! Immediate donations needed.',
      high: 'High blood demand. Your donation can save lives.',
      medium: 'Moderate blood needs. Donations appreciated.',
      low: 'Blood supply is adequate, but donations always welcome.'
    };
    return messages[level];
  }

  // Get nearby NGOs
  getNearbyNGOs(userLocation, limit = 10) {
    if (!userLocation) return [];

    const ngosWithDistance = this.ngos.map(ngo => ({
      ...ngo,
      distance: this.calculateDistance(userLocation, ngo.location)
    }));

    return ngosWithDistance
      .filter(ngo => ngo.distance <= 100) // Within 100km
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }

  // Update user preferences based on actions
  updateUserPreferences(userId, action) {
    this.loadUserHistory(userId);

    const history = this.userHistory[userId];
    const prefs = history.preferences;

    // Update category preferences
    if (action.category) {
      prefs.preferredCategory = prefs.preferredCategory || action.category;
      prefs.categoryCounts = prefs.categoryCounts || {};
      prefs.categoryCounts[action.category] = (prefs.categoryCounts[action.category] || 0) + 1;

      // Update preferred category based on most frequent
      const mostFrequent = Object.keys(prefs.categoryCounts)
        .reduce((a, b) => prefs.categoryCounts[a] > prefs.categoryCounts[b] ? a : b);
      prefs.preferredCategory = mostFrequent;
    }

    // Update location
    if (action.location) {
      prefs.location = action.location;
    }

    // Save updated preferences
    saveToStorage(`user_history_${userId}`, history);
  }

  // Get personalized suggestions
  getPersonalizedSuggestions(userId) {
    this.loadUserHistory(userId);
    const history = this.userHistory[userId];
    const suggestions = [];

    // Suggest based on donation history
    if (history.donations.length > 0) {
      const lastDonation = history.donations[history.donations.length - 1];
      const similarRequests = this.requests.filter(req =>
        req.category === lastDonation.category &&
        !history.donations.includes(req.id)
      );

      if (similarRequests.length > 0) {
        suggestions.push({
          type: 'similar',
          title: `More ${lastDonation.category} requests`,
          items: similarRequests.slice(0, 3)
        });
      }
    }

    // Suggest urgent requests
    const urgentRequests = this.requests.filter(req =>
      (req.urgency === 'critical' || req.urgency === 'high') &&
      !history.donations.includes(req.id)
    );

    if (urgentRequests.length > 0) {
      suggestions.push({
        type: 'urgent',
        title: 'Urgent Help Needed',
        items: urgentRequests.slice(0, 3)
      });
    }

    // Suggest nearby opportunities
    if (history.preferences?.location) {
      const nearbyRequests = this.requests.filter(req => {
        const distance = this.calculateDistance(history.preferences.location, req.location);
        return distance <= 20 && !history.donations.includes(req.id);
      });

      if (nearbyRequests.length > 0) {
        suggestions.push({
          type: 'nearby',
          title: 'Nearby Opportunities',
          items: nearbyRequests.slice(0, 3)
        });
      }
    }

    return suggestions;
  }

  // Get NGO name helper
  getNgoName(ngoId) {
    const ngo = this.ngos.find(n => n.id === ngoId);
    return ngo ? ngo.name : 'Unknown NGO';
  }

  // Export AI insights
  exportInsights() {
    return {
      totalRequests: this.requests.length,
      totalNGOs: this.ngos.length,
      totalDonations: this.donations.length,
      categoryBreakdown: this.getCategoryBreakdown(),
      trendingNeeds: this.predictDonationTrends(),
      bloodShortage: this.predictBloodShortage()
    };
  }

  // Get category breakdown
  getCategoryBreakdown() {
    const breakdown = {};
    const categories = ['food', 'clothes', 'books', 'medical', 'education', 'shelter'];

    categories.forEach(cat => {
      breakdown[cat] = {
        requests: this.requests.filter(r => r.category === cat).length,
        donations: this.donations.filter(d => d.category === cat).length
      };
    });

    return breakdown;
  }

  // ==================== LEGACY METHODS FOR COMPATIBILITY ====================
  matchDonationToRequest(donation, request, ngoList) {
    const matches = [];

    ngoList.forEach(ngo => {
      const score = this.calculateMatchScore(donation, request);
      if (score > 50) {
        matches.push({
          ngo,
          score,
          reasoning: this.getMatchReasoning(score / 100)
        });
      }
    });

    return matches.sort((a, b) => b.score - a.score);
  }

  getMatchReasoning(score) {
    if (score > 0.9) return '🟢 Excellent Match - Recommended';
    if (score > 0.75) return '🟡 Good Match - Suitable';
    if (score > 0.6) return '🟠 Fair Match - Consider';
    return '🔴 Poor Match';
  }

  predictBloodShortage() {
    return this.predictBloodShortage();
  }

  predictFoodWaste() {
    return {
      timestamp: new Date(),
      estimate: '450-550 kg/day',
      trend: 'increasing',
      recommendation: 'Increase NGO partnerships'
    };
  }

  predictDemandTrend() {
    return {
      food: { trend: 'up', percentage: 12 },
      blood: { trend: 'down', percentage: 5 },
      books: { trend: 'up', percentage: 8 },
      clothes: { trend: 'stable', percentage: 2 }
    };
  }

  predictVolunteerAvailability(dayOfWeek) {
    const availability = {
      Monday: { morning: 0.4, afternoon: 0.6, evening: 0.8 },
      Tuesday: { morning: 0.35, afternoon: 0.55, evening: 0.75 },
      Wednesday: { morning: 0.3, afternoon: 0.5, evening: 0.7 },
      Thursday: { morning: 0.35, afternoon: 0.6, evening: 0.8 },
      Friday: { morning: 0.5, afternoon: 0.7, evening: 0.85 },
      Saturday: { morning: 0.8, afternoon: 0.85, evening: 0.9 },
      Sunday: { morning: 0.75, afternoon: 0.8, evening: 0.85 }
    };
    return availability[dayOfWeek];
  }

  detectFraud(user, transaction) {
    const riskFactors = [];
    let riskScore = 0;

    if (!user.verified) {
      riskFactors.push('Unverified account');
      riskScore += 0.2;
    }

    if (transaction.amount > 100) {
      riskFactors.push('Large transaction amount');
      riskScore += 0.15;
    }

    if (transaction.isRapidSequence) {
      riskFactors.push('Rapid consecutive transactions');
      riskScore += 0.2;
    }

    if (transaction.locationAnomaly) {
      riskFactors.push('Unusual location');
      riskScore += 0.15;
    }

    return {
      riskScore: Math.min(riskScore, 1),
      isFraudulent: riskScore > 0.5,
      riskFactors,
      recommendation: riskScore > 0.5 ? 'Verify with user' : 'Proceed'
    };
  }

  getRecommendations(user) {
    const recommendations = [];

    if (user.role === 'donor') {
      const ngo = this.ngos[0] || {};
      recommendations.push({
        title: 'Food Needed Nearby',
        description: `${ngo.name || 'NGO'} needs food donations urgently`,
        action: 'Donate Now',
        urgency: 'high',
        icon: '🍲'
      });

      recommendations.push({
        title: 'Volunteer Opportunity',
        description: 'Help with delivery to orphanage this weekend',
        action: 'Volunteer',
        urgency: 'medium',
        icon: '🤝'
      });
    }

    if (user.role === 'volunteer') {
      recommendations.push({
        title: 'Urgent Pickup',
        description: 'Food pickup from restaurant - 2.3 km away',
        action: 'Accept',
        urgency: 'high',
        icon: '📍'
      });
    }

    return recommendations;
  }

  calculateImpactScore(user) {
    let score = 0;

    const donationBonus = Math.min((user.totalDonations || 0) * 2, 30);
    score += donationBonus;

    const consistencyBonus = (user.donationStreak || 0) * 5;
    score += Math.min(consistencyBonus, 20);

    const trustBonus = (user.verified ? 20 : 0);
    score += trustBonus;

    const volumeBonus = Math.min((user.donationAmount || 0) / 100, 15);
    score += volumeBonus;

    const urgencyBonus = ((user.emergencyResponses || 0) * 3);
    score += Math.min(urgencyBonus, 15);

    return Math.min(score, 100);
  }

  optimizeRoute(startLocation, pickupLocations) {
    const route = [startLocation];
    let current = startLocation;
    const remaining = [...pickupLocations];

    while (remaining.length > 0) {
      let nearest = remaining[0];
      let minDist = this.calculateDistance(current, nearest);

      for (let i = 1; i < remaining.length; i++) {
        const dist = this.calculateDistance(current, remaining[i]);
        if (dist < minDist) {
          nearest = remaining[i];
          minDist = dist;
        }
      }

      route.push(nearest);
      current = nearest;
      remaining.splice(remaining.indexOf(nearest), 1);
    }

    return {
      route,
      totalDistance: this.calculateTotalDistance(route),
      estimatedTime: route.length * 15 + 'mins'
    };
  }

  calculateTotalDistance(route) {
    let total = 0;
    for (let i = 0; i < route.length - 1; i++) {
      total += this.calculateDistance(route[i], route[i + 1]);
    }
    return total.toFixed(2);
  }
}

// ==================== EXPORT ====================
const aiEngine = new AIMatchingEngine();
window.aiEngine = aiEngine;
window.AIMatchingEngine = AIMatchingEngine;