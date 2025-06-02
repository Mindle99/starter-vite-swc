import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, Video, AlertCircle } from "lucide-react";
import { createSession } from "@/lib/supabaseApi";

interface SessionFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (sessionData: any) => void;
  initialData?: any;
}

const SessionForm = ({
  open = true,
  onOpenChange,
  onSubmit,
  initialData,
}: SessionFormProps) => {
  const [date, setDate] = useState<Date | undefined>(
    initialData?.date || new Date(),
  );
  const [startTime, setStartTime] = useState(initialData?.startTime || "09:00");
  const [duration, setDuration] = useState(initialData?.duration || "60");
  const [sessionType, setSessionType] = useState(
    initialData?.sessionType || "virtual",
  );
  const [student, setStudent] = useState(initialData?.student || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [isRecurring, setIsRecurring] = useState(
    initialData?.isRecurring || false,
  );
  const [recurrencePattern, setRecurrencePattern] = useState(
    initialData?.recurrencePattern || "weekly",
  );

  // Mock data for dropdowns
  const students = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Alex Johnson" },
  ];

  const subjects = [
    { id: "1", name: "Mathematics" },
    { id: "2", name: "English" },
    { id: "3", name: "Science" },
    { id: "4", name: "History" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if there's a conflict (this would be a real check in production)
    const hasConflict = false;

    if (hasConflict) {
      // Show conflict warning
      alert("There is a scheduling conflict. Please choose another time.");
      return;
    }

    const sessionData = {
      date,
      startTime,
      duration,
      sessionType,
      student,
      subject,
      location,
      notes,
      isRecurring,
      recurrencePattern: isRecurring ? recurrencePattern : null,
    };

    // Save to Supabase
    const { error } = await createSession(sessionData);
    if (error) {
      alert("Failed to create session: " + error.message);
      return;
    }

    if (onSubmit) {
      onSubmit(sessionData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {initialData ? "Edit Session" : "Schedule New Session"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Selection */}
          <div className="space-y-2">
            <Label htmlFor="student">Student</Label>
            <Select value={student} onValueChange={setStudent}>
              <SelectTrigger id="student">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Session Type */}
          <div className="space-y-2">
            <Label>Session Type</Label>
            <RadioGroup
              value={sessionType}
              onValueChange={setSessionType}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="virtual" id="virtual" />
                <Label htmlFor="virtual" className="flex items-center">
                  <Video className="mr-1 h-4 w-4" /> Virtual
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-person" id="in-person" />
                <Label htmlFor="in-person" className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" /> In-person
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Location or Link */}
          <div className="space-y-2">
            <Label htmlFor="location">
              {sessionType === "virtual" ? "Meeting Link" : "Location"}
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={
                sessionType === "virtual"
                  ? "https://zoom.us/j/123456789"
                  : "Address or location details"
              }
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recurring Session */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="recurring">Recurring Session</Label>
              <Switch
                id="recurring"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
            </div>

            {isRecurring && (
              <div className="pl-4 border-l-2 border-gray-200 mt-2">
                <Label htmlFor="recurrencePattern">Recurrence Pattern</Label>
                <Select
                  value={recurrencePattern}
                  onValueChange={setRecurrencePattern}
                >
                  <SelectTrigger id="recurrencePattern">
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>

                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md flex items-start">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 mr-2" />
                  <p className="text-xs text-amber-800">
                    This will create multiple sessions following this pattern.
                    You can edit individual sessions later.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Session Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Session Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any preparation notes or materials needed for this session"
              rows={3}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange && onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Update Session" : "Schedule Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SessionForm;
