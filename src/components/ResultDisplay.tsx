
import { useState, useEffect } from 'react';
import { SentimentResult, getSentimentColor, formatScore } from '../utils/sentimentUtils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ResultDisplayProps {
  result: SentimentResult | null;
}

const ResultDisplay = ({ result }: ResultDisplayProps) => {
  const [visible, setVisible] = useState(false);

  // Animation on result change
  useEffect(() => {
    if (result) {
      setVisible(false);
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [result]);

  if (!result) {
    return null;
  }

  const { sentiment, analysis } = result;
  const sentimentColor = getSentimentColor(sentiment.label);

  // Convert score (-1 to 1) to progress (0 to 100)
  const progressValue = ((sentiment.score + 1) / 2) * 100;

  return (
    <div className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <Card className="overflow-hidden border shadow-sm hover-lift">
        <CardHeader className={`bg-${sentimentColor}/10 pb-2`}>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={`text-${sentimentColor} border-${sentimentColor}/30 bg-${sentimentColor}/10`}>
              {sentiment.label.charAt(0).toUpperCase() + sentiment.label.slice(1)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Confidence: {formatScore(sentiment.confidence)}
            </span>
          </div>
          <CardTitle className="text-2xl font-medium mt-2">Sentiment Analysis</CardTitle>
          <CardDescription>Analysis of the emotional tone of your text</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Negative</span>
                <span>Positive</span>
              </div>
              <Progress value={progressValue} className="h-2.5" 
                style={{
                  background: 'linear-gradient(to right, rgba(255,59,48,0.3), rgba(142,142,147,0.3), rgba(52,199,89,0.3))'
                }}
              />
            </div>

            {(analysis.positiveWords.length > 0 || analysis.negativeWords.length > 0) && (
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Key words detected:</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.positiveWords.length > 0 && analysis.positiveWords.map((word, i) => (
                    <Badge key={`pos-${i}`} variant="outline" className="text-sentiment-positive border-sentiment-positive/30 bg-sentiment-positive/10">
                      {word}
                    </Badge>
                  ))}
                  {analysis.negativeWords.length > 0 && analysis.negativeWords.map((word, i) => (
                    <Badge key={`neg-${i}`} variant="outline" className="text-sentiment-negative border-sentiment-negative/30 bg-sentiment-negative/10">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/20 py-3">
          <div className="text-sm text-muted-foreground w-full text-center">
            Analysis based on vocabulary patterns
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResultDisplay;
