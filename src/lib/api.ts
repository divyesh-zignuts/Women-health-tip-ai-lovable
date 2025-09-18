export const API_BASE_URL = 'https://ovasave.zignuts.dev/api'

export interface HealthProfile {
  userDetails?: {
    userId: string;
    name: string;
    dateOfBirth: string;
  };
  age?: number;
  bodyMetrics?: {
    weightKg?: number;
    heightCm?: number;
  };
  symptoms: Array<{
    symptomName: string;
    severityLevel: number;
    dateTime: string;
  }>;
  menstrualCycle?: {
    regularity?: 'regular' | 'irregular' | 'unknown';
    daysUntilNextCycle?: number;
    fertileWindowStartDate?: string;
    fertileWindowEndDate?: string;
    ovulationDate?: string;
    cycleLengthDays?: number;
    periodLengthDays?: number;
  };
  labTestResults?: Array<{
    orderId: string;
    testName: string;
    value: number;
    status: string;
    testDate: string;
  }>;
  previousOrders?: Array<{
    orderId: string;
    items: Array<{
      name: string;
      quantity: number;
    }>;
    orderDateTime: string;
  }>;
  currentFocus?: string;
  conditions: string[];
  currentUsage: string[];
  userPriority?: string;
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
  HealthTips: {
    summary: string;
    tips: string;
  };
}

export interface ProductSuggestionsResponse {
  ProductRecommendation: Array<{
    name: string;
    category: string;
    description: string;
    recommendationNote?: string;
  }>;
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

export async function getHealthTips(profile: HealthProfile): Promise<ApiResponse<HealthTipsResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/tips/health-tips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.data };
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
    const response = await fetch(`${API_BASE_URL}/tips/product-recommendation`, {
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
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error fetching product suggestions:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

export const mockHealthTips: HealthTipsResponse = {
  HealthTips: {
    summary: "<p>Dial in your fertile window with a simple plan for next cycle—clear signs, smart timing, and stress‑light routines.</p>",
    tips: "<p><strong>Your fertile-window game plan (irregular cycles + PCOS-aware):</strong></p><ul><li><strong>Widen the window:</strong> If your app shows only a one‑day fertile window, treat the few days before and just after the predicted day as potentially fertile.</li></ul>"
  }
};

export const mockProductSuggestions: ProductSuggestionsResponse = {
  ProductRecommendation: [
    {
      name: "Women's Daily Multivitamin",
      category: "Supplement",
      description: "Complete multivitamin with iron, folate, and B vitamins for reproductive health support"
    },
    {
      name: "AMH Test Kit",
      category: "Test", 
      description: "At-home Anti-Müllerian Hormone test to assess ovarian reserve"
    }
  ]
};