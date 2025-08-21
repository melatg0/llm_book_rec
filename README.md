# BookMood AI - Intelligent Book Recommendations

A modern web application that uses AI to recommend books based on your mood and preferences. Built with React, TypeScript, and enhanced with GPT API for intelligent recommendations and Google Books API for rich book data.

## Features

- 🤖 **AI-Powered Recommendations**: Uses GPT API to understand your mood and suggest perfect books
- 📚 **Rich Book Data**: Integrates with Google Books API for covers, summaries, and detailed information
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations and carousel display
- 💭 **Mood-Based Suggestions**: Pre-built prompts for different emotional states and reading preferences
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Shadcn/ui + Tailwind CSS
- **AI Integration**: OpenAI GPT API
- **Book Data**: Google Books API
- **State Management**: React Query
- **Animations**: Tailwind CSS + CSS animations

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd llm_book_rec
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Get your OpenAI API key**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add it to your `.env` file

5. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## How It Works

1. **User Input**: Users describe their mood or reading preferences
2. **AI Processing**: GPT API analyzes the input and generates personalized book recommendations
3. **Data Enhancement**: Google Books API provides covers, summaries, and additional book details
4. **Display**: Books are shown in a beautiful carousel with rich information

## API Integration

### OpenAI GPT API
- Processes user mood descriptions
- Generates personalized book recommendations
- Provides reasoning for each recommendation

### Google Books API
- Fetches book covers and images
- Provides book summaries and descriptions
- Includes publication details, ratings, and genres

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own book recommendation needs!
