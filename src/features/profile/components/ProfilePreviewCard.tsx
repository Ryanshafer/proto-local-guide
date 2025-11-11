import * as React from "react";
import { CalendarDays } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const DEFAULT_AVATAR =
  "https://www.figma.com/api/mcp/asset/7a85a590-2423-4806-97d1-3381e7fb77de";

export interface ProfilePreviewCardProps {
  handle: string;
  description: string;
  joinedLabel?: string;
  avatarSrc?: string;
}

const ProfilePreviewCard: React.FC<ProfilePreviewCardProps> = ({
  handle,
  description,
  joinedLabel = "Joined December 2021",
  avatarSrc = DEFAULT_AVATAR,
}) => {
  return (
    <Card className="flex w-full max-w-xs items-start gap-6 border border-border bg-card/95 p-6 shadow-lg">
      <img
        src={avatarSrc}
        alt={`${handle} profile avatar`}
        width={40}
        height={40}
        className="h-10 w-10 rounded-full object-cover"
      />
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-ink-strong">{handle}</p>
          <p className="text-sm text-ink-strong">{description}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          <span>{joinedLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePreviewCard;
