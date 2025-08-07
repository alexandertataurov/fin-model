import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { componentStyles } from '@/design-system/utils/designSystem';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className={componentStyles.container}>
        <div className="text-center space-y-6">
          <Card variant="outline" className="max-w-md mx-auto">
            <CardContent>
              <div className="space-y-4">
                <div className="text-6xl font-bold text-muted-foreground">
                  404
                </div>
                <h1 className={componentStyles.heading.h1}>Page Not Found</h1>
                <p className="text-muted-foreground">
                  The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Button>
                  <Button onClick={() => navigate('/')}>
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
