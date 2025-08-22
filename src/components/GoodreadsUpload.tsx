import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  BookOpen, 
  Star,
  Calendar,
  Loader2,
  X
} from "lucide-react";
import { parseGoodreadsCSV, analyzeUserPreferences, GoodreadsBook, UserPreferences } from "@/lib/api";

interface GoodreadsUploadProps {
  onPreferencesAnalyzed: (preferences: UserPreferences, books: GoodreadsBook[]) => void;
  onClose: () => void;
}

export const GoodreadsUpload = ({ onPreferencesAnalyzed, onClose }: GoodreadsUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedBooks, setUploadedBooks] = useState<GoodreadsBook[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Read the file
      const text = await file.text();
      
      // Parse the CSV
      const books = parseGoodreadsCSV(text);
      
      if (books.length === 0) {
        throw new Error('No valid books found in the CSV file. Please check the format.');
      }

      // Analyze user preferences
      const preferences = analyzeUserPreferences(books);
      
      setUploadedBooks(books);
      setUserPreferences(preferences);
      setUploadProgress(100);
      
      // Pass data to parent component
      onPreferencesAnalyzed(preferences, books);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.csv')) {
        // Create a synthetic event
        const syntheticEvent = {
          target: { files: [file] }
        } as React.ChangeEvent<HTMLInputElement>;
        handleFileUpload(syntheticEvent);
      } else {
        setError('Please upload a CSV file');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const getAverageRating = () => {
    if (uploadedBooks.length === 0) return 0;
    const total = uploadedBooks.reduce((sum, book) => sum + book.rating, 0);
    return (total / uploadedBooks.length).toFixed(1);
  };

  const getTopAuthors = () => {
    const authorCounts: { [key: string]: number } = {};
    uploadedBooks.forEach(book => {
      authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
    });
    
    return Object.entries(authorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([author]) => author);
  };

  return (
    <Card className="bg-gradient-card shadow-glow border-border/50 backdrop-blur-sm animate-scale-in max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-r from-primary/10 to-amber-warm/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            Import Goodreads Library
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-background/50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!userPreferences ? (
          <>
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                isUploading 
                  ? 'border-primary/50 bg-primary/5' 
                  : 'border-border/50 hover:border-primary/50 hover:bg-background/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              
              {isUploading ? (
                <div className="space-y-4">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Processing your library...</p>
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-xs text-muted-foreground">
                      {uploadProgress < 50 ? 'Reading file...' : 
                       uploadProgress < 90 ? 'Analyzing preferences...' : 
                       'Finalizing...'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-gradient-to-r from-primary/10 to-amber-warm/10 rounded-full w-fit mx-auto">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium mb-2">Upload your Goodreads CSV</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Export your Goodreads library as CSV and upload it here to get personalized recommendations
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-hero hover:shadow-glow transition-all duration-300"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Choose CSV File
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium mb-2">How to export from Goodreads:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Go to your Goodreads profile</li>
                <li>Click on "My Books"</li>
                <li>Go to "Import/Export" in the left sidebar</li>
                <li>Click "Export Library" to download your CSV</li>
                <li>Upload the CSV file here</li>
              </ol>
            </div>
          </>
        ) : (
          /* Analysis Results */
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-green-700">Library imported successfully!</p>
                <p className="text-sm text-green-600">
                  {uploadedBooks.length} books analyzed for personalized recommendations
                </p>
              </div>
            </div>

            {/* Library Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-primary">{uploadedBooks.length}</div>
                <div className="text-xs text-muted-foreground">Books Read</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-primary">{getAverageRating()}</div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-primary">
                  {new Set(uploadedBooks.map(b => b.author)).size}
                </div>
                <div className="text-xs text-muted-foreground">Authors</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-primary">
                  {new Date().getFullYear() - new Date(uploadedBooks[0]?.dateRead || Date.now()).getFullYear()}
                </div>
                <div className="text-xs text-muted-foreground">Years</div>
              </div>
            </div>

            {/* Top Authors */}
            <div>
              <h4 className="font-medium mb-3">Your Favorite Authors</h4>
              <div className="flex flex-wrap gap-2">
                {getTopAuthors().map((author, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                    {author}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Recent Books */}
            <div>
              <h4 className="font-medium mb-3">Recent Reads</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadedBooks.slice(0, 5).map((book, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-card/30 rounded border border-border/30">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{book.title}</p>
                      <p className="text-xs text-muted-foreground truncate">by {book.author}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{book.rating}</span>
                      </div>
                      {book.dateRead && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(book.dateRead).getFullYear()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={onClose}
              className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300"
            >
              Start Getting Recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
