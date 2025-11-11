import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import PhotoUploadDialog from "./PhotoUploadDialog";
import SelectDay, { capitalize } from "./SelectDay";
import type { CommentCardState } from "../hooks/useCommentCards";

const MotionCard = motion(Card);

const AVATAR_SRC =
  "https://www.figma.com/api/mcp/asset/52d66495-d5be-4d76-8239-02e6d99a8604";

export interface CommentCardProps {
  state: CommentCardState;
  onChange: (next: CommentCardState) => void;
  onCancel?: (id: string) => void;
  avatarSrc?: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  state,
  onChange,
  onCancel,
  avatarSrc = AVATAR_SRC,
}) => {
  const isDraft = state.mode === "draft";
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const textareaId = `${state.id}-comment`;
  const selectTriggerId = `${state.id}-day`;
  const selectLabelId = `${state.id}-day-label`;
  const previousModeRef = React.useRef(state.mode);

  React.useEffect(() => {
    if (previousModeRef.current === state.mode) {
      return;
    }

    if (state.mode === "draft") {
      textareaRef.current?.focus();
    } else {
      menuButtonRef.current?.focus();
    }

    previousModeRef.current = state.mode;
  }, [state.mode]);

  const submitDraft = React.useCallback(() => {
    onChange({
      ...state,
      mode: "collapsed",
      savedComment: state.comment,
      savedDay: state.day,
    });
  }, [onChange, state]);

  const handleSubmit = React.useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      submitDraft();
    },
    [submitDraft]
  );

  const handleCancel = React.useCallback(() => {
    onChange({
      ...state,
      comment: state.savedComment,
      day: state.savedDay,
      mode: "collapsed",
    });
    onCancel?.(state.id);
  }, [onCancel, onChange, state]);

  const handleEdit = React.useCallback(() => {
    onChange({
      ...state,
      comment: state.savedComment,
      day: state.savedDay,
      mode: "draft",
    });
  }, [onChange, state]);

  const handleCommentChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({ ...state, comment: event.target.value });
    },
    [onChange, state]
  );

  const handleDayChange = React.useCallback(
    (value: string) => {
      onChange({ ...state, day: value });
    },
    [onChange, state]
  );

  return (
    <MotionCard
      layout
      className="w-full max-w-3xl overflow-hidden border border-border bg-surface shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
      transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDraft ? (
          <motion.div
            key="draft"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <CardHeader className="space-y-5 px-12 pt-12 pb-4">
              <CardTitle className="text-display-lg font-extrabold leading-display-lg tracking-display-lg text-ink-strong">
                Warning
              </CardTitle>
              <p className="text-title-md font-semibold leading-title-md tracking-title-md text-ink-strong">
                Comment missing from post.
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-10 px-12 pb-12 pt-0">
              <div className="flex items-center gap-8">
                <img
                  src={avatarSrc}
                  alt="Profile avatar"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <PhotoUploadDialog />
              </div>

              <div className="flex items-center gap-8 text-base text-ink-strong">
                <Label
                  id={selectLabelId}
                  htmlFor={selectTriggerId}
                  className="text-lg font-semibold"
                >
                  Select a day:
                </Label>
                <SelectDay
                  value={state.day}
                  onValueChange={handleDayChange}
                  className="w-56"
                  triggerId={selectTriggerId}
                  labelledBy={selectLabelId}
                />
              </div>

              <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3">
                  <Label htmlFor={textareaId} className="text-lg font-semibold">
                    Your comment
                  </Label>
                  <Textarea
                    id={textareaId}
                    placeholder="Type your message here"
                    value={state.comment}
                    onChange={handleCommentChange}
                    className="min-h-[140px] w-full rounded-lg border border-border"
                    ref={textareaRef}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        (event.metaKey || event.ctrlKey)
                      ) {
                        event.preventDefault();
                        handleSubmit();
                      }
                      if (event.key === "Escape") {
                        event.preventDefault();
                        handleCancel();
                      }
                    }}
                  />
                </div>
                <div className="flex items-center justify-end gap-6">
                  <Button type="button" variant="ghost" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save comment
                  </Button>
                </div>
              </form>
            </CardContent>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <CardContent className="flex items-center justify-between gap-6 px-12 py-6">
              <div className="flex items-center gap-6">
                <img
                  src={avatarSrc}
                  alt="Profile avatar"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="space-y-1">
                  <p className="text-2xl font-normal text-ink-strong">
                    {state.savedComment.trim() || "This is the comment that I added."}
                  </p>
                  <p className="text-base text-ink-muted">
                    Added {capitalize(state.savedDay)}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 w-9 rounded-full border-border p-0"
                    ref={menuButtonRef}
                  >
                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Open message actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={handleEdit}>
                    Edit this message
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionCard>
  );
};

export default CommentCard;
