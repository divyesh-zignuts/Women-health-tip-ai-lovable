import React, { useState } from 'react';
import { HealthForm } from '@/components/HealthForm';
import { HealthResults } from '@/components/HealthResults';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HealthProfile, getProductSuggestions, mockProductSuggestions, ProductSuggestionsResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Copy, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ProductSuggestions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ProductSuggestionsResponse | null>(null);

const handleSubmit = async (profile: HealthProfile) => {
  setIsLoading(true);
  
  try {
    const response = await getProductSuggestions(profile);
    
    if (response.success && response.data && response.data.ProductRecommendation) {
      if (response.data.ProductRecommendation.length > 0) {
        setResults(response.data);
        toast({
          title: "Product Recommendations Ready!",
          description: "Your personalized product suggestions are ready.",
        });
      } else {
        toast({
          title: "Need More Information",
          description: "Please add more details about your health profile to get personalized product recommendations.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Need More Information",
        description: "Please add symptoms, conditions, or other health details to get personalized product recommendations.",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  // if (results) {
  //   return (
  //     <div className="min-h-screen bg-background">
  //       <div className="container mx-auto px-4 py-8">
  //         <HealthResults type="products" data={results} />
  //       </div>
  //     </div>
  //   );
  // }

  const copyToClipboard = (text: string, type: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  });
};

const copyAllContent = () => {
  const allContent = results?.ProductRecommendation.map(item => 
    `${item.name} (${item.category})\n${item.description}${item.recommendationNote ? `\nNote: ${item.recommendationNote}` : ''}`
  ).join('\n\n') || '';

  navigator.clipboard.writeText(allContent).then(() => {
    toast({
      title: "Copied!",
      description: "All product recommendations copied to clipboard",
    });
  });
};

  return (
    <div className="min-h-screen health-gradient-soft">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-secondary/10 text-secondary">
                <ShoppingBag size={32} />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Product Suggestion Agent
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover personalized products and test recommendations
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Tell Us About Your Health Profile
            </h2>
            <p className="text-muted-foreground">
              We'll analyze your information to recommend evidence-based products and tests tailored to your needs.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <HealthForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitButtonText="Get Product Recommendations"
          />
        </div>
        {results && (
        <Dialog open={!!results} onOpenChange={() => setResults(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">
                Your Personalized Product Recommendations
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAllContent}
                  className="h-8 w-8 p-0 ml-4"
                  title="Copy all content"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {results.ProductRecommendation.map((item, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  item.category === 'Test' ? 'bg-blue-50 border-blue-200' :
                  item.category === 'Supplement' ? 'bg-green-50 border-green-200' :
                  item.category === 'Service' ? 'bg-purple-50 border-purple-200' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.category === 'Test' ? 'bg-blue-100 text-blue-800' :
                          item.category === 'Supplement' ? 'bg-green-100 text-green-800' :
                          item.category === 'Service' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.category}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-2">{item.description}</p>
                      {item.recommendationNote && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                          <p className="text-yellow-800 text-sm font-medium">
                            💡 {item.recommendationNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Generating Product Recommendations
              </h3>
              <p className="text-sm text-gray-600">
                Please wait while we analyze your information...
              </p>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductSuggestions;