import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface AgentCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  route: string;
  variant?: 'primary' | 'secondary';
}

export const AgentCard: React.FC<AgentCardProps> = ({
  icon: Icon,
  title,
  description,
  features,
  buttonText,
  route,
  variant = 'primary'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  return (
    <Card className="health-card max-w-md">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-full ${
            variant === 'primary' 
              ? 'bg-primary/10 text-primary' 
              : 'bg-secondary/10 text-secondary'
          }`}>
            <Icon size={32} />
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-foreground">{title}</CardTitle>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                variant === 'primary' ? 'bg-primary' : 'bg-secondary'
              }`} />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          onClick={handleClick}
          className={`w-full py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
            variant === 'primary' 
              ? 'bg-primary hover:bg-primary-hover text-white' 
              : 'bg-secondary hover:bg-secondary-hover text-white'
          }`}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};