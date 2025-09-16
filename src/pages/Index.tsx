import React from 'react';
import { AgentCard } from '@/components/AgentCard';
import { Heart, ShoppingBag } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen health-gradient-soft">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm">
              <Heart className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Women's Health AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get personalized health insights and recommendations from our specialized AI agents
          </p>
        </div>

        {/* Agent Cards */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-5xl mx-auto">
          <AgentCard
            icon={Heart}
            title="Health Tips Agent"
            description="Get personalized health tips and wellness advice based on your symptoms, cycle, and health data"
            features={[
              "Symptom analysis and insights",
              "Menstrual cycle guidance", 
              "Hormone balance tips",
              "Wellness recommendations"
            ]}
            buttonText="Get Health Tips"
            route="/health-tips"
            variant="primary"
          />

          <AgentCard
            icon={ShoppingBag}
            title="Product Suggestion Agent"
            description="Discover recommended products, supplements, and test kits tailored to your health profile"
            features={[
              "Personalized supplement recommendations",
              "Relevant test kit suggestions",
              "Product comparisons", 
              "Evidence-based selections"
            ]}
            buttonText="Explore Products"
            route="/product-suggestions"
            variant="secondary"
          />
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-secondary" />
              <span className="font-medium">Personalized Analysis</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="font-medium">Evidence-Based</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-accent-foreground" />
              <span className="font-medium">Privacy Focused</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
