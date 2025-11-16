import { Star } from "lucide-react";
import type { DiscoverLocationDetail } from "@/features/types";

const numberFormatter = new Intl.NumberFormat("en-US");

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

const renderStars = (rating: number) => (
  <div className="flex items-center gap-0.5 text-amber-400">
    {Array.from({ length: 5 }).map((_, index) => {
      const isFilled = rating >= index + 1;
      const isHalf = !isFilled && rating > index && rating < index + 1;
      return (
        <Star
          key={index}
          className={`h-3.5 w-3.5 ${
            isFilled ? "fill-current" : isHalf ? "fill-current opacity-50" : ""
          }`}
        />
      );
    })}
  </div>
);

interface LocationInfoProps {
  markerDescription: string;
  markerAddress: string;
  detail?: DiscoverLocationDetail | null;
  markerName?: string;
  hideTitle?: boolean;
  variant?: "default" | "compact";
}

const LocationInfo = ({
  markerDescription,
  markerAddress,
  detail,
  markerName,
  hideTitle = false,
  variant = "default",
}: LocationInfoProps) => {
  const formatDistanceLabel = (label?: string | null) => {
    if (!label) return label ?? "";
    return label.replace(/\b(\d+)\s+min\b/gi, "$1m");
  };

  const computeHoursMeta = (hours?: DiscoverLocationDetail["hours"]) => {
    if (!hours) return null;
    const createDate = (time: string) => {
      const [hoursStr, minutesStr] = time.split(":");
      const date = new Date();
      date.setHours(Number(hoursStr) || 0, Number(minutesStr) || 0, 0, 0);
      return date;
    };
    const now = new Date();
    const openDate = createDate(hours.open);
    const closeDate = createDate(hours.close);
    if (closeDate <= openDate) {
      closeDate.setDate(closeDate.getDate() + 1);
    }
    let isOpen = false;
    let label: string;
    if (now >= openDate && now < closeDate) {
      isOpen = true;
      label = `Closes ${timeFormatter.format(closeDate)}`;
    } else {
      if (now >= closeDate) {
        openDate.setDate(openDate.getDate() + 1);
      }
      label = `Opens ${timeFormatter.format(openDate)}`;
    }
    return { isOpen, label };
  };

  const hoursMeta = computeHoursMeta(detail?.hours);
  const formattedDistance = detail?.distance ? formatDistanceLabel(detail.distance) : "";
  const isCompact = variant === "compact";

  return (
    <div className={isCompact ? "space-y-1.5 text-sm" : "space-y-1"}>
      {!hideTitle && markerName ? (
        <p className="text-lg font-semibold text-neutral-950">{markerName}</p>
      ) : null}
      {detail ? (
        <>
          <div className="flex flex-wrap items-center gap-1 text-sm text-neutral-500">
            <span className="text-sm font-base text-neutral-70">
              {detail.rating.toFixed(1)}
            </span>
            {renderStars(detail.rating)} ({numberFormatter.format(detail.reviewCount)})
            <span>
              · {detail.priceRange}
            </span>
          </div>
          <p className="text-sm font-base text-neutral-950">{detail.cuisine}</p>
          {isCompact ? (
            <div className="flex flex-wrap items-center gap-1 text-sm text-neutral-600">
              {hoursMeta ? (
                <>
                  <span className={hoursMeta.isOpen ? "text-emerald-600" : "text-red-700"}>
                    {hoursMeta.isOpen ? "Open now" : "Closed"}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-neutral-900">{hoursMeta.label}</span>
                </>
              ) : null}
              {hoursMeta && formattedDistance ? <span className="text-slate-400">·</span> : null}
              {formattedDistance ? (
                <span className="text-neutral-600">{formattedDistance}</span>
              ) : null}
            </div>
          ) : (
            <>
              {hoursMeta ? (
                <div className="flex flex-wrap items-center gap-1 text-sm">
                  <span
                    className={
                      hoursMeta.isOpen ? "font-base text-emerald-600" : "font-base text-red-700"
                    }
                  >
                    {hoursMeta.isOpen ? "Open now" : "Closed"}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-base text-neutral-950">{hoursMeta.label}</span>
                </div>
              ) : null}
              <p className="text-sm text-neutral-500">{formattedDistance}</p>
            </>
          )}
        </>
      ) : (
        <>
          <p className="text-sm text-slate-700">{markerDescription}</p>
          <p className="text-xs uppercase tracking-wide text-slate-400">{markerAddress}</p>
        </>
      )}
    </div>
  );
};

export default LocationInfo;
