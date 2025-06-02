import React, { useState } from "react";
import Calendar from "./scheduling/Calendar";
import SessionForm from "./scheduling/SessionForm";
import UpcomingSessions from "./scheduling/UpcomingSessions";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Plus } from "lucide-react";

const Home = () => {
  const [isSessionFormOpen, setIsSessionFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<"day" | "week" | "month">("week");

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsSessionFormOpen(true);
  };

  const handleCreateSession = () => {
    setIsSessionFormOpen(true);
  };

  const handleCloseSessionForm = () => {
    setIsSessionFormOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant={view === "day" ? "default" : "outline"}
              onClick={() => setView("day")}
              size="sm"
            >
              Day
            </Button>
            <Button
              variant={view === "week" ? "default" : "outline"}
              onClick={() => setView("week")}
              size="sm"
            >
              Week
            </Button>
            <Button
              variant={view === "month" ? "default" : "outline"}
              onClick={() => setView("month")}
              size="sm"
            >
              Month
            </Button>
          </div>
          <Button onClick={handleCreateSession}>
            <Plus className="mr-2 h-4 w-4" /> New Session
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar */}
        <div className="flex-1 overflow-auto p-4">
          <Calendar
            view={view}
            onDateClick={handleDateSelect}
            onCreateSession={handleDateSelect}
          />
        </div>

        {/* Sidebar */}
        <aside className="w-80 border-l p-4 overflow-y-auto hidden md:block">
          <UpcomingSessions />
        </aside>
      </div>

      {/* Session Form Dialog */}
      <Dialog open={isSessionFormOpen} onOpenChange={setIsSessionFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDate ? "Schedule Session" : "Create New Session"}
            </DialogTitle>
          </DialogHeader>
          <SessionForm
            selectedDate={selectedDate}
            onClose={handleCloseSessionForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
