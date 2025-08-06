import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EnhancedCard, EnhancedButton, componentStyles } from '@/components/ui';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className={componentStyles.container}>
        <div className="text-center space-y-6">
          <EnhancedCard variant="outline" className="max-w-md mx-auto">
            <div className="space-y-4">
              <div className="text-6xl font-bold text-muted-foreground">404</div>
              <h1 className={componentStyles.heading.h1}>Page Not Found</h1>
              <p className="text-muted-foreground">
                The page you're looking for doesn't exist or has been moved.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <EnhancedButton
                  variant="outline"
                  leftIcon={<ArrowLeft />}
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </EnhancedButton>
                <EnhancedButton
                  leftIcon={<Home />}
                  onClick={() => navigate('/')}
                >
                  Go Home
                </EnhancedButton>
              </div>
            </div>
          </EnhancedCard>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 