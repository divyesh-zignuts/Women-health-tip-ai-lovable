import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';
import { HealthProfile } from '@/lib/api';

interface HealthFormProps {
  onSubmit: (profile: HealthProfile) => void;
  isLoading?: boolean;
  submitButtonText: string;
}

const HEALTH_CONDITIONS = [
  'PCOS', 'Endometriosis', 'Thyroid issues', 'Early menopause', 
  'Diminished ovarian reserve', 'Infertility'
];

const MEDICATIONS = [
  'Prenatal supplements', 'Hormonal replacement therapy', 
  'Birth control', 'Fertility treatments'
];

const HEALTH_FOCUS_OPTIONS = [
  'Preparing for pregnancy',
  'Actively trying to conceive', 
  'Fertility preservation / egg freezing',
  'Balancing hormones and cycle length',
  'Managing PCOS',
  'Nutrition and weight loss',
  'Mental health and well being',
  'Perimenopause and menopause',
  'Just exploring the app'
];

const PRIORITY_OPTIONS = [
  'Understanding my fertility window',
  'Improving egg quality',
  'Managing PCOS', 
  'Nutrition and weight management',
  'Mental health and emotional balance',
  'Reducing symptoms',
  'Tracking hormones over time',
  'Accessing expert guidance'
];

export const HealthForm: React.FC<HealthFormProps> = ({ 
  onSubmit, 
  isLoading = false,
  submitButtonText 
}) => {
  const [profile, setProfile] = useState<HealthProfile>({
    symptoms: [],
    healthConditions: [],
    medications: []
  });
  const [newSymptom, setNewSymptom] = useState('');

  const handleAddSymptom = () => {
    if (newSymptom.trim() && !profile.symptoms.includes(newSymptom.trim())) {
      setProfile(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, newSymptom.trim()]
      }));
      setNewSymptom('');
    }
  };

  const handleRemoveSymptom = (symptom: string) => {
    setProfile(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter(s => s !== symptom)
    }));
  };

  const handleToggleCondition = (condition: string) => {
    setProfile(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter(c => c !== condition)
        : [...prev.healthConditions, condition]
    }));
  };

  const handleToggleMedication = (medication: string) => {
    setProfile(prev => ({
      ...prev,
      medications: prev.medications.includes(medication)
        ? prev.medications.filter(m => m !== medication)
        : [...prev.medications, medication]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card className="health-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={profile.age || ''}
                onChange={(e) => setProfile(prev => ({ 
                  ...prev, 
                  age: parseInt(e.target.value) || undefined 
                }))}
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Weight in kg"
                value={profile.weight || ''}
                onChange={(e) => setProfile(prev => ({ 
                  ...prev, 
                  weight: parseInt(e.target.value) || undefined 
                }))}
              />
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Height in cm"
                value={profile.height || ''}
                onChange={(e) => setProfile(prev => ({ 
                  ...prev, 
                  height: parseInt(e.target.value) || undefined 
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Symptoms */}
      <Card className="health-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">Current Symptoms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a symptom"
              value={newSymptom}
              onChange={(e) => setNewSymptom(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSymptom())}
            />
            <Button type="button" onClick={handleAddSymptom} variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.symptoms.length === 0 ? (
              <p className="text-muted-foreground">No symptoms added yet. Click "Add Symptom" to get started.</p>
            ) : (
              profile.symptoms.map((symptom) => (
                <Badge key={symptom} variant="secondary" className="flex items-center gap-1">
                  {symptom}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveSymptom(symptom)}
                  />
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Menstrual Cycle Information */}
      <Card className="health-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">Menstrual Cycle Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Cycle Regularity</Label>
            <Select value={profile.cycleRegularity || ''} onValueChange={(value) => 
              setProfile(prev => ({ ...prev, cycleRegularity: value as any }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select regularity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="irregular">Irregular</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="daysUntilNext">Days Until Next Cycle</Label>
              <Input
                id="daysUntilNext"
                type="number"
                placeholder="Days"
                value={profile.daysUntilNextCycle || ''}
                onChange={(e) => setProfile(prev => ({ 
                  ...prev, 
                  daysUntilNextCycle: parseInt(e.target.value) || undefined 
                }))}
              />
            </div>
            <div>
              <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
              <Input
                id="cycleLength"
                type="number"
                placeholder="Days"
                value={profile.averageCycleLength || ''}
                onChange={(e) => setProfile(prev => ({ 
                  ...prev, 
                  averageCycleLength: parseInt(e.target.value) || undefined 
                }))}
              />
            </div>
            <div>
              <Label htmlFor="periodLength">Average Period Length (days)</Label>
              <Input
                id="periodLength"
                type="number"
                placeholder="Days"
                value={profile.averagePeriodLength || ''}
                onChange={(e) => setProfile(prev => ({ 
                  ...prev, 
                  averagePeriodLength: parseInt(e.target.value) || undefined 
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Focus & Priorities */}
      <Card className="health-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">Health Focus & Priorities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Health Focus</Label>
            <Select value={profile.healthFocus || ''} onValueChange={(value) => 
              setProfile(prev => ({ ...prev, healthFocus: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="What are you focusing on?" />
              </SelectTrigger>
              <SelectContent>
                {HEALTH_FOCUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Primary Priority</Label>
            <Select value={profile.primaryPriority || ''} onValueChange={(value) => 
              setProfile(prev => ({ ...prev, primaryPriority: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="What's most important to you?" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Health Conditions */}
      <Card className="health-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">Health Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {HEALTH_CONDITIONS.map((condition) => (
              <Badge
                key={condition}
                variant={profile.healthConditions.includes(condition) ? "default" : "outline"}
                className="cursor-pointer transition-all"
                onClick={() => handleToggleCondition(condition)}
              >
                {condition}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Medications/Supplements */}
      <Card className="health-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">Current Medications/Supplements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {MEDICATIONS.map((medication) => (
              <Badge
                key={medication}
                variant={profile.medications.includes(medication) ? "default" : "outline"}
                className="cursor-pointer transition-all"
                onClick={() => handleToggleMedication(medication)}
              >
                {medication}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button 
          type="submit" 
          className="health-gradient text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
};