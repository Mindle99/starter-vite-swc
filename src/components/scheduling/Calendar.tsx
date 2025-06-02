import React, { useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SessionCard from "./SessionCard";
import SessionForm from "./SessionForm";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface CalendarProps {
  sessions?: Array<{
    id: string;
    title: string;
    studentName: string;
    subject: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    type: "virtual" | "in-person";
    color?: string;
  }>;
  view: "day" | "week" | "month";
  onViewChange?: (view: "day" | "week" | "month") => void;
  onSessionClick?: (sessionId: string) => void;
  onDateClick?: (date: Date) => void;
  onCreateSession?: (date: Date) => void;
}

const Calendar = ({
  sessions = [
    {
      id: "1",
      title: "Math Tutoring",
      studentName: "John Smith",
      subject: "Mathematics",
      startTime: new Date(new Date().setHours(10, 0, 0, 0)),
      endTime: new Date(new Date().setHours(11, 0, 0, 0)),
      duration: 60,
      type: "virtual" as const,
      color: "#4CAF50",
    },
    {
      id: "2",
      title: "English Literature",
      studentName: "Emma Johnson",
      subject: "English",
      startTime: new Date(new Date().setHours(14, 0, 0, 0)),
      endTime: new Date(new Date().setHours(15, 30, 0, 0)),
      duration: 90,
      type: "in-person" as const,
      color: "#2196F3",
    },
    {
      id: "3",
      title: "Chemistry Lab",
      studentName: "Michael Brown",
      subject: "Chemistry",
      startTime: new Date(addDays(new Date(), 1).setHours(13, 0, 0, 0)),
      endTime: new Date(addDays(new Date(), 1).setHours(14, 30, 0, 0)),
      duration: 90,
      type: "in-person" as const,
      color: "#FF9800",
    },
  ],
  view,
  onViewChange,
  onSessionClick = () => {},
  onDateClick = () => {},
  onCreateSession = () => {},
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionModalInitialData, setSessionModalInitialData] = useState<any>(null);

  // Generate time slots for day view (8 AM to 8 PM)
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8);

  // Get days for week view
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Get days for month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Navigation functions
  const previousPeriod = () => {
    if (view === "day") {
      setCurrentDate(addDays(currentDate, -1));
    } else if (view === "week") {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
      );
    }
  };

  const nextPeriod = () => {
    if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
      );
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Filter sessions for the current view
  const getSessionsForDay = (date: Date) => {
    return sessions.filter((session) => isSameDay(session.startTime, date));
  };

  const handleOpenSessionModal = (initialData: any = null) => {
    setSessionModalInitialData(initialData);
    setSessionModalOpen(true);
  };

  const handleCloseSessionModal = () => {
    setSessionModalOpen(false);
    setSessionModalInitialData(null);
  };

  const handleSessionFormSubmit = (sessionData: any) => {
    // TODO: Add logic to create session (call API or update state)
    handleCloseSessionModal();
  };

  // Drag-and-drop types
  const ItemTypes = { SESSION: "session" };

  // Draggable SessionCard wrapper
  const DraggableSessionCard = ({ session, onEdit }: any) => {
    const [, drag] = useDrag({
      type: ItemTypes.SESSION,
      item: { session },
    });
    return (
      <div ref={drag} className="cursor-move">
        <SessionCard
          id={session.id}
          studentName={session.studentName}
          subject={session.subject}
          startTime={format(session.startTime, "h:mm a")}
          endTime={format(session.endTime, "h:mm a")}
          duration={`${session.duration} min`}
          sessionType={session.type}
          color={session.color}
          onEdit={onEdit}
          onCancel={() => {}}
          onComplete={() => {}}
        />
      </div>
    );
  };

  // Droppable calendar cell wrapper
  const DroppableCalendarCell = ({
    children,
    date,
    hour,
    onDropSession,
    ...props
  }: any) => {
    const [, drop] = useDrop({
      accept: ItemTypes.SESSION,
      drop: (item: any) => {
        // Calculate new date/time for the session
        const newDate = new Date(date);
        if (typeof hour === "number") {
          newDate.setHours(hour, 0, 0, 0);
        }
        onDropSession(item.session, newDate);
      },
    });
    return (
      <div ref={drop} {...props}>
        {children}
      </div>
    );
  };

  // Render functions for different views
  const renderDayView = () => {
    const daySessionsByHour: Record<number, typeof sessions> = {};
    const daySessions = getSessionsForDay(currentDate);

    // Group sessions by hour
    daySessions.forEach((session) => {
      const hour = session.startTime.getHours();
      if (!daySessionsByHour[hour]) {
        daySessionsByHour[hour] = [];
      }
      daySessionsByHour[hour].push(session);
    });

    return (
      <div className="flex flex-col h-[600px] overflow-y-auto bg-white">
        {timeSlots.map((hour) => (
          <div key={hour} className="flex border-b min-h-[100px]">
            <div className="w-20 p-2 text-sm text-gray-500 border-r">
              {hour}:00
            </div>
            <div
              className="flex-1 p-2 relative"
              onClick={() => {
                const date = new Date(currentDate);
                date.setHours(hour, 0, 0, 0);
                handleOpenSessionModal({
                  date,
                  startTime: `${hour.toString().padStart(2, "0")}:00`,
                });
              }}
            >
              {daySessionsByHour[hour]?.map((session) => (
                <div key={session.id} className="mb-2">
                  <DraggableSessionCard
                    session={session}
                    onEdit={() => onSessionClick(session.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderWeekView = () => {
    return (
      <div className="flex flex-col h-[600px] bg-white">
        {/* Week header */}
        <div className="flex border-b">
          <div className="w-20 p-2 border-r"></div>
          {weekDays.map((day) => (
            <div
              key={day.toString()}
              className="flex-1 p-2 text-center font-medium"
              onClick={() => onDateClick(day)}
            >
              <div>{format(day, "EEE")}</div>
              <div
                className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto ${isSameDay(day, new Date()) ? "bg-primary text-white" : ""}`}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="flex-1 overflow-y-auto">
          {timeSlots.map((hour) => (
            <div key={hour} className="flex border-b min-h-[100px]">
              <div className="w-20 p-2 text-sm text-gray-500 border-r">
                {hour}:00
              </div>
              {weekDays.map((day) => {
                const date = new Date(day);
                date.setHours(hour, 0, 0, 0);
                const daySessions = sessions.filter(
                  (session) =>
                    isSameDay(session.startTime, day) &&
                    session.startTime.getHours() === hour,
                );

                return (
                  <DroppableCalendarCell
                    key={day.toString()}
                    date={day}
                    hour={hour}
                    onDropSession={(session, newDate) => {
                      handleOpenSessionModal({
                        ...session,
                        date: newDate,
                        startTime: `${hour.toString().padStart(2, "0")}:00`,
                      });
                    }}
                    className="flex-1 p-2 border-r relative"
                    onClick={() => {
                      const clickDate = new Date(day);
                      clickDate.setHours(hour, 0, 0, 0);
                      handleOpenSessionModal({
                        date: clickDate,
                        startTime: `${hour.toString().padStart(2, "0")}:00`,
                      });
                    }}
                  >
                    {daySessions.map((session) => (
                      <div key={session.id} className="mb-2">
                        <DraggableSessionCard
                          session={session}
                          onEdit={() => onSessionClick(session.id)}
                        />
                      </div>
                    ))}
                  </DroppableCalendarCell>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    // Get all days needed for the month grid (including days from prev/next months to fill the grid)
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });

    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Split days into weeks
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    allDays.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return (
      <div className="bg-white">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 h-[600px]">
          {allDays.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const daySessions = getSessionsForDay(day);

            return (
              <div
                key={day.toString()}
                className={`border p-1 min-h-[100px] ${!isCurrentMonth ? "bg-gray-50" : ""}`}
                onClick={() => onDateClick(day)}
              >
                <div
                  className={`text-right mb-1 ${!isCurrentMonth ? "text-gray-400" : ""} ${isToday ? "font-bold" : ""}`}
                >
                  <span
                    className={`inline-block w-6 h-6 text-center ${isToday ? "bg-primary text-white rounded-full" : ""}`}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <div className="overflow-y-auto max-h-[80px]">
                  {daySessions.slice(0, 3).map((session) => (
                    <div
                      key={session.id}
                      className="text-xs p-1 mb-1 rounded truncate"
                      style={{
                        backgroundColor: session.color || "#2196F3",
                        color: "white",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSessionClick(session.id);
                      }}
                    >
                      {format(session.startTime, "h:mm a")} -{" "}
                      {session.studentName}
                    </div>
                  ))}
                  {daySessions.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{daySessions.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="w-full h-full bg-background rounded-xl shadow-sm border border-gray-200">
        <div className="p-4">
          {/* Calendar header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-800">
                {view === "day" && format(currentDate, "MMMM d, yyyy")}
                {view === "week" &&
                  `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`}
                {view === "month" && format(currentDate, "MMMM yyyy")}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={previousPeriod}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={nextPeriod}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="default" size="sm" onClick={() => handleOpenSessionModal()}>
                + Add Session
              </Button>
            </div>
          </div>
          {/* Calendar content */}
          <div className="border rounded-lg overflow-hidden bg-white">
            {view === "day" && renderDayView()}
            {view === "week" && renderWeekView()}
            {view === "month" && renderMonthView()}
          </div>
          {/* Modal for session creation/editing */}
          <SessionForm
            open={sessionModalOpen}
            onOpenChange={setSessionModalOpen}
            onSubmit={handleSessionFormSubmit}
            initialData={sessionModalInitialData}
          />
        </div>
      </Card>
    </DndProvider>
  );
};

export default Calendar;
