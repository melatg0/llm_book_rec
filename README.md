# LLM Book Recommendations

A modern, AI-powered book recommendation system that provides personalized reading suggestions based on user preferences and reading history.

## Features

### 🎯 Smart Recommendations
- **AI-Powered Suggestions**: Uses GPT-3.5-turbo to generate personalized book recommendations
- **Quality-Focused**: Prioritizes well-rated books (4.0+ Goodreads rating with 1000+ reviews)
- **Popular & Accessible**: Recommends books that are widely available and well-reviewed
- **Avoids Niche Books**: Filters out obscure, self-published, or hard-to-find books

### 📚 Multiple Data Sources
- **Google Books API**: Primary source for book metadata and covers
- **OpenLibrary**: Reliable fallback for book covers
- **Internet Archive**: Additional cover source
- **WorldCat**: Library catalog integration
- **Multiple CORS Proxies**: Ensures reliable image loading

### 🖼️ Robust Cover Handling
- **Multi-Source Fallback**: Tries multiple APIs to find book covers
- **CORS Proxy Support**: Handles cross-origin image loading issues
- **Automatic Validation**: Validates image URLs before displaying
- **Graceful Degradation**: Falls back to placeholder when no cover is available

### 📊 Enhanced Book Data
- **Rating Integration**: Fetches ratings from multiple sources
- **Review Counts**: Shows how many people have rated each book
- **Detailed Metadata**: Includes publication date, page count, publisher
- **Goodreads Integration**: Direct links to view books on Goodreads

### 📈 User Preference Analysis
- **Goodreads Import**: Analyzes reading history from CSV exports
- **Genre Preferences**: Identifies favorite genres and authors
- **Rating Patterns**: Understands user's rating preferences
- **Reading Goals**: Considers user's reading objectives

## Recent Improvements

### Book Cover Reliability
- **Multiple API Sources**: Now tries OpenLibrary, Internet Archive, WorldCat, and Google Books
- **CORS Proxy Service**: Handles cross-origin image loading with multiple proxy options
- **Automatic Validation**: Validates each image URL before using it
- **Better Error Handling**: Graceful fallback to placeholder images

### Recommendation Quality
- **Rating Requirements**: Now prioritizes books with 4.0+ Goodreads ratings and 1000+ reviews
- **Popularity Focus**: Emphasizes well-known, established authors and books
- **Accessibility**: Ensures recommended books are widely available
- **Quality Filtering**: Avoids obscure, self-published, or out-of-print books

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd llm_book_rec
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Add your API keys:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_GOOGLE_BOOKS_API_KEY=your_google_books_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Usage

1. **Upload Goodreads Data**: Export your Goodreads library as CSV and upload it for personalized recommendations
2. **Ask for Recommendations**: Describe what you're looking for in a book
3. **Get Smart Suggestions**: Receive AI-powered recommendations with detailed explanations
4. **View Book Details**: See covers, ratings, descriptions, and Goodreads links

## API Sources

### Book Covers (in order of preference)
1. **Google Books API** - High quality, official covers
2. **OpenLibrary** - Reliable, community-maintained covers
3. **Internet Archive** - Historical and public domain covers
4. **WorldCat** - Library catalog covers
5. **CORS Proxies** - Fallback for cross-origin issues

### Book Ratings
1. **Google Books** - Official ratings and review counts
2. **Goodreads** - Community ratings (when available)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
