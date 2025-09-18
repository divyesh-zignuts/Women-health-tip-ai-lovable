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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";

interface LabTestResult {
  orderId: string;
  testName: string;
  value: number;
  status: string;
  testDate: string;
}

interface LabTestFormProps {
  labTestResults: LabTestResult[];
  onAddLabTest: (labTest: LabTestResult) => void;
  onRemoveLabTest: (index: number) => void;
}

export const LabTestForm: React.FC<LabTestFormProps> = ({
  labTestResults,
  onAddLabTest,
  onRemoveLabTest,
}) => {
  const [newLabTest, setNewLabTest] = useState({
    orderId: "",
    testName: "AMH",
    value: 0,
    status: "normal",
    testDate: "",
  });

  const handleAddLabTest = () => {
    if (newLabTest.orderId.trim() && newLabTest.testDate) {
      onAddLabTest({ ...newLabTest });
      setNewLabTest({
        orderId: "",
        testName: "AMH",
        value: 0,
        status: "normal",
        testDate: "",
      });
    }
  };

  return (
    <Card className="health-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Lab Test Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="orderId">Order ID</Label>
            <Input
              id="orderId"
              type="text"
              placeholder="Order ID"
              value={newLabTest.orderId}
              onChange={(e) =>
                setNewLabTest((prev) => ({
                  ...prev,
                  orderId: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="testName">Test Name</Label>
            <Select
              value={newLabTest.testName}
              onValueChange={(value) =>
                setNewLabTest((prev) => ({ ...prev, testName: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AMH">AMH</SelectItem>
                <SelectItem value="FSH">FSH</SelectItem>
                <SelectItem value="LH">LH</SelectItem>
                <SelectItem value="Estradiol">Estradiol</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="testValue">Test Value</Label>
            <Input
              id="testValue"
              type="number"
              step="0.1"
              placeholder="Test value"
              value={newLabTest.value}
              onChange={(e) =>
                setNewLabTest((prev) => ({
                  ...prev,
                  value: parseFloat(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="testStatus">Status</Label>
            <Select
              value={newLabTest.status}
              onValueChange={(value) =>
                setNewLabTest((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="testDate">Test Date</Label>
            <Input
              id="testDate"
              type="date"
              value={newLabTest.testDate}
              onChange={(e) =>
                setNewLabTest((prev) => ({
                  ...prev,
                  testDate: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <Button
          type="button"
          onClick={handleAddLabTest}
          variant="outline"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Lab Test Result
        </Button>
        <div className="space-y-2">
          {labTestResults?.map((test, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">
                  {test.testName} - Order: {test.orderId}
                </p>
                <p className="text-sm text-muted-foreground">
                  Value: {test.value} | Status: {test.status} | Date:{" "}
                  {test.testDate}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveLabTest(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};