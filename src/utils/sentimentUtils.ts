
// Simple scoring - this could be replaced with a more sophisticated model
export type SentimentScore = {
  score: number;  // -1 to 1
  label: 'positive' | 'neutral' | 'negative';
  confidence: number; // 0 to 1
};

export type SentimentResult = {
  original: string;
  sentiment: SentimentScore;
  analysis: {
    positiveWords: string[];
    negativeWords: string[];
    neutralWords: string[];
  };
  timestamp: Date;
};

const positiveWords = [
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
  'happy', 'joy', 'love', 'like', 'beautiful', 'best', 'pleasure',
  'glad', 'excited', 'impressive', 'perfect', 'nice', 'awesome',
  'superb', 'outstanding', 'positive', 'delightful', 'brilliant'
];

const negativeWords = [
  'bad', 'terrible', 'awful', 'horrible', 'disappointing', 'poor',
  'sad', 'hate', 'dislike', 'ugly', 'worst', 'pain', 'sorry',
  'upset', 'angry', 'horrible', 'negative', 'broken', 'tragic',
  'failed', 'disgusting', 'pathetic', 'annoying', 'unpleasant'
];

export const analyzeSentiment = (text: string): SentimentResult => {
  // Normalize and split the text
  const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 0);
  
  // Count positive, negative, and neutral words
  const positiveMatches: string[] = [];
  const negativeMatches: string[] = [];
  const neutralWords: string[] = [];
  
  words.forEach(word => {
    if (positiveWords.includes(word)) {
      positiveMatches.push(word);
    } else if (negativeWords.includes(word)) {
      negativeMatches.push(word);
    } else {
      neutralWords.push(word);
    }
  });
  
  // Calculate a basic sentiment score (-1 to 1)
  const positiveCount = positiveMatches.length;
  const negativeCount = negativeMatches.length;
  const totalSentimentWords = positiveCount + negativeCount;
  
  // Default to neutral if no sentiment-laden words are found
  if (totalSentimentWords === 0) {
    return {
      original: text,
      sentiment: {
        score: 0,
        label: 'neutral',
        confidence: 1.0
      },
      analysis: {
        positiveWords: positiveMatches,
        negativeWords: negativeMatches,
        neutralWords
      },
      timestamp: new Date()
    };
  }
  
  // Calculate normalized score from -1 to 1
  const score = (positiveCount - negativeCount) / totalSentimentWords;
  
  // Determine sentiment label
  let label: 'positive' | 'neutral' | 'negative';
  if (score > 0.2) {
    label = 'positive';
  } else if (score < -0.2) {
    label = 'negative';
  } else {
    label = 'neutral';
  }
  
  // Calculate a simple confidence metric
  // Higher confidence if there are more sentiment words and the score is further from 0
  const confidence = Math.min(
    Math.abs(score) * 1.5 + (totalSentimentWords / words.length) * 0.5,
    1
  );
  
  return {
    original: text,
    sentiment: {
      score,
      label,
      confidence
    },
    analysis: {
      positiveWords: positiveMatches,
      negativeWords: negativeMatches,
      neutralWords
    },
    timestamp: new Date()
  };
};

export const getSentimentColor = (label: 'positive' | 'neutral' | 'negative'): string => {
  switch (label) {
    case 'positive':
      return 'sentiment-positive';
    case 'negative':
      return 'sentiment-negative';
    default:
      return 'sentiment-neutral';
  }
};

export const getSentimentEmoji = (label: 'positive' | 'neutral' | 'negative'): string => {
  switch (label) {
    case 'positive':
      return '😊';
    case 'negative':
      return '😔';
    default:
      return '😐';
  }
};

export const formatScore = (score: number): string => {
  return (score * 100).toFixed(0) + '%';
};
