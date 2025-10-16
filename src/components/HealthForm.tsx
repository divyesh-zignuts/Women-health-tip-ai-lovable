import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { HealthProfile } from "@/lib/api";
import {
  HEALTH_CONDITIONS,
  HEALTH_FOCUS_OPTIONS,
  MEDICATIONS,
  PRIORITY_OPTIONS,
} from "@/constants/constant";
import { LabTestForm } from "./LabTestForm";
import { PreviousOrdersForm } from "./PreviousOrdersForm";
import { useToast } from "@/hooks/use-toast";

interface HealthFormProps {
  onSubmit: (profile: HealthProfile) => void;
  isLoading?: boolean;
  submitButtonText: string;
}

export const HealthForm: React.FC<HealthFormProps> = ({
  onSubmit,
  isLoading = false,
  submitButtonText,
}) => {
  const [profile, setProfile] = useState<HealthProfile>({
    symptoms: [],
    conditions: [],
    currentUsage: [],
  });
  const [newSymptom, setNewSymptom] = useState("");
  const [severityLevel, setSeverityLevel] = useState<number>();
  const [symptomDateTime, setSymptomDateTime] = useState("");
  const { toast } = useToast();

  const handleAddSymptom = () => {
    if (
      newSymptom.trim() &&
      symptomDateTime &&
      !profile.symptoms.some((s) => s.symptomName === newSymptom.trim())
    ) {
      setProfile((prev) => ({
        ...prev,
        symptoms: [
          ...prev.symptoms,
          {
            symptomName: newSymptom.trim(),
            severityLevel: severityLevel,
            dateTime: symptomDateTime + ':00.000Z',
          },
        ],
      }));
      setNewSymptom("");
      setSeverityLevel(1);
      setSymptomDateTime("");
    }
  };

  const handleRemoveSymptom = (symptomName: string) => {
    setProfile((prev) => ({
      ...prev,
      symptoms: prev.symptoms.filter((s) => s.symptomName !== symptomName),
    }));
  };

  const handleToggleCondition = (condition: string) => {
    setProfile((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter((c) => c !== condition)
        : [...prev.conditions, condition],
    }));
  };

  const handleToggleMedication = (medication: string) => {
    setProfile((prev) => ({
      ...prev,
      currentUsage: prev.currentUsage.includes(medication)
        ? prev.currentUsage.filter((m) => m !== medication)
        : [...prev.currentUsage, medication],
    }));
  };

  const handleAddLabTest = (labTest) => {
    setProfile((prev) => ({
      ...prev,
      labTestResults: [...(prev.labTestResults || []), labTest],
    }));
  };

  const handleRemoveLabTest = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      labTestResults: prev.labTestResults?.filter((_, i) => i !== index) || [],
    }));
  };

const handleAddPreviousOrder = (order) => {
  const formattedOrder = {
    ...order,
    orderDateTime: order.orderDateTime + ':00.000Z'
  };
  
  setProfile((prev) => ({
    ...prev,
    previousOrders: [...(prev.previousOrders || []), formattedOrder],
  }));
};

  const handleRemovePreviousOrder = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      previousOrders: prev.previousOrders?.filter((_, i) => i !== index) || [],
    }));
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!profile.userDetails?.userId) {
    toast({
      title: "User ID Required",
      description: "Please enter a User ID to continue",
      variant: "destructive",
    });
    return;
  }

  const cleanedProfile: HealthProfile = {
    userDetails: profile.userDetails,
  };

  if (profile.age) cleanedProfile.age = profile.age;
  if (profile.gender) cleanedProfile.gender = profile.gender;
  if (profile.maritalStatus) cleanedProfile.maritalStatus = profile.maritalStatus;
  if (profile.bodyMetrics?.weightKg || profile.bodyMetrics?.heightCm) {
    cleanedProfile.bodyMetrics = profile.bodyMetrics;
  }
  if (profile.symptoms && profile.symptoms.length > 0) {
    cleanedProfile.symptoms = profile.symptoms;
  }
  if (profile.menstrualCycle && Object.values(profile.menstrualCycle).some(val => val)) {
    cleanedProfile.menstrualCycle = profile.menstrualCycle;
  }
  if (profile.labTestResults && profile.labTestResults.length > 0) {
    cleanedProfile.labTestResults = profile.labTestResults;
  }
  if (profile.previousOrders && profile.previousOrders.length > 0) {
    cleanedProfile.previousOrders = profile.previousOrders;
  }
  if (profile.currentFocus) cleanedProfile.currentFocus = profile.currentFocus;
  if (profile.conditions && profile.conditions.length > 0) {
    cleanedProfile.conditions = profile.conditions;
  }
  if (profile.currentUsage && profile.currentUsage.length > 0) {
    cleanedProfile.currentUsage = profile.currentUsage;
  }
  if (profile.userPriority) cleanedProfile.userPriority = profile.userPriority;

  onSubmit(cleanedProfile);
};

  const resetForm = () => {
    setProfile({
      symptoms: [],
      conditions: [],
      currentUsage: [],
    });
    setNewSymptom("");
    setSeverityLevel(undefined);
    setSymptomDateTime("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="health-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            User Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="userId">User ID *</Label>
              <Input
                id="userId"
                type="text"
                value={profile.userDetails?.userId || ""}
                placeholder="Enter User ID"
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    userDetails: {
                      ...prev.userDetails,
                      userId: e.target.value,
                      name: prev.userDetails?.name || "",
                      dateOfBirth: prev.userDetails?.dateOfBirth || "",
                    },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={profile.userDetails?.name || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    userDetails: {
                      ...prev.userDetails,
                      userId: prev.userDetails?.userId || "",
                      name: e.target.value,
                      dateOfBirth: prev.userDetails?.dateOfBirth || "",
                    },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={profile.userDetails?.dateOfBirth || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    userDetails: {
                      ...prev.userDetails,
                      userId: prev.userDetails?.userId || "",
                      name: prev.userDetails?.name || "",
                      dateOfBirth: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="health-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={profile.age || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    age: parseInt(e.target.value) || undefined,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={profile.gender || ""}
                onValueChange={(value: "male" | "female") =>
                  setProfile((prev) => ({ ...prev, gender: value }))
                }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Select
                value={profile.maritalStatus || ""}
                onValueChange={(value: "married" | "unmarried") =>
                  setProfile((prev) => ({ ...prev, maritalStatus: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="unmarried">Unmarried</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Weight in kg"
                value={profile.bodyMetrics?.weightKg || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    bodyMetrics: {
                      ...prev.bodyMetrics,
                      weightKg: parseInt(e.target.value) || undefined,
                    },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Height in cm"
                value={profile.bodyMetrics?.heightCm || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    bodyMetrics: {
                      ...prev.bodyMetrics,
                      heightCm: parseInt(e.target.value) || undefined,
                    },
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="health-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            Current Symptoms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <Input
              placeholder="Add a symptom"
              value={newSymptom}
              onChange={(e) => setNewSymptom(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddSymptom())
              }
            />
            <div>
              <Input
                type="number"
                min="1"
                max="10"
                placeholder="Severity Level (1-10)"
                value={severityLevel}
                onChange={(e) =>
                  setSeverityLevel(parseInt(e.target.value) || 1)
                }
              />
            </div>
            <div>
              <Input
                type="datetime-local"
                value={symptomDateTime}
                onChange={(e) => setSymptomDateTime(e.target.value)}
              />
            </div>
            <Button type="button" onClick={handleAddSymptom} variant="outline">
              <Plus className="h-4 w-3 mr-2" />
              Add Symptom
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.symptoms.length === 0 ? (
              <p className="text-muted-foreground">
                No symptoms added yet. Add symptoms with severity levels.
              </p>
            ) : (
              profile.symptoms.map((symptom) => (
                <Badge
                  key={symptom.symptomName}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {symptom.symptomName} (Level {symptom.severityLevel})
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveSymptom(symptom.symptomName)}
                  />
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="health-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            Menstrual Cycle Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Cycle Regularity</Label>
            <Select
              value={profile.menstrualCycle?.regularity || ""}
              onValueChange={(value: "regular" | "irregular" | "unknown") =>
                setProfile((prev) => ({
                  ...prev,
                  menstrualCycle: {
                    ...prev.menstrualCycle,
                    regularity: value,
                  },
                }))
              }
            >
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
                value={profile.menstrualCycle?.daysUntilNextCycle || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    menstrualCycle: {
                      ...prev.menstrualCycle,
                      daysUntilNextCycle: parseInt(e.target.value) || undefined,
                    },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
              <Input
                id="cycleLength"
                type="number"
                placeholder="Days"
                value={profile.menstrualCycle?.cycleLengthDays || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    menstrualCycle: {
                      ...prev.menstrualCycle,
                      cycleLengthDays: parseInt(e.target.value) || undefined,
                    },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="periodLength">Average Period Length (days)</Label>
              <Input
                id="periodLength"
                type="number"
                placeholder="Days"
                value={profile.menstrualCycle?.periodLengthDays || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    menstrualCycle: {
                      ...prev.menstrualCycle,
                      periodLengthDays: parseInt(e.target.value) || undefined,
                    },
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="health-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            Fertility Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fertileStart">Fertile Start Date</Label>
              <Input
                id="fertileStart"
                type="date"
                value={profile.menstrualCycle?.fertileWindowStartDate || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    menstrualCycle: {
                      ...prev.menstrualCycle,
                      fertileWindowStartDate: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="fertileEnd">Fertile End Date</Label>
              <Input
                id="fertileEnd"
                type="date"
                value={profile.menstrualCycle?.fertileWindowEndDate || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    menstrualCycle: {
                      ...prev.menstrualCycle,
                      fertileWindowEndDate: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="ovulationDate">Ovulation Date</Label>
              <Input
                id="ovulationDate"
                type="date"
                value={profile.menstrualCycle?.ovulationDate || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    menstrualCycle: {
                      ...prev.menstrualCycle,
                      ovulationDate: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="health-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            Health Focus & Priorities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Health Focus</Label>
            <Select
              value={profile.currentFocus || ""}
              onValueChange={(value) =>
                setProfile((prev) => ({ ...prev, currentFocus: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="What are you focusing on?" />
              </SelectTrigger>
              <SelectContent>
                {HEALTH_FOCUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Primary Priority</Label>
            <Select
              value={profile.userPriority || ""}
              onValueChange={(value) =>
                setProfile((prev) => ({ ...prev, userPriority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="What's most important to you?" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="health-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            Health Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {HEALTH_CONDITIONS.map((condition) => (
              <Badge
                key={condition}
                variant={
                  profile.conditions.includes(condition) ? "default" : "outline"
                }
                className="cursor-pointer transition-all"
                onClick={() => handleToggleCondition(condition)}
              >
                {condition}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="health-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            Current Medications / Supplements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {MEDICATIONS.map((medication) => (
              <Badge
                key={medication}
                variant={
                  profile.currentUsage.includes(medication)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer transition-all"
                onClick={() => handleToggleMedication(medication)}
              >
                {medication}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <LabTestForm
        labTestResults={profile.labTestResults || []}
        onAddLabTest={handleAddLabTest}
        onRemoveLabTest={handleRemoveLabTest}
      />

      <PreviousOrdersForm
        previousOrders={profile.previousOrders || []}
        onAddPreviousOrder={handleAddPreviousOrder}
        onRemovePreviousOrder={handleRemovePreviousOrder}
      />

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          type="submit"
          className="health-gradient text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : submitButtonText}
        </Button>
        <Button
          type="button"
          onClick={resetForm}
          variant="outline"
          className="px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full sm:w-auto"
        >
          Reset
        </Button>
      </div>
    </form>
  );
};