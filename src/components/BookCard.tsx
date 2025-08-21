import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Building } from "lucide-react";

interface BookCardProps {
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

export const BookCard = ({ 
  title, 
  author, 
  cover, 
  genres, 
  rating, 
  description, 
  amazonUrl,
  publishedDate,
  pageCount,
  publisher,
  reason,
  mood
}: BookCardProps) => {
  return (
    <a 
      href={amazonUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block group"
    >
      <Card className="overflow-hidden bg-gradient-card hover:shadow-book transition-all duration-300 hover:-translate-y-1 h-full">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="aspect-[3/4] overflow-hidden">
            <img 
              src={cover} 
              alt={`${title} by ${author}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">{title}</h3>
            <p className="text-muted-foreground mb-3">{author}</p>
            
            {/* Reason why this book was recommended */}
            {reason && (
              <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Why this book:</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 line-clamp-2">{reason}</p>
              </div>
            )}

            {/* Mood indicator */}
            {mood && (
              <div className="mb-3">
                <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300">
                  {mood}
                </Badge>
              </div>
            )}

            {/* Genres */}
            {genres && (
              <div className="flex flex-wrap gap-1 mb-3">
                {genres.slice(0, 2).map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {/* Rating */}
            {rating && (
              <div className="flex items-center gap-1 mb-2">
                <span className="text-amber-500">★</span>
                <span className="text-sm font-medium">{rating}</span>
              </div>
            )}

            {/* Book details */}
            <div className="space-y-1 mb-3 text-xs text-muted-foreground">
              {publishedDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(publishedDate).getFullYear()}</span>
                </div>
              )}
              {pageCount && (
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{pageCount} pages</span>
                </div>
              )}
              {publisher && (
                <div className="flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  <span className="line-clamp-1">{publisher}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-3 mt-auto">{description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </a>
  );
};