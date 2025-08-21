import { useState } from "react";
import { BookCard } from "@/components/BookCard";
import { MoodPrompt } from "@/components/MoodPrompt";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { getBookRecommendations, EnhancedBookData } from "@/lib/api";
import { toast } from "sonner";

const Index = () => {
  const [books, setBooks] = useState<EnhancedBookData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");

  const handlePromptSubmit = async (prompt: string) => {
    setCurrentPrompt(prompt);
    setIsLoading(true);
    setBooks([]);
    
    try {
      const foundBooks = await getBookRecommendations(prompt);
      setBooks(foundBooks);
      
      if (foundBooks.length === 0) {
        toast.error("No books found. Try a different search term.");
      } else {
        toast.success(`Found ${foundBooks.length} perfect books for you!`);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            BookMood AI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover your perfect next read based on how you're feeling.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <MoodPrompt onSubmit={handlePromptSubmit} isLoading={isLoading} />
          </div>
        </div>
      </section>

      {/* Books Results */}
      {(books.length > 0 || isLoading) && (
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            {currentPrompt && (
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Books for "{currentPrompt}"</h2>
                <Button 
                  variant="outline" 
                  onClick={handleNewChat}
                  className="mb-8"
                >
                  Start New Chat
                </Button>
              </div>
            )}
            
            {isLoading ? (
              <Carousel className="w-full max-w-5xl mx-auto">
                <CarouselContent>
                  {[...Array(6)].map((_, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div className="animate-pulse p-4">
                        <div className="bg-muted rounded-lg aspect-[3/4] mb-4"></div>
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <Carousel className="w-full max-w-5xl mx-auto">
                <CarouselContent>
                  {books.map((book, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div
                        className="animate-fade-in opacity-0 p-4"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'forwards'
                        }}
                      >
                        <BookCard {...book} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;