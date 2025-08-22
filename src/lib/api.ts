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
  confidence: number;
  matchScore: number;
}

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
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
  reviewCount?: number;
  description?: string;
  goodreadsUrl?: string;
  publishedDate?: string;
  pageCount?: number;
  publisher?: string;
  reason?: string;
  confidence?: number;
  matchScore?: number;
}

export interface UserPreferences {
  favoriteGenres: string[];
  favoriteAuthors: string[];
  readingHistory: string[];
  preferredLength: 'short' | 'medium' | 'long';
  preferredComplexity: 'simple' | 'moderate' | 'complex';
  readingGoals: string[];
  dislikedGenres: string[];
  dislikedAuthors: string[];
}

export interface GoodreadsBook {
  title: string;
  author: string;
  rating: number;
  dateRead: string;
  review?: string;
  isbn?: string;
}

// Helper function to validate image URLs
const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch (error) {
    console.warn(`Failed to validate image URL ${url}:`, error);
    return false;
  }
};

// Helper function to get the best available image URL from Google Books
const getBestImageUrl = (imageLinks: any): string | null => {
  if (!imageLinks) return null;
  
  // Try different image sizes in order of preference
  return imageLinks.thumbnail || 
         imageLinks.smallThumbnail || 
         imageLinks.medium || 
         imageLinks.large || 
         imageLinks.small ||
         null;
};

// Comprehensive book cover service
const BookCoverService = {
  // Try OpenLibrary API first (most reliable)
  async getOpenLibraryCover(title: string, author: string): Promise<string | null> {
    try {
      // Try by title first
      const titleUrl = `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-M.jpg`;
      const titleResult = await ImageProxyService.validateImageWithProxy(titleUrl);
      if (titleResult.isValid) return titleResult.finalUrl;
      
      // Try by author if title fails
      const authorUrl = `https://covers.openlibrary.org/b/author/${encodeURIComponent(author)}-M.jpg`;
      const authorResult = await ImageProxyService.validateImageWithProxy(authorUrl);
      if (authorResult.isValid) return authorResult.finalUrl;
      
      return null;
    } catch (error) {
      console.warn('OpenLibrary cover fetch failed:', error);
      return null;
    }
  },

  // Try Internet Archive covers
  async getInternetArchiveCover(title: string, author: string): Promise<string | null> {
    try {
      const url = `https://archive.org/services/img/${encodeURIComponent(title + ' ' + author)}`;
      const result = await ImageProxyService.validateImageWithProxy(url);
      return result.isValid ? result.finalUrl : null;
    } catch (error) {
      console.warn('Internet Archive cover fetch failed:', error);
      return null;
    }
  },

  // Try WorldCat covers
  async getWorldCatCover(title: string): Promise<string | null> {
    try {
      const url = `https://www.worldcat.org/title/${encodeURIComponent(title)}/oclc/cover`;
      const result = await ImageProxyService.validateImageWithProxy(url);
      return result.isValid ? result.finalUrl : null;
    } catch (error) {
      console.warn('WorldCat cover fetch failed:', error);
      return null;
    }
  },

  // Try Goodreads-style covers (if available)
  async getGoodreadsCover(title: string): Promise<string | null> {
    try {
      const url = `https://images.gr-assets.com/books/${encodeURIComponent(title)}.jpg`;
      const result = await ImageProxyService.validateImageWithProxy(url);
      return result.isValid ? result.finalUrl : null;
    } catch (error) {
      console.warn('Goodreads cover fetch failed:', error);
      return null;
    }
  },

  // Main function to get the best available cover
  async getBestCover(title: string, author: string): Promise<string> {
    console.log(`Searching for cover: "${title}" by ${author}`);
    
    // Try sources in order of reliability
    const sources = [
      () => this.getOpenLibraryCover(title, author),
      () => this.getInternetArchiveCover(title, author),
      () => this.getWorldCatCover(title),
      () => this.getGoodreadsCover(title)
    ];

    for (const source of sources) {
      try {
        const coverUrl = await source();
        if (coverUrl) {
          console.log(`Found cover for "${title}" from: ${coverUrl}`);
          return coverUrl;
        }
      } catch (error) {
        console.warn(`Cover source failed for "${title}":`, error);
      }
    }

    console.log(`No cover found for "${title}", using placeholder`);
    return "/placeholder.svg";
  }
};

// Enhanced function to get book covers from multiple sources
const getBookCoverFromMultipleSources = async (title: string, author: string): Promise<string> => {
  return await BookCoverService.getBestCover(title, author);
};

// Helper function to process and validate Google Books image URLs
const processGoogleBooksImageUrl = (originalUrl: string): string => {
  if (!originalUrl) return '';
  
  return originalUrl
    .replace('http:', 'https:') // Ensure HTTPS
    .replace('&zoom=1', '&zoom=5') // Higher quality
    .replace('&edge=curl', '') // Remove edge curl effect
    .replace('&source=gbs_api', '') // Remove API source parameter
    .replace('&printsec=frontcover', '') // Remove printsec parameter
    .replace('&img=1', '') // Remove img parameter
    .replace('&dq=', '') // Remove dq parameter
    .replace(/&[^&]*=undefined/g, '') // Remove undefined parameters
    .replace(/&[^&]*=null/g, '') // Remove null parameters
    .replace(/&[^&]*=$/g, '') // Remove empty parameters
    .replace(/&&/g, '&') // Remove double ampersands
    .replace(/&$/, ''); // Remove trailing ampersand
};

// CORS proxy service for handling image loading issues
const ImageProxyService = {
  // List of CORS proxy services
  proxies: [
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://thingproxy.freeboard.io/fetch/'
  ],

  // Try to load image through different proxies
  async getProxiedImageUrl(originalUrl: string): Promise<string | null> {
    for (const proxy of this.proxies) {
      try {
        const proxiedUrl = proxy + encodeURIComponent(originalUrl);
        const isValid = await validateImageUrl(proxiedUrl);
        if (isValid) {
          console.log(`Successfully proxied image through: ${proxy}`);
          return proxiedUrl;
        }
      } catch (error) {
        console.warn(`Proxy ${proxy} failed for ${originalUrl}:`, error);
      }
    }
    return null;
  },

  // Enhanced image validation with proxy fallback
  async validateImageWithProxy(url: string): Promise<{ isValid: boolean; finalUrl: string }> {
    // First try the original URL
    try {
      const isValid = await validateImageUrl(url);
      if (isValid) {
        return { isValid: true, finalUrl: url };
      }
    } catch (error) {
      console.warn(`Original URL failed: ${url}`, error);
    }

    // If original fails, try proxy
    const proxiedUrl = await this.getProxiedImageUrl(url);
    if (proxiedUrl) {
      return { isValid: true, finalUrl: proxiedUrl };
    }

    return { isValid: false, finalUrl: url };
  }
};

// Parse Goodreads CSV data
export const parseGoodreadsCSV = (csvText: string): GoodreadsBook[] => {
  const lines = csvText.split('\n');
  const books: GoodreadsBook[] = [];
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Split by comma, but handle quoted fields
    const fields = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    
    if (fields.length >= 3) {
      const title = fields[0]?.replace(/"/g, '') || '';
      const author = fields[1]?.replace(/"/g, '') || '';
      const rating = parseFloat(fields[2]?.replace(/"/g, '') || '0');
      const dateRead = fields[3]?.replace(/"/g, '') || '';
      const review = fields[4]?.replace(/"/g, '') || '';
      const isbn = fields[5]?.replace(/"/g, '') || '';
      
      books.push({
        title,
        author,
        rating,
        dateRead,
        review,
        isbn
      });
    }
  }
  
  return books;
};

// Analyze user preferences from Goodreads data
export const analyzeUserPreferences = (goodreadsBooks: GoodreadsBook[]): UserPreferences => {
  const genreCounts: { [key: string]: number } = {};
  const authorCounts: { [key: string]: number } = {};
  const readingHistory: string[] = [];
  const ratings: number[] = [];
  
  goodreadsBooks.forEach(book => {
    readingHistory.push(`${book.title} by ${book.author}`);
    ratings.push(book.rating);
    
    // Count authors
    authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
  });
  
  // Get top genres and authors
  const favoriteAuthors = Object.entries(authorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([author]) => author);
  
  const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  
  return {
    favoriteGenres: [], // Would need genre classification service
    favoriteAuthors,
    readingHistory,
    preferredLength: 'medium', // Would need page count analysis
    preferredComplexity: 'moderate', // Would need text analysis
    readingGoals: [],
    dislikedGenres: [],
    dislikedAuthors: []
  };
};

// Enhanced GPT API function for preference-based recommendations
export const getPersonalizedRecommendations = async (
  userInput: string, 
  userPreferences?: UserPreferences,
  goodreadsBooks?: GoodreadsBook[]
): Promise<BookRecommendation[]> => {
  try {
    let contextPrompt = '';
    
    if (userPreferences && goodreadsBooks) {
      const topAuthors = userPreferences.favoriteAuthors.slice(0, 5).join(', ');
      const recentBooks = userPreferences.readingHistory.slice(0, 10).join(', ');
      const averageRating = goodreadsBooks.reduce((sum, book) => sum + book.rating, 0) / goodreadsBooks.length;
      
      contextPrompt = `
User Profile:
- Favorite Authors: ${topAuthors}
- Recent Books Read: ${recentBooks}
- Average Rating: ${averageRating.toFixed(1)}/5
- Total Books Read: ${goodreadsBooks.length}

User Query: "${userInput}"

IMPORTANT: When recommending books, prioritize books that are:
1. Highly rated on Goodreads (4.0+ average rating with 1000+ ratings)
2. Popular and well-known in their genre
3. From established, respected authors
4. Available in most bookstores and libraries
5. Have received positive critical acclaim

AVOID recommending:
- Obscure, self-published books with few ratings
- Books with average ratings below 3.5 on Goodreads
- Extremely niche or experimental works unless specifically requested
- Books that are out of print or hard to find

Based on this user's reading history and preferences, suggest 6 books that would be perfect for them. Consider:
1. Their favorite authors and similar well-established authors
2. Books rated highly by users with similar tastes (4.0+ on Goodreads)
3. The specific request in their query
4. Avoiding books they've already read
5. Prioritizing books that are widely available and well-reviewed

For each book, provide:
1. Exact title
2. Author name
3. Detailed reason why this book matches their preferences
4. Primary genre
5. Confidence score (0-100) based on how well it matches their profile
6. Match score (0-100) for the specific query

Format as JSON array:
[
  {
    "title": "Exact Book Title",
    "author": "Author Name", 
    "reason": "Detailed explanation of why this book matches their preferences",
    "genre": "Primary genre",
    "confidence": 85,
    "matchScore": 92
  }
]`;
    } else {
      contextPrompt = `
User Query: "${userInput}"

IMPORTANT: When recommending books, prioritize books that are:
1. Highly rated on Goodreads (4.0+ average rating with 1000+ ratings)
2. Popular and well-known in their genre
3. From established, respected authors
4. Available in most bookstores and libraries
5. Have received positive critical acclaim

AVOID recommending:
- Obscure, self-published books with few ratings
- Books with average ratings below 3.5 on Goodreads
- Extremely niche or experimental works unless specifically requested
- Books that are out of print or hard to find

Suggest 6 excellent books based on this request. Consider:
1. Popular and well-reviewed books (4.0+ Goodreads rating)
2. Books that match the query intent
3. Diverse recommendations across genres
4. Books that are widely available and accessible

For each book, provide:
1. Exact title
2. Author name
3. Reason why this book matches their request
4. Primary genre
5. Confidence score (0-100)
6. Match score (0-100) for the query

Format as JSON array:
[
  {
    "title": "Exact Book Title",
    "author": "Author Name", 
    "reason": "Why this book matches their request",
    "genre": "Primary genre",
    "confidence": 75,
    "matchScore": 88
  }
]`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert book recommendation assistant with deep knowledge of literature across all genres. You prioritize well-rated, popular, and accessible books. Always recommend books with 4.0+ Goodreads ratings and 1000+ reviews when possible. Always respond with valid JSON arrays containing personalized book recommendations."
        },
        {
          role: "user",
          content: contextPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from GPT API');
    }

    // Parse the JSON response
    const recommendations: BookRecommendation[] = JSON.parse(response);
    return recommendations.slice(0, 6); // Ensure we get max 6 recommendations
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    return [];
  }
};

// Enhanced Google Books API search with better image handling
export const searchGoogleBooks = async (query: string): Promise<EnhancedBookData[]> => {
  try {
    // Use API key if available, otherwise use public endpoint
    const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
    const url = apiKey 
      ? `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=6&orderBy=relevance&key=${apiKey}`
      : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=6&orderBy=relevance`;
    
    console.log('Google Books API URL:', url);
    console.log('API Key available:', !!apiKey);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Google Books API error:', response.status, response.statusText);
      throw new Error(`Google Books API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Google Books API response:', data);
    
    if (data.items) {
      const enhancedBooks: EnhancedBookData[] = [];
      
      for (const item of data.items) {
        const title = item.volumeInfo.title || "Unknown Title";
        const author = item.volumeInfo.authors?.[0] || "Unknown Author";
        const goodreadsUrl = `https://www.goodreads.com/search?q=${encodeURIComponent(`${title} ${author}`)}`;
        
        // Enhanced image URL handling with comprehensive fallback strategy
        let coverUrl = "/placeholder.svg";
        
        if (item.volumeInfo.imageLinks) {
          const imageLinks = item.volumeInfo.imageLinks;
          
          // Get the best available image URL
          const imageUrl = getBestImageUrl(imageLinks);
          
          if (imageUrl) {
            // Process the URL to ensure it's HTTPS and optimize quality
            const processedUrl = processGoogleBooksImageUrl(imageUrl);
            
            // Log the original and processed URLs for debugging
            console.log(`Processing image URL for "${title}":`);
            console.log(`  Original: ${imageUrl}`);
            console.log(`  Processed: ${processedUrl}`);
            
            // Validate the processed URL with proxy fallback
            const validationResult = await ImageProxyService.validateImageWithProxy(processedUrl);
            if (validationResult.isValid) {
              coverUrl = validationResult.finalUrl;
              console.log(`Using Google Books cover for "${title}":`, coverUrl);
            } else {
              console.log(`Google Books cover invalid for "${title}", trying fallback sources`);
            }
          }
        }
        
        // If Google Books image failed or doesn't exist, try multiple fallback sources
        if (coverUrl === "/placeholder.svg" && title !== "Unknown Title") {
          coverUrl = await getBookCoverFromMultipleSources(title, author);
        }
        
        enhancedBooks.push({
          title,
          author,
          cover: coverUrl,
          genres: item.volumeInfo.categories?.slice(0, 2),
          rating: item.volumeInfo.averageRating,
          description: item.volumeInfo.description,
          publishedDate: item.volumeInfo.publishedDate,
          pageCount: item.volumeInfo.pageCount,
          publisher: item.volumeInfo.publisher,
          goodreadsUrl
        });
      }
      
      return enhancedBooks;
    }
    return [];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

// Book rating service to validate recommendations
const BookRatingService = {
  // Try to get Goodreads-style ratings (if available)
  async getGoodreadsRating(title: string, author: string): Promise<{ rating: number; reviewCount: number } | null> {
    try {
      // This would require a Goodreads API or web scraping
      // For now, return null as Goodreads API is deprecated
      return null;
    } catch (error) {
      console.warn('Goodreads rating fetch failed:', error);
      return null;
    }
  },

  // Try to get ratings from Google Books
  async getGoogleBooksRating(title: string, author: string): Promise<{ rating: number; reviewCount: number } | null> {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
      const url = apiKey 
        ? `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(`${title} ${author}`)}&maxResults=1&key=${apiKey}`
        : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(`${title} ${author}`)}&maxResults=1`;
      
      const response = await fetch(url);
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data.items && data.items[0]?.volumeInfo) {
        const book = data.items[0].volumeInfo;
        return {
          rating: book.averageRating || 0,
          reviewCount: book.ratingsCount || 0
        };
      }
      return null;
    } catch (error) {
      console.warn('Google Books rating fetch failed:', error);
      return null;
    }
  },

  // Main function to get the best available rating
  async getBestRating(title: string, author: string): Promise<{ rating: number; reviewCount: number } | null> {
    const sources = [
      () => this.getGoogleBooksRating(title, author),
      () => this.getGoodreadsRating(title, author)
    ];

    for (const source of sources) {
      try {
        const rating = await source();
        if (rating && rating.rating > 0) {
          return rating;
        }
      } catch (error) {
        console.warn(`Rating source failed for "${title}":`, error);
      }
    }

    return null;
  }
};

// Function to enhance book data with external ratings
const enhanceBookWithRatings = async (book: EnhancedBookData): Promise<EnhancedBookData> => {
  // If we already have a rating, don't overwrite it
  if (book.rating && book.rating > 0) {
    return book;
  }

  try {
    const externalRating = await BookRatingService.getBestRating(book.title, book.author);
    if (externalRating) {
      return {
        ...book,
        rating: externalRating.rating,
        // Add review count if available
        ...(externalRating.reviewCount > 0 && { reviewCount: externalRating.reviewCount })
      };
    }
  } catch (error) {
    console.warn(`Failed to enhance book "${book.title}" with ratings:`, error);
  }

  return book;
};

// Main function that combines personalized recommendations with Google Books data
export const getBookRecommendations = async (
  userInput: string,
  userPreferences?: UserPreferences,
  goodreadsBooks?: GoodreadsBook[]
): Promise<EnhancedBookData[]> => {
  try {
    // Get personalized recommendations from GPT
    const gptRecommendations = await getPersonalizedRecommendations(userInput, userPreferences, goodreadsBooks);
    
    if (gptRecommendations.length === 0) {
      // Fallback to direct Google Books search
      const fallbackBooks = await searchGoogleBooks(userInput);
      // Enhance with ratings
      const enhancedFallbackBooks = await Promise.all(
        fallbackBooks.map(book => enhanceBookWithRatings(book))
      );
      return enhancedFallbackBooks;
    }

    // For each GPT recommendation, search Google Books for additional details
    const enhancedBooks: EnhancedBookData[] = [];
    
    for (const recommendation of gptRecommendations) {
      const searchQuery = `${recommendation.title} ${recommendation.author}`;
      const googleBooks = await searchGoogleBooks(searchQuery);
      
      if (googleBooks.length > 0) {
        const book = googleBooks[0];
        // Enhance with ratings and better covers
        const enhancedBook = await enhanceBookWithRatings({
          ...book,
          reason: recommendation.reason,
          confidence: recommendation.confidence,
          matchScore: recommendation.matchScore
        });
        enhancedBooks.push(enhancedBook);
      } else {
        // If Google Books doesn't find it, create a basic entry with fallback cover
        const fallbackCover = await getBookCoverFromMultipleSources(recommendation.title, recommendation.author);
        const basicBook: EnhancedBookData = {
          title: recommendation.title,
          author: recommendation.author,
          cover: fallbackCover,
          genres: [recommendation.genre],
          reason: recommendation.reason,
          confidence: recommendation.confidence,
          matchScore: recommendation.matchScore,
          goodreadsUrl: `https://www.goodreads.com/search?q=${encodeURIComponent(`${recommendation.title} ${recommendation.author}`)}`
        };
        
        // Try to enhance with ratings
        const enhancedBasicBook = await enhanceBookWithRatings(basicBook);
        enhancedBooks.push(enhancedBasicBook);
      }
    }

    return enhancedBooks;
  } catch (error) {
    console.error('Error getting book recommendations:', error);
    // Fallback to basic Google Books search
    const fallbackBooks = await searchGoogleBooks(userInput);
    // Enhance with ratings
    const enhancedFallbackBooks = await Promise.all(
      fallbackBooks.map(book => enhanceBookWithRatings(book))
    );
    return enhancedFallbackBooks;
  }
};
