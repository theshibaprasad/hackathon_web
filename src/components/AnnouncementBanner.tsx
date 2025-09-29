"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Bell, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  ExternalLink,
  Pin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent' | 'event';
  priority: 'low' | 'medium' | 'high' | 'critical';
  isPinned: boolean;
  tags?: string[];
  actionButton?: {
    text: string;
    url: string;
    style: 'primary' | 'secondary' | 'outline';
  };
  createdAt: string;
}

const typeIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  urgent: AlertCircle,
  event: Calendar
};

const typeStyles = {
  info: {
    bg: 'bg-gradient-to-r from-blue-50 to-blue-100',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  warning: {
    bg: 'bg-gradient-to-r from-yellow-50 to-yellow-100',
    border: 'border-yellow-200',
    icon: 'text-yellow-600',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  success: {
    bg: 'bg-gradient-to-r from-green-50 to-green-100',
    border: 'border-green-200',
    icon: 'text-green-600',
    badge: 'bg-green-100 text-green-800 border-green-200'
  },
  urgent: {
    bg: 'bg-gradient-to-r from-red-50 to-red-100',
    border: 'border-red-200',
    icon: 'text-red-600',
    badge: 'bg-red-100 text-red-800 border-red-200'
  },
  event: {
    bg: 'bg-gradient-to-r from-purple-50 to-purple-100',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-800 border-purple-200'
  }
};

const priorityStyles = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800 animate-pulse'
};

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
    
    // Load dismissed announcements from localStorage
    const dismissed = localStorage.getItem('dismissedAnnouncements');
    if (dismissed) {
      setDismissedAnnouncements(new Set(JSON.parse(dismissed)));
    }
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements?limit=5');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out dismissed announcements and get visible ones
  const visibleAnnouncements = announcements.filter(
    announcement => !dismissedAnnouncements.has(announcement._id)
  );

  // Show toast when announcements are loaded
  useEffect(() => {
    if (!isLoading && visibleAnnouncements.length > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000); // Show after 1 second delay
      return () => clearTimeout(timer);
    }
  }, [isLoading, visibleAnnouncements.length]);

  const handleDismiss = (announcementId: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      const newDismissed = new Set(dismissedAnnouncements);
      newDismissed.add(announcementId);
      setDismissedAnnouncements(newDismissed);
      localStorage.setItem('dismissedAnnouncements', JSON.stringify([...newDismissed]));
      setIsVisible(false);
      setIsAnimating(false);
    }, 300); // Match animation duration
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimating(false);
    }, 300);
  };

  const handleActionClick = (url: string) => {
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  };

  // Auto-rotate announcements every 8 seconds
  useEffect(() => {
    if (visibleAnnouncements.length > 1 && isVisible) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % visibleAnnouncements.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [visibleAnnouncements.length, isVisible]);

  const nextAnnouncement = () => {
    if (visibleAnnouncements.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % visibleAnnouncements.length);
    }
  };

  const prevAnnouncement = () => {
    if (visibleAnnouncements.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + visibleAnnouncements.length) % visibleAnnouncements.length);
    }
  };

  if (isLoading || visibleAnnouncements.length === 0 || !isVisible) {
    return null;
  }

  const currentAnnouncement = visibleAnnouncements[currentIndex];
  const TypeIcon = typeIcons[currentAnnouncement.type];
  const styles = typeStyles[currentAnnouncement.type];

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl md:max-w-2xl">
      <Card 
        className={`${styles.bg} ${styles.border} shadow-xl border overflow-hidden relative transform transition-all duration-300 ease-out ${
          isVisible && !isAnimating 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-4 opacity-0'
        }`}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white to-transparent animate-pulse" />
        </div>
        
        <CardContent className="p-4 md:p-5 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 md:space-x-4 flex-1">
              {/* Icon with glow effect */}
              <div className={`p-2 md:p-2.5 rounded-full ${styles.bg} shadow relative flex-shrink-0`}>
                <TypeIcon className={`w-5 h-5 md:w-6 md:h-6 ${styles.icon}`} />
                {currentAnnouncement.isPinned && (
                  <Pin className="w-3 h-3 text-blue-600 absolute -top-1 -right-1" />
                )}
                {currentAnnouncement.priority === 'critical' && (
                  <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {/* Title and badges */}
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-tight line-clamp-2">
                    {currentAnnouncement.title}
                  </h3>
                </div>

                {/* Content */}
                <p className="text-sm md:text-[15px] text-gray-700 mb-3 leading-relaxed line-clamp-3">
                  {currentAnnouncement.content}
                </p>

                {/* Badges */}
                <div className="flex items-center gap-1 mb-3 flex-wrap">
                  <Badge className={`${styles.badge} text-[11px] md:text-xs px-2 py-0.5`}>
                    {currentAnnouncement.type}
                  </Badge>
                  <Badge className={`${priorityStyles[currentAnnouncement.priority]} text-[11px] md:text-xs px-2 py-0.5`}>
                    {currentAnnouncement.priority}
                  </Badge>
                  {currentAnnouncement.isPinned && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[11px] md:text-xs px-2 py-0.5">
                      <Pin className="w-2 h-2 mr-1" />
                      Pinned
                    </Badge>
                  )}
                </div>

                {/* Action button */}
                {currentAnnouncement.actionButton && (
                  <Button
                    onClick={() => handleActionClick(currentAnnouncement.actionButton!.url)}
                    className={`${
                      currentAnnouncement.actionButton.style === 'primary'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : currentAnnouncement.actionButton.style === 'secondary'
                        ? 'bg-gray-600 hover:bg-gray-700 text-white'
                        : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                    } transition-all duration-200 hover:shadow-md text-xs md:text-sm px-3 md:px-4 py-1 h-8`}
                    size="sm"
                  >
                    {currentAnnouncement.actionButton.text}
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}
              </div>
            </div>

            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDismiss(currentAnnouncement._id)}
              className="text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-full p-1 h-7 w-7 flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Navigation and progress for multiple announcements */}
          {visibleAnnouncements.length > 1 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevAnnouncement}
                  className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextAnnouncement}
                  className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex items-center space-x-1">
                {visibleAnnouncements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex
                        ? 'bg-blue-600 w-4 md:w-6'
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
