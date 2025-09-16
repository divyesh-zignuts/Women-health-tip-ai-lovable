// API configuration and utilities
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api' 
  : 'http://localhost:3000/api';

// Health data types
export interface HealthProfile {
  age?: number;
  weight?: number;
  height?: number;
  symptoms: string[];
  cycleRegularity?: 'regular' | 'irregular' | 'unknown';
  daysUntilNextCycle?: number;
  averageCycleLength?: number;
  averagePeriodLength?: number;
  healthFocus?: string;
  primaryPriority?: string;
  healthConditions: string[];
  medications: string[];
}

export interface HealthTipsRequest extends HealthProfile {
  type: 'health-tips';
}

export interface ProductSuggestionsRequest extends HealthProfile {
  type: 'product-suggestions';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface HealthTipsResponse {
  tips: string[];
  recommendations: string[];
  insights: string[];
}

export interface ProductSuggestionsResponse {
  supplements: Product[];
  testKits: Product[];
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price?: number;
  imageUrl?: string;
  rating?: number;
  benefits: string[];
}

// API functions
export async function getHealthTips(profile: HealthProfile): Promise<ApiResponse<HealthTipsResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/health-tips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...profile, type: 'health-tips' }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching health tips:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

export async function getProductSuggestions(profile: HealthProfile): Promise<ApiResponse<ProductSuggestionsResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/product-suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...profile, type: 'product-suggestions' }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching product suggestions:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Mock data for development
export const mockHealthTips: HealthTipsResponse = {
  tips: [
    "Track your menstrual cycle to better understand your body's patterns",
    "Incorporate omega-3 rich foods like salmon and walnuts into your diet",
    "Practice stress-reduction techniques like meditation or yoga",
    "Ensure adequate sleep (7-9 hours) for optimal hormonal balance"
  ],
  recommendations: [
    "Consider taking a high-quality multivitamin designed for women",
    "Schedule regular check-ups with your healthcare provider",
    "Stay hydrated with at least 8 glasses of water daily"
  ],
  insights: [
    "Your symptoms may be related to hormonal fluctuations",
    "Your health focus suggests you may benefit from fertility support",
    "Consider tracking additional metrics for better health insights"
  ]
};

export const mockProductSuggestions: ProductSuggestionsResponse = {
  supplements: [
    {
      id: "1",
      name: "Women's Daily Multivitamin",
      description: "Complete multivitamin with iron, folate, and B vitamins",
      category: "Multivitamin",
      price: 29.99,
      rating: 4.5,
      benefits: ["Supports energy", "Immune health", "Reproductive health"]
    },
    {
      id: "2", 
      name: "Omega-3 Fish Oil",
      description: "High-quality EPA/DHA for heart and brain health",
      category: "Omega-3",
      price: 24.99,
      rating: 4.7,
      benefits: ["Heart health", "Brain function", "Anti-inflammatory"]
    }
  ],
  testKits: [
    {
      id: "3",
      name: "Hormone Balance Test",
      description: "At-home hormone testing kit",
      category: "Test Kit",
      price: 159.99,
      rating: 4.3,
      benefits: ["Hormone insights", "Convenient", "Professional analysis"]
    }
  ],
  products: [
    {
      id: "4",
      name: "Cycle Tracking Journal",
      description: "Beautiful journal for tracking menstrual cycles",
      category: "Tracking",
      price: 19.99,
      rating: 4.6,
      benefits: ["Cycle awareness", "Symptom tracking", "Beautiful design"]
    }
  ]
};