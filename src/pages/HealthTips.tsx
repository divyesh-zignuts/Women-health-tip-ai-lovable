import React, { useState } from "react";
import { HealthForm } from "@/components/HealthForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  HealthProfile,
  getHealthTips,
  mockHealthTips,
  HealthTipsResponse,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy } from "lucide-react";
import { Loader2 } from "lucide-react";

const HealthTips = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<HealthTipsResponse | null>(null);

const handleSubmit = async (profile: HealthProfile) => {
  setIsLoading(true);

  try {
    const response = await getHealthTips(profile);

    if (response.success && response.data && response.data.HealthTips) {
      if (response.data.HealthTips.summary || response.data.HealthTips.tips) {
        setResults(response.data);
        toast({
          title: "Health Tips Generated!",
          description: "Your personalized health recommendations are ready.",
        });
      } else {
        toast({
          title: "Need More Information",
          description: "Please add more details about your health profile to get personalized tips.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Need More Information", 
        description: "Please add symptoms, conditions, or other health details to get personalized recommendations.",
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
  //         <HealthResults type="tips" data={results} />
  //       </div>
  //     </div>
  //   );
  // }

  const copyToClipboard = (text: string, type: string) => {
    const plainText = text.replace(/<[^>]*>/g, "");
    navigator.clipboard.writeText(plainText).then(() => {
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    });
  };

  const copyAllContent = () => {
    const summaryText =
      results?.HealthTips.summary.replace(/<[^>]*>/g, "") || "";
    const tipsText = results?.HealthTips.tips.replace(/<[^>]*>/g, "") || "";
    const allContent = `SUMMARY:\n${summaryText}\n\nDETAILED TIPS:\n${tipsText}`;

    navigator.clipboard.writeText(allContent).then(() => {
      toast({
        title: "Copied!",
        description: "All health tips copied to clipboard",
      });
    });
  };

  return (
    <div
      className={`min-h-screen health-gradient-soft ${
        isLoading ? "opacity-80" : ""
      } relative`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>

          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-primary/10 text-primary">
                <Heart size={32} />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Health Tips Agent
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get personalized health insights and wellness recommendations
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Share Your Health Information
            </h2>
            <p className="text-muted-foreground">
              The more information you provide, the more personalized and
              accurate your health tips will be.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <HealthForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitButtonText="Get Health Tips"
          />
        </div>
        {results && (
          <Dialog open={!!results} onOpenChange={() => setResults(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary">
                  Your Personalized Health Tips
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
              <div className="space-y-6 mt-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Summary</h3>
                  <div
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html: results.HealthTips.summary,
                    }}
                  />
                </div>
                <div className="bg-secondary/5 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Detailed Tips</h3>
                  <div
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html: results.HealthTips.tips,
                    }}
                  />
                </div>
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
                  Generating Health Tips
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

export default HealthTips;
