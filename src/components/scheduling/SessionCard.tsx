import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Edit, X } from "lucide-react";
import { usePrivacy } from "../PrivacyProvider";
import { maskPII } from "@/lib/maskPII";

interface SessionCardProps {
  id?: string;
  studentName?: string;
  subject?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  sessionType?: "virtual" | "in-person";
  color?: string;
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
}

const SessionCard = ({
  id = "123",
  studentName = "Alex Johnson",
  subject = "Mathematics",
  startTime = "3:00 PM",
  endTime = "4:00 PM",
  duration = "60 min",
  sessionType = "virtual",
  color = "#4CAF50",
  onEdit = () => {},
  onCancel = () => {},
  onComplete = () => {},
}: SessionCardProps) => {
  const { preferences } = usePrivacy();
  // Example: split studentName for masking
  const [firstName, lastName] = studentName.split(" ");
  const maskedFirst = maskPII(firstName, "firstName", preferences.firstName);
  const maskedLast = lastName ? maskPII(lastName, "lastName", preferences.lastName) : "";
  const maskedStudentName = maskedFirst + (maskedLast ? ` ${maskedLast}` : "");

  return (
    <Card
      className="w-[280px] h-[120px] overflow-hidden border-l-4 bg-white"
      style={{ borderLeftColor: color }}
    >
      <CardContent className="p-3">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="font-medium text-sm">{maskedStudentName}</h3>
              <p className="text-xs text-muted-foreground">{subject}</p>
            </div>
            <Badge
              variant={sessionType === "virtual" ? "secondary" : "outline"}
              className="text-xs"
            >
              {sessionType}
            </Badge>
          </div>

          <div className="text-xs text-muted-foreground mb-2">
            {startTime} - {endTime} ({duration})
          </div>

          <div className="flex justify-end mt-auto gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onEdit(id)}
              title="Edit session"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              onClick={() => onCancel(id)}
              title="Cancel session"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-green-600 hover:text-green-700"
              onClick={() => onComplete(id)}
              title="Complete session"
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
