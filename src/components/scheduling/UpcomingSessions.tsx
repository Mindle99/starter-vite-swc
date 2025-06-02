import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CalendarClock, Clock, Edit, X, CheckCircle } from "lucide-react";

interface SessionProps {
  id: string;
  studentName: string;
  subject: string;
  dateTime: Date;
  duration: number; // in minutes
  status: "upcoming" | "completed" | "canceled";
  isVirtual: boolean;
}

interface UpcomingSessionsProps {
  sessions?: SessionProps[];
  onEditSession?: (sessionId: string) => void;
  onCancelSession?: (sessionId: string) => void;
  onCompleteSession?: (sessionId: string) => void;
}

const SessionCard = ({
  session,
  onEdit,
  onCancel,
  onComplete,
}: {
  session: SessionProps;
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="mb-3 bg-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-sm">{session.studentName}</h4>
            <p className="text-xs text-muted-foreground">{session.subject}</p>
          </div>
          <Badge
            variant={
              session.status === "upcoming"
                ? "default"
                : session.status === "completed"
                  ? "secondary"
                  : "destructive"
            }
            className="text-xs"
          >
            {session.status}
          </Badge>
        </div>

        <div className="mt-2 flex items-center text-xs text-muted-foreground">
          <CalendarClock className="h-3 w-3 mr-1" />
          <span>
            {formatDate(session.dateTime)} at {formatTime(session.dateTime)}
          </span>
        </div>

        <div className="mt-1 flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>{session.duration} minutes</span>
          {session.isVirtual && (
            <Badge variant="outline" className="ml-2 text-xs">
              Virtual
            </Badge>
          )}
        </div>

        {session.status === "upcoming" && (
          <div className="mt-3 flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => onEdit && onEdit(session.id)}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-destructive hover:text-destructive"
              onClick={() => onCancel && onCancel(session.id)}
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-green-600 hover:text-green-600"
              onClick={() => onComplete && onComplete(session.id)}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Complete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const UpcomingSessions = ({
  sessions = [],
  onEditSession,
  onCancelSession,
  onCompleteSession,
}: UpcomingSessionsProps) => {
  // Default mock data if no sessions are provided
  const defaultSessions: SessionProps[] = [
    {
      id: "1",
      studentName: "Alex Johnson",
      subject: "Mathematics",
      dateTime: new Date(Date.now() + 3600000), // 1 hour from now
      duration: 60,
      status: "upcoming",
      isVirtual: true,
    },
    {
      id: "2",
      studentName: "Emma Wilson",
      subject: "Physics",
      dateTime: new Date(Date.now() + 7200000), // 2 hours from now
      duration: 90,
      status: "upcoming",
      isVirtual: false,
    },
    {
      id: "3",
      studentName: "Michael Brown",
      subject: "Chemistry",
      dateTime: new Date(Date.now() + 10800000), // 3 hours from now
      duration: 45,
      status: "upcoming",
      isVirtual: true,
    },
    {
      id: "4",
      studentName: "Sophia Davis",
      subject: "English Literature",
      dateTime: new Date(Date.now() + 86400000), // 1 day from now
      duration: 60,
      status: "upcoming",
      isVirtual: false,
    },
    {
      id: "5",
      studentName: "William Taylor",
      subject: "Biology",
      dateTime: new Date(Date.now() + 172800000), // 2 days from now
      duration: 75,
      status: "upcoming",
      isVirtual: true,
    },
  ];

  const displaySessions = sessions.length > 0 ? sessions : defaultSessions;

  // Sort sessions by date (closest first)
  const sortedSessions = [...displaySessions].sort(
    (a, b) => a.dateTime.getTime() - b.dateTime.getTime(),
  );

  return (
    <Card className="h-full bg-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">
          Upcoming Sessions
        </CardTitle>
      </CardHeader>
      <Separator />
      <ScrollArea className="h-[calc(100%-70px)] px-4 py-2">
        {sortedSessions.length > 0 ? (
          sortedSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onEdit={onEditSession}
              onCancel={onCancelSession}
              onComplete={onCompleteSession}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <CalendarClock className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No upcoming sessions</p>
            <Button variant="outline" className="mt-4">
              Schedule a Session
            </Button>
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default UpcomingSessions;
