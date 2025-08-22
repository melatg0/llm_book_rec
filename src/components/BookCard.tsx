import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Building, Book, ExternalLink, Star, TrendingUp, Target } from "lucide-react";

interface BookCardProps {
  title: string;
  author: string;
  cover: string;
  genres?: string[];
  rating?: number;
  description?: string;
  goodreadsUrl?: string;
  publishedDate?: string;
  pageCount?: number;
  publisher?: string;
  reason?: string;
  confidence?: number;
  matchScore?: number;
}

export const BookCard = ({ 
  title, 
  author, 
  cover, 
  genres, 
  rating, 
  description, 
  goodreadsUrl,
  publishedDate,
  pageCount,
  publisher,
  reason,
  confidence,
  matchScore
}: BookCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    console.log(`Image failed to load for "${title}":`, cover);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log(`Image loaded successfully for "${title}":`, cover);
    setImageLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/20";
    if (score >= 80) return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20";
    if (score >= 70) return "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20";
    return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-950/20";
  };

  const getScoreBorder = (score: number) => {
    if (score >= 90) return "border-green-200 dark:border-green-800";
    if (score >= 80) return "border-blue-200 dark:border-blue-800";
    if (score >= 70) return "border-amber-200 dark:border-amber-800";
    return "border-gray-200 dark:border-gray-800";
  };

  return (
    <a 
      href={goodreadsUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden bg-gradient-card hover:shadow-book transition-all duration-300 hover:-translate-y-1 h-full card-hover border-border/50">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Cover Image Section */}
          <div className="aspect-[3/4] overflow-hidden bg-muted relative">
            {!imageError && cover !== "/placeholder.svg" ? (
              <>
                {imageLoading && (
                  <div className="absolute inset-0 bg-muted animate-skeleton rounded-lg"></div>
                )}
                <img 
                  src={cover} 
                  alt={`${title} by ${author}`}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  } group-hover:scale-105`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                  <ExternalLink className="w-8 h-8 text-white transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                <div className="text-center p-4 animate-fade-in">
                  <Book className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground font-medium">{title}</p>
                  <p className="text-xs text-muted-foreground">{author}</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Title and Author */}
            <div className="mb-3">
              <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm">{author}</p>
            </div>
            
            {/* Rating */}
            {rating && (
              <div className="flex items-center gap-1 mb-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-xs text-muted-foreground">/ 5</span>
              </div>
            )}

            {/* Confidence and Match Scores */}
            {(confidence !== undefined || matchScore !== undefined) && (
              <div className="flex gap-2 mb-3 animate-fade-in" style={{ animationDelay: '120ms' }}>
                {confidence !== undefined && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getScoreColor(confidence)} ${getScoreBorder(confidence)}`}>
                    <TrendingUp className="w-3 h-3" />
                    <span>{confidence}% match</span>
                  </div>
                )}
                {matchScore !== undefined && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getScoreColor(matchScore)} ${getScoreBorder(matchScore)}`}>
                    <Target className="w-3 h-3" />
                    <span>{matchScore}% fit</span>
                  </div>
                )}
              </div>
            )}

            {/* Reason why this book was recommended */}
            {reason && (
              <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50 animate-fade-in" style={{ animationDelay: '150ms' }}>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">Why this book:</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 line-clamp-2 leading-relaxed">{reason}</p>
              </div>
            )}

            {/* Genres */}
            {genres && (
              <div className="flex flex-wrap gap-1 mb-3 animate-fade-in" style={{ animationDelay: '250ms' }}>
                {genres.slice(0, 2).map((genre, index) => (
                  <Badge 
                    key={genre} 
                    variant="secondary" 
                    className="text-xs hover:bg-secondary/80 transition-colors duration-200"
                    style={{ animationDelay: `${300 + index * 50}ms` }}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {/* Book details */}
            <div className="space-y-1 mb-3 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '300ms' }}>
              {publishedDate && (
                <div className="flex items-center gap-1 hover:text-foreground transition-colors duration-200">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(publishedDate).getFullYear()}</span>
                </div>
              )}
              {pageCount && (
                <div className="flex items-center gap-1 hover:text-foreground transition-colors duration-200">
                  <BookOpen className="w-3 h-3" />
                  <span>{pageCount} pages</span>
                </div>
              )}
              {publisher && (
                <div className="flex items-center gap-1 hover:text-foreground transition-colors duration-200">
                  <Building className="w-3 h-3" />
                  <span className="line-clamp-1">{publisher}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-3 mt-auto leading-relaxed animate-fade-in" style={{ animationDelay: '350ms' }}>
                {description}
              </p>
            )}

            {/* View on Goodreads indicator */}
            <div className="mt-3 pt-3 border-t border-border/30 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center justify-between text-xs text-muted-foreground group-hover:text-primary transition-colors duration-300">
                <span>View on Goodreads</span>
                <ExternalLink className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
};