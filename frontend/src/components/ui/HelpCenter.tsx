import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Button } from './button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';
import { Input } from './input';
import { Badge } from './badge';
import { Card, CardContent, CardDescription, CardTitle } from './card';
import {
  HelpCircle,
  Search,
  PlayCircle,
  FileText,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface HelpItem {
  id: string;
  title: string;
  content: string;
  category: 'faq' | 'tutorial' | 'guide' | 'troubleshooting';
  tags: string[];
  type: 'text' | 'video' | 'link';
  url?: string;
}

const helpContent: HelpItem[] = [
  {
    id: '1',
    title: 'How to upload financial models',
    content:
      'Learn how to upload Excel financial models to FinVision and start creating interactive dashboards.',
    category: 'tutorial',
    tags: ['upload', 'excel', 'models'],
    type: 'text',
  },
  {
    id: '2',
    title: 'Understanding P&L dashboards',
    content:
      'Profit & Loss dashboards help you visualize revenue, expenses, and profitability trends over time.',
    category: 'guide',
    tags: ['dashboard', 'p&l', 'visualization'],
    type: 'text',
  },
  {
    id: '3',
    title: 'Creating custom parameters',
    content:
      'Custom parameters allow you to modify assumptions and see real-time impact on your financial models.',
    category: 'tutorial',
    tags: ['parameters', 'modeling', 'assumptions'],
    type: 'text',
  },
  {
    id: '4',
    title: 'Troubleshooting upload errors',
    content:
      'Common issues when uploading files and how to resolve them quickly.',
    category: 'troubleshooting',
    tags: ['error', 'upload', 'troubleshooting'],
    type: 'text',
  },
  {
    id: '5',
    title: 'Video: Getting started with FinVision',
    content:
      'A comprehensive video walkthrough of FinVision features and capabilities.',
    category: 'tutorial',
    tags: ['video', 'tutorial', 'getting-started'],
    type: 'video',
    url: 'https://example.com/video',
  },
  {
    id: '6',
    title: 'Advanced modeling techniques',
    content:
      'Learn advanced techniques for building complex financial models in FinVision.',
    category: 'guide',
    tags: ['advanced', 'modeling', 'techniques'],
    type: 'link',
    url: 'https://docs.finvision.com/advanced',
  },
];

interface HelpCenterProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({
  open,
  onOpenChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredContent = helpContent.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory = activeTab === 'all' || item.category === activeTab;

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tutorial':
        return <PlayCircle className="h-4 w-4" />;
      case 'guide':
        return <FileText className="h-4 w-4" />;
      case 'troubleshooting':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case 'link':
        return <ExternalLink className="h-4 w-4 text-green-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleItemAction = (item: HelpItem) => {
    if (item.type === 'link' || item.type === 'video') {
      if (item.url) {
        window.open(item.url, '_blank');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Help Center
          </DialogTitle>
          <DialogDescription>
            Find answers to common questions and learn how to use FinVision
            effectively.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search help articles..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="tutorial">Tutorials</TabsTrigger>
              <TabsTrigger value="guide">Guides</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="max-h-[400px] overflow-y-auto pr-2">
                {filteredContent.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Search className="h-12 w-12 text-muted-foreground mb-4" />
                      <CardTitle className="text-lg mb-2">
                        No results found
                      </CardTitle>
                      <CardDescription>
                        Try adjusting your search terms or browse different
                        categories.
                      </CardDescription>
                    </CardContent>
                  </Card>
                ) : (
                  <Accordion type="single" collapsible className="space-y-2">
                    {filteredContent.map(item => (
                      <AccordionItem
                        key={item.id}
                        value={item.id}
                        className="border rounded-lg"
                      >
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            {getCategoryIcon(item.category)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  {item.title}
                                </span>
                                {getTypeIcon(item.type)}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {item.tags.map(tag => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-3">
                            <p className="text-muted-foreground">
                              {item.content}
                            </p>
                            {(item.type === 'video' || item.type === 'link') &&
                              item.url && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleItemAction(item)}
                                  className="w-fit"
                                >
                                  {item.type === 'video' ? (
                                    <>
                                      <PlayCircle className="mr-2 h-4 w-4" />
                                      Watch Video
                                    </>
                                  ) : (
                                    <>
                                      <ExternalLink className="mr-2 h-4 w-4" />
                                      Open Link
                                    </>
                                  )}
                                </Button>
                              )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              Need more help? Contact our{' '}
              <Button variant="link" className="p-0 h-auto text-sm">
                support team
              </Button>
            </div>
            <Button variant="outline" onClick={() => onOpenChange?.(false)}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Help Button Component
interface HelpButtonProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export const HelpButton: React.FC<HelpButtonProps> = ({
  className,
  size = 'default',
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size={size}
            className={cn('gap-2', className)}
          >
            <HelpCircle className="h-4 w-4" />
            Help
          </Button>
        </DialogTrigger>
        <HelpCenter open={open} onOpenChange={setOpen} />
      </Dialog>
    </>
  );
};

export default { HelpCenter, HelpButton };
