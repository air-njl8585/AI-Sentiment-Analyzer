
import SentimentAnalyzer from "@/components/SentimentAnalyzer";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b py-6 px-4 sm:px-6 mb-8">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-medium tracking-tight">Sentiment Sage</h1>
            <Badge variant="outline" className="text-xs font-normal">AI-Powered</Badge>
          </div>
        </div>
      </header>

      <main className="container flex-1 px-4 pb-12">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
          <div className="inline-block">
            <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium uppercase tracking-wide">
              AI-Powered Text Analysis
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-balance">
            Analyze the sentiment of any text
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI analyzes the emotional tone of your text, helping you understand the sentiment behind the words.
          </p>
        </div>

        <SentimentAnalyzer />
      </main>

      <footer className="border-t py-6 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Using advanced sentiment analysis algorithms to evaluate text</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
