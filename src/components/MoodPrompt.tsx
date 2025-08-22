import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Send, Brain, Heart, Zap, Loader2, BookOpen, Search, Star } from "lucide-react";

interface BookPromptProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  hasUserPreferences?: boolean;
}

const suggestionCategories = [
  {
    text: "I love fantasy with complex world-building and magic systems",
    icon: Sparkles,
    category: "Fantasy",
    color: "from-purple-500 to-indigo-500"
  },
  {
    text: "Looking for a gripping mystery or thriller that keeps me guessing",
    icon: Brain,
    category: "Mystery",
    color: "from-blue-500 to-cyan-500"
  },
  {
    text: "Want to explore historical fiction set in interesting time periods",
    icon: BookOpen,
    category: "Historical",
    color: "from-amber-500 to-orange-500"
  },
  {
    text: "Need something thought-provoking about society or human nature",
    icon: Heart,
    category: "Literary",
    color: "from-green-500 to-emerald-500"
  },
  {
    text: "Craving fast-paced sci-fi with innovative technology and ideas",
    icon: Zap,
    category: "Sci-Fi",
    color: "from-violet-500 to-purple-500"
  },
  {
    text: "Seeking heartwarming contemporary fiction about relationships",
    icon: Heart,
    category: "Contemporary",
    color: "from-pink-500 to-rose-500"
  }
];

export const BookPrompt = ({ onSubmit, isLoading = false, hasUserPreferences = false }: BookPromptProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="bg-gradient-card shadow-glow border-border/50 backdrop-blur-sm animate-scale-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-gradient-to-r from-primary/10 to-amber-warm/10 rounded-lg">
            <Search className="w-5 h-5 text-primary" />
          </div>
          {hasUserPreferences ? "What would you like to read next?" : "Tell me what you're looking for"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Textarea
            placeholder={
              hasUserPreferences 
                ? "Describe what you're in the mood for, or ask for recommendations similar to books you've loved... (Press Enter to submit)"
                : "Tell me about your reading preferences, favorite genres, or what kind of book you're looking for... (Press Enter to submit)"
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[120px] bg-background/50 resize-none border-border/50 focus:border-primary/50 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground text-right">
            {prompt.length}/500 characters
          </p>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground font-medium">Or try one of these:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestionCategories.map((suggestion, index) => {
              const IconComponent = suggestion.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left h-auto p-4 justify-start hover:shadow-md transition-all duration-300 hover-lift border-border/50 bg-background/30 hover:bg-background/50 group"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  disabled={isLoading}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${suggestion.color} mr-3 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-primary mb-1">
                      {suggestion.category}
                    </div>
                    <div className="text-sm leading-relaxed">"{suggestion.text}"</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {hasUserPreferences && (
          <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <Star className="w-4 h-4 text-primary" />
            <p className="text-sm text-primary font-medium">
              Using your reading history for personalized recommendations
            </p>
          </div>
        )}

        <Button 
          onClick={handleSubmit}
          disabled={!prompt.trim() || isLoading}
          className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300 button-press h-12 text-base font-medium group"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Finding perfect books...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
              Get My Recommendations
            </>
          )}
        </Button>

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <span className="ml-2">
                {hasUserPreferences ? 'Analyzing your preferences...' : 'Searching for books...'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};