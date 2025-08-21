import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should use a backend proxy
});

export interface BookRecommendation {
  title: string;
  author: string;
  reason: string;
  genre: string;
  mood: string;
}

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    categories?: string[];
    averageRating?: number;
    description?: string;
    publishedDate?: string;
    pageCount?: number;
    publisher?: string;
  };
}

export interface EnhancedBookData {
  title: string;
  author: string;
  cover: string;
  genres?: string[];
  rating?: number;
  description?: string;
  amazonUrl?: string;
  publishedDate?: string;
  pageCount?: number;
  publisher?: string;
  reason?: string;
  mood?: string;
}

// GPT API function to process user input and generate book recommendations
export const processUserInputWithGPT = async (userInput: string): Promise<BookRecommendation[]> => {
  try {
    const prompt = `You are a knowledgeable book recommendation expert. Based on the user's input, suggest 6 specific books that would be perfect for their mood and preferences. 

User input: "${userInput}"

For each book, provide:
1. Exact title
2. Author name
3. Brief reason why this book matches their mood/preferences
4. Primary genre
5. Mood/feeling the book evokes

Format your response as a JSON array with this structure:
[
  {
    "title": "Exact Book Title",
    "author": "Author Name", 
    "reason": "Why this book matches their mood",
    "genre": "Primary genre",
    "mood": "Mood/feeling"
  }
]

Only return valid JSON, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful book recommendation assistant. Always respond with valid JSON arrays containing book recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from GPT API');
    }

    // Parse the JSON response
    const recommendations: BookRecommendation[] = JSON.parse(response);
    return recommendations.slice(0, 6); // Ensure we get max 6 recommendations
  } catch (error) {
    console.error('Error processing with GPT:', error);
    // Fallback to basic search if GPT fails
    return [];
  }
};

// Enhanced Google Books API search
export const searchGoogleBooks = async (query: string): Promise<EnhancedBookData[]> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=6&orderBy=relevance`
    );
    const data = await response.json();
    
    if (data.items) {
      return data.items.map((item: GoogleBook) => {
        const title = item.volumeInfo.title || "Unknown Title";
        const author = item.volumeInfo.authors?.[0] || "Unknown Author";
        const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(`${title} ${author} book`)}&ref=nb_sb_noss`;
        
        return {
          title,
          author,
          cover: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || "/placeholder.svg",
          genres: item.volumeInfo.categories?.slice(0, 2),
          rating: item.volumeInfo.averageRating,
          description: item.volumeInfo.description,
          publishedDate: item.volumeInfo.publishedDate,
          pageCount: item.volumeInfo.pageCount,
          publisher: item.volumeInfo.publisher,
          amazonUrl
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

// Combined function that uses GPT for recommendations and Google Books for details
export const getBookRecommendations = async (userInput: string): Promise<EnhancedBookData[]> => {
  try {
    // First, get GPT recommendations
    const gptRecommendations = await processUserInputWithGPT(userInput);
    
    if (gptRecommendations.length === 0) {
      // Fallback to direct Google Books search
      return await searchGoogleBooks(userInput);
    }

    // For each GPT recommendation, search Google Books for additional details
    const enhancedBooks: EnhancedBookData[] = [];
    
    for (const recommendation of gptRecommendations) {
      const searchQuery = `${recommendation.title} ${recommendation.author}`;
      const googleBooks = await searchGoogleBooks(searchQuery);
      
      if (googleBooks.length > 0) {
        const book = googleBooks[0];
        enhancedBooks.push({
          ...book,
          reason: recommendation.reason,
          mood: recommendation.mood
        });
      } else {
        // If Google Books doesn't find it, create a basic entry
        enhancedBooks.push({
          title: recommendation.title,
          author: recommendation.author,
          cover: "/placeholder.svg",
          genres: [recommendation.genre],
          reason: recommendation.reason,
          mood: recommendation.mood,
          amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(`${recommendation.title} ${recommendation.author} book`)}&ref=nb_sb_noss`
        });
      }
    }

    return enhancedBooks;
  } catch (error) {
    console.error('Error getting book recommendations:', error);
    // Fallback to basic Google Books search
    return await searchGoogleBooks(userInput);
  }
};
