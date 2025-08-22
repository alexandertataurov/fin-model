import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

export interface ImageWithFallbackProps {
    src: string;
    alt: string;
    fallback?: string;
    onLoad?: () => void;
    onError?: () => void;
    className?: string;
    width?: string | number;
    height?: string | number;
    loading?: 'lazy' | 'eager';
    style?: React.CSSProperties;
}

const StyledImage = styled.img<{ $isLoading: boolean; $hasError: boolean }>`
  opacity: ${({ $isLoading, $hasError }) => ($isLoading || $hasError ? 0 : 1)};
  transition: opacity 0.3s ease-in-out;
  max-width: 100%;
  height: auto;
  display: block;
`;

const FallbackContainer = styled.div<{ $isVisible: boolean }>`
  display: ${({ $isVisible }) => ($isVisible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  color: #6b7280;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  width: 100%;
  height: 100%;
  min-height: 2rem;
`;

const LoadingSpinner = styled.div<{ $isVisible: boolean }>`
  display: ${({ $isVisible }) => ($isVisible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 2rem;
  
  &::after {
    content: '';
    width: 1rem;
    height: 1rem;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
  overflow: hidden;
`;

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
    src,
    alt,
    fallback,
    onLoad,
    onError,
    className,
    width,
    height,
    loading = 'lazy',
    style,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [imageSrc, setImageSrc] = useState(src);

    const handleLoad = useCallback(() => {
        setIsLoading(false);
        setHasError(false);
        onLoad?.();
    }, [onLoad]);

    const handleError = useCallback(() => {
        setIsLoading(false);
        setHasError(true);

        // Try fallback if available and different from current src
        if (fallback && fallback !== imageSrc) {
            setImageSrc(fallback);
            setIsLoading(true);
            setHasError(false);
        } else {
            onError?.();
        }
    }, [fallback, imageSrc, onError]);

    // Reset state when src changes
    React.useEffect(() => {
        setImageSrc(src);
        setIsLoading(true);
        setHasError(false);
    }, [src]);

    return (
        <ImageContainer
            className={className}
            style={{ width, height, ...style }}
        >
            <StyledImage
                src={imageSrc}
                alt={alt}
                loading={loading}
                onLoad={handleLoad}
                onError={handleError}
                $isLoading={isLoading}
                $hasError={hasError}
            />

            <LoadingSpinner $isVisible={isLoading} />

            <FallbackContainer $isVisible={hasError && !isLoading}>
                {fallback ? (
                    <img
                        src={fallback}
                        alt={`${alt} (fallback)`}
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                ) : (
                    <span>Image not available</span>
                )}
            </FallbackContainer>
        </ImageContainer>
    );
};

export default ImageWithFallback;
