/**
 * Dedicated top sheet for marker details on mobile layouts.
 * Shares content structure with MarkerCard but adds swipe-to-dismiss behavior.
 */
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { Navigation } from "lucide-react";
import type {
  DiscoverLocation,
  DiscoverLocationDetail,
} from "@/features/types";
import detailsData from "@/data/discover-details.json";
import LocationInfo from "./LocationInfo";

type TopSheetProps = {
  marker: DiscoverLocation | null;
  isOpen: boolean;
  onDismiss: () => void;
};

const detailsMap = detailsData as Record<string, DiscoverLocationDetail>;

const NAV_SAFE_OFFSET_REM = 0; // Allow sheet to cover the discover bottom sheet completely.
const SHEET_MAX_HEIGHT = "60dvh";
const SHEET_MIN_HEIGHT = "18rem";

const TopSheet = ({ marker, isOpen, onDismiss }: TopSheetProps) => {
  const detail = marker ? detailsMap[marker.id] : null;

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 60 || info.velocity.y > 400) {
      onDismiss();
    }
  };

  const buildDirectionsUrl = (location: DiscoverLocation | null) => {
    if (!location) return null;
    const { latitude, longitude, name } = location;
    if (typeof navigator !== "undefined" && /iPhone|iPad|Macintosh/.test(navigator.userAgent)) {
      return `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${encodeURIComponent(name)}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  };

  const handleDirections = () => {
    const url = buildDirectionsUrl(marker);
    if (!url) return;
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <AnimatePresence>
      {marker && isOpen ? (
        <motion.div
          key={marker.id}
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 64 }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="pointer-events-none absolute inset-x-0 z-20 flex justify-center"
          style={{ bottom: `${NAV_SAFE_OFFSET_REM}rem` }}
        >
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 140 }}
            dragElastic={0.12}
            onDragEnd={handleDragEnd}
            className="pointer-events-auto w-full max-w-md overflow-hidden rounded-t-3xl border border-white/70 bg-white shadow-2xl"
            style={{
              maxHeight: SHEET_MAX_HEIGHT,
              minHeight: SHEET_MIN_HEIGHT,
            }}
          >
            <div className="flex h-full flex-col pb-6">
              <div className="relative px-6">
                <button
                  type="button"
                  aria-label="Dismiss details"
                  onClick={onDismiss}
                  className="flex w-full flex-col items-center gap-1 pb-3 pt-3 text-slate-700"
                >
                  <span className="mx-auto h-1.5 w-12 rounded-full bg-slate-300" />
                </button>
                {detail?.photo ? (
                  <img
                    src={detail.photo}
                    alt={marker.name}
                    className="h-36 w-full rounded-2xl object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-36 w-full items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    No photo available
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto px-6 pt-4 text-slate-700">
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-slate-900">{marker.name}</p>
                </div>
                <div className="mt-1">
                <LocationInfo
                  markerDescription={marker.description}
                  markerAddress={marker.address}
                  detail={detail}
                  hideTitle
                  variant="compact"
                />
                </div>
                <button
                  type="button"
                  onClick={handleDirections}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default TopSheet;
