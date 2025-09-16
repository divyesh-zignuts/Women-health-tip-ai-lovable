import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HealthTipsResponse, ProductSuggestionsResponse, Product } from '@/lib/api';
import { Heart, Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HealthResultsProps {
  type: 'tips' | 'products';
  data: HealthTipsResponse | ProductSuggestionsResponse;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <Card className="health-card">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
        {product.price && (
          <Badge variant="outline" className="text-primary font-semibold">
            ${product.price}
          </Badge>
        )}
      </div>
      <p className="text-muted-foreground text-sm mb-3">{product.description}</p>
      {product.rating && (
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating}</span>
        </div>
      )}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Benefits:</p>
        <div className="flex flex-wrap gap-1">
          {product.benefits.map((benefit, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {benefit}
            </Badge>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const HealthResults: React.FC<HealthResultsProps> = ({ type, data }) => {
  const navigate = useNavigate();

  if (type === 'tips') {
    const tipsData = data as HealthTipsResponse;
    
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <Heart size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Your Personalized Health Tips</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Based on your health profile, here are personalized recommendations to support your wellness journey.
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="health-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Health Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tipsData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="health-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-secondary">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tipsData.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="health-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-accent-foreground">Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tipsData.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-accent-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const productsData = data as ProductSuggestionsResponse;
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Your Personalized Product Recommendations</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Based on your health profile, here are evidence-based product recommendations tailored to your needs.
        </p>
      </div>

      {productsData.supplements.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary">Recommended Supplements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsData.supplements.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {productsData.testKits.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-secondary">Test Kits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsData.testKits.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {productsData.products.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-accent-foreground">Other Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsData.products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};