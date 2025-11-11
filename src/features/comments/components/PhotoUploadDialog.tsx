import * as React from "react";
import { CloudUpload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const UPLOAD_DELAY_MS = 1200;

const PhotoUploadDialog: React.FC = () => {
  const [isPending, setIsPending] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const resetDialog = React.useCallback(() => {
    setIsPending(false);
    setOpen(false);
  }, []);

  const handleUpload = React.useCallback(() => {
    setIsPending(true);
    timeoutRef.current = setTimeout(() => {
      resetDialog();
    }, UPLOAD_DELAY_MS);
  }, [resetDialog]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <CloudUpload aria-hidden="true" className="size-4" />
          <span>Set a photo</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a new photo</DialogTitle>
          <DialogDescription>
            Choose an image to associate with this comment. We support PNG, JPG, and WebP up to 2MB.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md border border-dashed border-border/80 bg-card/40 p-6 text-sm text-muted-foreground">
          Drag a file here, or click the button below to browse from your device.
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={resetDialog}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleUpload} disabled={isPending}>
            {isPending ? "Uploading…" : "Upload photo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploadDialog;
