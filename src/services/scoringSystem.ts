interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  timestamp: Date;
}

interface PlayerStats {
  cluesFound: number;
  questionsAsked: number;
  correctDeductions: number;
  timeSpent: number;
}

interface ScoringConfig {
  pointsPerClue: number;
  pointsPerCorrectDeduction: number;
  pointsForSolving: number;
  timeBonus: {
    threshold: number;  // in milliseconds
    points: number;
  };
  achievements: {
    quickStart: {
      timeThreshold: number;  // in milliseconds
      points: number;
    };
    masterDetective: {
      cluesNeeded: number;
      points: number;
    };
    keenObserver: {
      deductionsNeeded: number;
      points: number;
    };
    firstClue: {
      points: number;
    };
    socialButterfly: {
      questionsNeeded: number;
      points: number;
    };
  };
}

export class ScoringSystem {
  private config: ScoringConfig = {
    pointsPerClue: 100,
    pointsPerCorrectDeduction: 200,
    pointsForSolving: 1000,
    timeBonus: {
      threshold: 30 * 60 * 1000, // 30 minutes
      points: 500,
    },
    achievements: {
      quickStart: {
        timeThreshold: 5 * 60 * 1000, // 5 minutes
        points: 300,
      },
      masterDetective: {
        cluesNeeded: 10,
        points: 500,
      },
      keenObserver: {
        deductionsNeeded: 5,
        points: 400,
      },
      firstClue: {
        points: 100,
      },
      socialButterfly: {
        questionsNeeded: 15,
        points: 300,
      },
    },
  };

  private playerStats: Map<string, PlayerStats> = new Map();
  private playerAchievements: Map<string, Achievement[]> = new Map();
  private gameStartTime: Date;

  constructor() {
    this.gameStartTime = new Date();
  }

  initializePlayer(playerId: string) {
    this.playerStats.set(playerId, {
      cluesFound: 0,
      questionsAsked: 0,
      correctDeductions: 0,
      timeSpent: 0,
    });
    this.playerAchievements.set(playerId, []);
  }

  // Core scoring methods
  onClueFound(playerId: string) {
    const stats = this.getPlayerStats(playerId);
    stats.cluesFound++;
    
    // Check for first clue achievement
    if (stats.cluesFound === 1) {
      this.awardAchievement(playerId, {
        id: 'first_clue',
        name: 'First Discovery',
        description: 'Found your first clue',
        icon: 'search',
        points: this.config.achievements.firstClue.points,
        timestamp: new Date(),
      });
    }

    // Check for master detective achievement
    if (stats.cluesFound === this.config.achievements.masterDetective.cluesNeeded) {
      this.awardAchievement(playerId, {
        id: 'master_detective',
        name: 'Master Detective',
        description: 'Found 10 crucial clues',
        icon: 'trophy',
        points: this.config.achievements.masterDetective.points,
        timestamp: new Date(),
      });
    }
  }

  onQuestionAsked(playerId: string) {
    const stats = this.getPlayerStats(playerId);
    stats.questionsAsked++;

    // Check for social butterfly achievement
    if (stats.questionsAsked === this.config.achievements.socialButterfly.questionsNeeded) {
      this.awardAchievement(playerId, {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Asked 15 insightful questions',
        icon: 'message-circle',
        points: this.config.achievements.socialButterfly.points,
        timestamp: new Date(),
      });
    }
  }

  onCorrectDeduction(playerId: string) {
    const stats = this.getPlayerStats(playerId);
    stats.correctDeductions++;

    // Check for keen observer achievement
    if (stats.correctDeductions === this.config.achievements.keenObserver.deductionsNeeded) {
      this.awardAchievement(playerId, {
        id: 'keen_observer',
        name: 'Keen Observer',
        description: 'Made 5 correct deductions',
        icon: 'eye',
        points: this.config.achievements.keenObserver.points,
        timestamp: new Date(),
      });
    }
  }

  onMysterySolved(playerId: string) {
    const timeSpent = new Date().getTime() - this.gameStartTime.getTime();
    const stats = this.getPlayerStats(playerId);
    stats.timeSpent = timeSpent;

    // Award quick solve bonus if applicable
    if (timeSpent < this.config.achievements.quickStart.timeThreshold) {
      this.awardAchievement(playerId, {
        id: 'quick_solve',
        name: 'Quick Thinking',
        description: 'Solved the mystery in record time',
        icon: 'clock',
        points: this.config.achievements.quickStart.points,
        timestamp: new Date(),
      });
    }
  }

  // Helper methods
  private getPlayerStats(playerId: string): PlayerStats {
    const stats = this.playerStats.get(playerId);
    if (!stats) {
      throw new Error('Player not initialized');
    }
    return stats;
  }

  private awardAchievement(playerId: string, achievement: Achievement) {
    const achievements = this.playerAchievements.get(playerId);
    if (!achievements) {
      throw new Error('Player not initialized');
    }
    achievements.push(achievement);
  }

  // Scoring calculations
  calculateScore(playerId: string): number {
    const stats = this.getPlayerStats(playerId);
    const achievements = this.playerAchievements.get(playerId) || [];

    let score = 0;

    // Base points
    score += stats.cluesFound * this.config.pointsPerClue;
    score += stats.correctDeductions * this.config.pointsPerCorrectDeduction;

    // Achievement points
    score += achievements.reduce((sum, achievement) => sum + achievement.points, 0);

    // Time bonus if applicable
    if (stats.timeSpent > 0 && stats.timeSpent < this.config.timeBonus.threshold) {
      score += this.config.timeBonus.points;
    }

    return score;
  }

  getPlayerAchievements(playerId: string): Achievement[] {
    return this.playerAchievements.get(playerId) || [];
  }

  getLeaderboard() {
    const leaderboard = Array.from(this.playerStats.entries()).map(([playerId, stats]) => ({
      playerId,
      stats,
      score: this.calculateScore(playerId),
      achievements: this.getPlayerAchievements(playerId),
    }));

    return leaderboard.sort((a, b) => b.score - a.score);
  }
}