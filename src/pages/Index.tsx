import { useState } from "react";
import { BookCard } from "@/components/BookCard";
import { BookPrompt } from "@/components/MoodPrompt";
import { GoodreadsUpload } from "@/components/GoodreadsUpload";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { getBookRecommendations, EnhancedBookData, UserPreferences, GoodreadsBook } from "@/lib/api";
import { toast } from "sonner";
import { Sparkles, BookOpen, ArrowLeft, Upload, Brain, Star } from "lucide-react";
import { BookCardSkeleton } from "@/components/ui/loading-skeleton";

const Index = () => {
  const [books, setBooks] = useState<EnhancedBookData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [goodreadsBooks, setGoodreadsBooks] = useState<GoodreadsBook[]>([]);
  const [showGoodreadsUpload, setShowGoodreadsUpload] = useState(false);

  const handlePromptSubmit = async (prompt: string) => {
    setCurrentPrompt(prompt);
    setIsLoading(true);
    setBooks([]);
    
    try {
      const foundBooks = await getBookRecommendations(
        prompt, 
        userPreferences || undefined, 
        goodreadsBooks.length > 0 ? goodreadsBooks : undefined
      );
      setBooks(foundBooks);
      
      if (foundBooks.length === 0) {
        toast.error("No books found. Try a different search term.");
      } else {
        const hasPersonalized = userPreferences && goodreadsBooks.length > 0;
        toast.success(
          hasPersonalized 
            ? `Found ${foundBooks.length} personalized recommendations for you!`
            : `Found ${foundBooks.length} great books for you!`
        );
      }
    } catch (error) {
      console.error("Error getting recommendations:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setBooks([]);
    setCurrentPrompt("");
  };

  const handlePreferencesAnalyzed = (preferences: UserPreferences, books: GoodreadsBook[]) => {
    setUserPreferences(preferences);
    setGoodreadsBooks(books);
    setShowGoodreadsUpload(false);
    toast.success(`Analyzed ${books.length} books from your Goodreads library!`);
  };

  const handleRemovePreferences = () => {
    setUserPreferences(null);
    setGoodreadsBooks([]);
    toast.success("Removed your reading history. Starting fresh!");
  };

  // Show chat interface when no results or loading
  if (books.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-tl from-amber-warm/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-amber-warm/5 rounded-full blur-3xl animate-pulse-glow"></div>
        </div>

        {/* Goodreads Upload Modal */}
        {showGoodreadsUpload && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <GoodreadsUpload 
              onPreferencesAnalyzed={handlePreferencesAnalyzed}
              onClose={() => setShowGoodreadsUpload(false)}
            />
          </div>
        )}

        {/* Chat Interface */}
        <section className="relative py-20 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Hero section with enhanced animations */}
            <div className="animate-fade-in mb-8">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-gradient-to-r from-primary/10 to-amber-warm/10 rounded-full border border-primary/20">
                <Brain className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">AI-Powered Book Discovery</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent animate-scale-in">
                BookRec AI
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up">
                Discover your perfect next read with AI that learns your preferences.
              </p>
            </div>

            {/* User Preferences Status */}
            {userPreferences && goodreadsBooks.length > 0 && (
              <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Star className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-green-700">Personalized Recommendations Active</p>
                      <p className="text-sm text-green-600">
                        Using {goodreadsBooks.length} books from your Goodreads library
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemovePreferences}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
            
            {/* Book prompt with enhanced styling */}
            <div className="max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
              <BookPrompt 
                onSubmit={handlePromptSubmit} 
                isLoading={isLoading}
                hasUserPreferences={!!userPreferences}
              />
            </div>

            {/* Goodreads Upload Button */}
            {!userPreferences && (
              <div className="mt-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <Button
                  variant="outline"
                  onClick={() => setShowGoodreadsUpload(true)}
                  className="bg-background/50 hover:bg-background/80 border-border/50 hover:border-primary/50 transition-all duration-300"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Goodreads Library for Better Recommendations
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Upload your Goodreads CSV to get personalized recommendations
                </p>
              </div>
            )}

            {/* Feature highlights */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 hover-lift transition-smooth">
                <Brain className="w-8 h-8 text-primary mb-3 mx-auto" />
                <h3 className="font-semibold mb-2">AI Learning</h3>
                <p className="text-sm text-muted-foreground">Gets to know your reading preferences over time</p>
              </div>
              <div className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 hover-lift transition-smooth">
                <BookOpen className="w-8 h-8 text-primary mb-3 mx-auto" />
                <h3 className="font-semibold mb-2">Goodreads Integration</h3>
                <p className="text-sm text-muted-foreground">Import your library for instant personalized recommendations</p>
              </div>
              <div className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 hover-lift transition-smooth">
                <Star className="w-8 h-8 text-primary mb-3 mx-auto" />
                <h3 className="font-semibold mb-2">Smart Matching</h3>
                <p className="text-sm text-muted-foreground">Advanced algorithms find books you'll actually love</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Show results interface when books are loaded or loading
  return (
    <div className="min-h-screen bg-background">
      {/* Results Header */}
      <section className="py-12 px-6 text-center bg-gradient-to-b from-muted/30 to-background relative">
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              BookRec AI
            </h1>
            {currentPrompt && (
              <div className="mb-6 animate-slide-up">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                  {userPreferences && goodreadsBooks.length > 0 ? 'Personalized' : ''} Recommendations for "{currentPrompt}"
                </h2>
                <div className="flex items-center justify-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleNewChat}
                    className="hover-lift transition-smooth button-press"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Start New Chat
                  </Button>
                  {!userPreferences && (
                    <Button
                      variant="outline"
                      onClick={() => setShowGoodreadsUpload(true)}
                      className="hover-lift transition-smooth button-press"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import Goodreads
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Goodreads Upload Modal */}
      {showGoodreadsUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GoodreadsUpload 
            onPreferencesAnalyzed={handlePreferencesAnalyzed}
            onClose={() => setShowGoodreadsUpload(false)}
          />
        </div>
      )}

      {/* Books Results */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {[...Array(6)].map((_, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <BookCardSkeleton />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="transition-smooth hover:scale-110" />
              <CarouselNext className="transition-smooth hover:scale-110" />
            </Carousel>
          ) : (
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {books.map((book, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div
                      className="animate-fade-in opacity-0 p-4"
                      style={{
                        animationDelay: `${index * 150}ms`,
                        animationFillMode: 'forwards'
                      }}
                    >
                      <BookCard {...book} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="transition-smooth hover:scale-110" />
              <CarouselNext className="transition-smooth hover:scale-110" />
            </Carousel>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;