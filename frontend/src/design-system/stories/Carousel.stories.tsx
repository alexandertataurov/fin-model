import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../components/Carousel';

const meta = {
  title: 'Design System/Carousel',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => (
    <div className="w-[360px]">
      <Carousel>
        <CarouselContent>
          {[1, 2, 3, 4].map(i => (
            <CarouselItem key={i}>
              <div className="h-40 rounded-md border bg-card flex items-center justify-center text-sm text-muted-foreground">
                Slide {i} (demo)
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};
