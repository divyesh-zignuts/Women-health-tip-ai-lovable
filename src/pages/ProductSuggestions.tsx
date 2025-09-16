import React, { useState } from 'react';
import { HealthForm } from '@/components/HealthForm';
import { HealthResults } from '@/components/HealthResults';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HealthProfile, getProductSuggestions, mockProductSuggestions, ProductSuggestionsResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const ProductSuggestions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ProductSuggestionsResponse | null>(null);

  const handleSubmit = async (profile: HealthProfile) => {
    setIsLoading(true);
    
    try {
      // For development, use mock data. In production, use real API
      const response = await getProductSuggestions(profile);
      
      if (response.success && response.data) {
        setResults(response.data);
        toast({
          title: "Product Recommendations Ready!",
          description: "Your personalized product suggestions are ready.",
        });
      } else {
        // Fallback to mock data if API fails
        setResults(mockProductSuggestions);
        toast({
          title: "Using Demo Data",
          description: "Showing sample product suggestions. Connect your API for personalized results.",
          variant: "default",
        });
      }
    } catch (error) {
      // Fallback to mock data on error
      setResults(mockProductSuggestions);
      toast({
        title: "Using Demo Data",
        description: "Showing sample product suggestions. Connect your API for personalized results.", 
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (results) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <HealthResults type="products" data={results} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen health-gradient-soft">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
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

        {/* Information Card */}
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

        {/* Health Form */}
        <div className="max-w-4xl mx-auto">
          <HealthForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitButtonText="Get Product Recommendations"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductSuggestions;