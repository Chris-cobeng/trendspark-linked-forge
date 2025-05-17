
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';

const CalendarPage: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Mock scheduled posts data
  const scheduledDates = [
    new Date(2025, 4, 19),
    new Date(2025, 4, 21),
    new Date(2025, 4, 25)
  ];

  // Function to determine if a date has posts scheduled
  const hasScheduledPost = (day: Date) => {
    return scheduledDates.some(scheduledDate => 
      scheduledDate.getDate() === day.getDate() && 
      scheduledDate.getMonth() === day.getMonth() &&
      scheduledDate.getFullYear() === day.getFullYear()
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Content Calendar</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Schedule Posts</h2>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                booked: (date) => hasScheduledPost(date),
              }}
              modifiersStyles={{
                booked: { backgroundColor: 'rgba(30, 174, 219, 0.1)', fontWeight: 'bold', color: '#1EAEDB' }
              }}
              components={{
                DayContent: ({ date }) => (
                  <div className="relative">
                    <span>{date.getDate()}</span>
                    {hasScheduledPost(date) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-linkedBlue rounded-full"></div>
                    )}
                  </div>
                ),
              }}
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Scheduled Posts</h2>
          
          {scheduledDates.length > 0 ? (
            <div className="space-y-4">
              {scheduledDates.map((date, index) => (
                <Card key={index} className="hover-scale cursor-pointer">
                  <CardContent className="p-4">
                    <p className="font-medium text-linkedBlue">{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    <p className="text-sm text-grayScale-500 truncate mt-1">Post about Digital Transformation...</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-grayScale-400">
              <p>No scheduled posts.</p>
            </div>
          )}
        </div>
      </div>
      
      <p className="mt-6 text-sm text-grayScale-400 text-center">
        Pro tip: Schedule posts during peak engagement hours—early mornings (7-9am) 
        and early evenings (5-7pm)—to maximize visibility.
      </p>
    </div>
  );
};

export default CalendarPage;
