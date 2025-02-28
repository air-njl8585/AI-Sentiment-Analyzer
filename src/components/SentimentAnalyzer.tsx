
import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";
import { analyzeSentiment, SentimentResult, getSentimentColor } from '../utils/sentimentUtils';
import ResultDisplay from './ResultDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const SentimentAnalyzer = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [recentResults, setRecentResults] = useState<SentimentResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('analyze');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Set focus to textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleAnalyze = () => {
    if (!text.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate API call with a small delay for UX
    setTimeout(() => {
      try {
        const newResult = analyzeSentiment(text);
        setResult(newResult);
        
        // Add to recent results (keep most recent 5)
        setRecentResults(prev => [newResult, ...prev].slice(0, 5));
        
        setIsAnalyzing(false);
        setActiveTab('result');
        
        toast({
          title: "Analysis complete",
          description: `Text sentiment: ${newResult.sentiment.label}`,
        });
      } catch (error) {
        console.error("Analysis error:", error);
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis failed",
          description: "There was an error analyzing your text. Please try again.",
          variant: "destructive",
        });
      }
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Command/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const handleClear = () => {
    setText('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSelectPrevious = (prevResult: SentimentResult) => {
    setText(prevResult.original);
    setResult(prevResult);
    setActiveTab('result');
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="analyze" className="text-lg py-3">Analyze</TabsTrigger>
          <TabsTrigger value="result" className="text-lg py-3" disabled={!result}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analyze" className="mt-0 space-y-6">
          <div className="space-y-4">
            <Textarea
              ref={textareaRef}
              placeholder="Enter text to analyze sentiment..."
              className="min-h-[200px] text-base p-4 resize-none transition-all border shadow-sm focus-visible:ring-1"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isAnalyzing}
            />
            
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {text.length > 0 ? `${text.split(/\s+/).filter(word => word.length > 0).length} words` : 'Enter text to analyze'}
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={handleClear}
                  className="flex-1 sm:flex-none"
                  disabled={isAnalyzing || text.length === 0}
                >
                  Clear
                </Button>
                
                <Button 
                  onClick={handleAnalyze}
                  className="flex-1 sm:flex-none relative overflow-hidden group"
                  disabled={isAnalyzing || text.length === 0}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Sentiment
                      <span className="absolute inset-0 w-full h-full bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {recentResults.length > 0 && (
            <Card className="mt-8 border shadow-sm">
              <CardContent className="pt-6">
                <h3 className="text-base font-medium mb-3">Recent Analyses</h3>
                <div className="space-y-2">
                  {recentResults.map((prevResult, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start h-auto py-2 px-3 text-left overflow-hidden"
                      onClick={() => handleSelectPrevious(prevResult)}
                    >
                      <div className="truncate flex-1">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 bg-${getSentimentColor(prevResult.sentiment.label)}`}></span>
                        {prevResult.original.length > 60 
                          ? prevResult.original.substring(0, 60) + '...'
                          : prevResult.original}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="result" className="mt-0">
          {result && <ResultDisplay result={result} />}
          
          <div className="mt-6 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('analyze')}
              className="mx-auto"
            >
              Analyze Another Text
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SentimentAnalyzer;
