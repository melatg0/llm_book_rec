import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Send, Brain, Heart, Zap } from "lucide-react";

interface MoodPromptProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
}

const moodSuggestions = [
  {
    text: "I'm feeling melancholy and want something uplifting",
    icon: Heart,
    category: "Emotional"
  },
  {
    text: "Looking for an adventure to escape reality",
    icon: Zap,
    category: "Adventure"
  },
  {
    text: "Need a thought-provoking mystery",
    icon: Brain,
    category: "Mystery"
  },
  {
    text: "Want to learn something new while being entertained",
    icon: Sparkles,
    category: "Educational"
  },
  {
    text: "Seeking comfort and nostalgia",
    icon: Heart,
    category: "Comfort"
  },
  {
    text: "Craving epic fantasy with complex world-building",
    icon: Zap,
    category: "Fantasy"
  }
];

export const MoodPrompt = ({ onSubmit, isLoading = false }: MoodPromptProps) => {
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
    <Card className="bg-gradient-card shadow-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Describe Your Reading Mood
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Tell me how you're feeling or what kind of book you're in the mood for... (Press Enter to submit)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-[100px] bg-background/50 resize-none"
        />
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Or try one of these:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {moodSuggestions.map((suggestion, index) => {
              const IconComponent = suggestion.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left h-auto p-3 justify-start hover:bg-blue-50 dark:hover:bg-blue-950/20"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                >
                  <IconComponent className="w-4 h-4 mr-2 text-blue-500" />
                  <div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {suggestion.category}
                    </div>
                    <div className="text-sm">"{suggestion.text}"</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!prompt.trim() || isLoading}
          className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300"
          size="lg"
        >
          <Send className="w-4 h-4 mr-2" />
          {isLoading ? "Finding perfect books..." : "Get My Recommendations"}
        </Button>
      </CardContent>
    </Card>
  );
};