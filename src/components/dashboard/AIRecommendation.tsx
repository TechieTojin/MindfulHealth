
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

type AIRecommendationProps = {
  title: string;
  insights: string[];
  actionText?: string;
  onAction?: () => void;
};

const AIRecommendation = ({
  title,
  insights,
  actionText = "Get Personalized Plan",
  onAction,
}: AIRecommendationProps) => {
  return (
    <Card className="health-stat-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-health-accent">
          <Brain className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-4 text-sm">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2 text-health-primary">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
        <Button 
          onClick={onAction} 
          className="w-full bg-health-primary hover:bg-health-dark text-white"
        >
          {actionText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIRecommendation;
