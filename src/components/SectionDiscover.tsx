/**
 * This prototype component is designed for rapid iteration.
 * When moving to production:
 * - Replace mock data imports with API hooks or GraphQL queries.
 * - Extract shared layout (e.g., BottomSheet) into reusable hooks.
 * - Move map state management into a context provider if global state is needed.
 */
import { useEffect, useMemo, useState } from "react";

import MapView from "./SectionDiscover/MapView";
import BottomSheet from "./SectionDiscover/BottomSheet";
import TopSheet from "./SectionDiscover/TopSheet";
// Temporary mock data — replace with backend response or CMS integration.
import discoverData from "@/data/discover.json";
import type { DiscoverCategory, DiscoverLocation } from "@/features/types";

const MAP_VIEWPORT_MIN_HEIGHT = "max(32rem, calc(100dvh - 5.5rem))";
const NAV_SAFE_OFFSET_PX = 0; // Matches ~pb-24 to clear the bottom nav.

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

const SectionDiscover = () => {
  const [sheetState, setSheetState] = useState<"collapsed" | "expanded">(
    "collapsed",
  );
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [activeSegment, setActiveSegment] = useState<DiscoverCategory | "all">(
    "all",
  );
  const [isDesktopSheet, setIsDesktopSheet] = useState(false);
  const [isTopSheetVisible, setIsTopSheetVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mediaQueryList = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktopSheet(event.matches);
    };
    handleChange(mediaQueryList);
    mediaQueryList.addEventListener("change", handleChange);
    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    setSheetState(isDesktopSheet ? "expanded" : "collapsed");
  }, [isDesktopSheet]);

  const locations = discoverData as DiscoverLocation[];

  const groupedByCategory = useMemo(() => {
    return locations.reduce(
      (acc, item) => {
        acc[item.category].push(item as DiscoverLocation);
        return acc;
      },
      {
        restaurant: [] as DiscoverLocation[],
        beach: [] as DiscoverLocation[],
        nightlife: [] as DiscoverLocation[],
        activity: [] as DiscoverLocation[],
      },
    );
  }, []);

  const filteredLocations = useMemo(() => {
    if (activeSegment === "all") return locations;
    return locations.filter((item) => item.category === activeSegment);
  }, [locations, activeSegment]);

  const activeMarker = useMemo(
    () => locations.find((item) => item.id === activeMarkerId) ?? null,
    [activeMarkerId],
  );

  useEffect(() => {
    if (!activeMarkerId) return;
    if (!filteredLocations.some((location) => location.id === activeMarkerId)) {
      setActiveMarkerId(null);
    }
  }, [filteredLocations, activeMarkerId]);

  const handleMarkerSelect = (id: string) => {
    setActiveMarkerId(id);
    if (!isDesktopSheet) {
      setIsTopSheetVisible(true);
      setSheetState("collapsed");
    }
  };

  const shouldOffsetMap = Boolean(
    !isDesktopSheet && isTopSheetVisible && activeMarkerId,
  );
  const mapMarkers =
    shouldOffsetMap && activeMarker ? [activeMarker] : filteredLocations;

  const clearActiveMarker = () => {
    setActiveMarkerId(null);
    setIsTopSheetVisible(false);
  };

  const handleTopSheetDismiss = () => {
    clearActiveMarker();
    if (!isDesktopSheet) {
      setSheetState("expanded");
    }
  };

  useEffect(() => {
    if (!activeMarkerId) {
      setIsTopSheetVisible(false);
    }
  }, [activeMarkerId]);

  useEffect(() => {
    if (isDesktopSheet) {
      setIsTopSheetVisible(false);
    }
  }, [isDesktopSheet]);

  return (
    <section
      className="relative h-full w-full overflow-hidden"
      style={{ minHeight: MAP_VIEWPORT_MIN_HEIGHT }}
    >
      <div className="absolute inset-0 z-0">
        <MapView
          markers={mapMarkers}
          selectedMarkerId={activeMarkerId}
          onMarkerSelect={handleMarkerSelect}
          offsetForOverlay={shouldOffsetMap}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end">
        <div className="pb-0">
          <BottomSheet
            groupedMarkers={groupedByCategory}
            state={sheetState}
            onStateChange={setSheetState}
            onMarkerFocus={handleMarkerSelect}
            activeMarkerId={activeMarkerId}
            bottomSafeOffset={NAV_SAFE_OFFSET_PX}
            activeSegment={activeSegment}
            onSegmentChange={setActiveSegment}
            allMarkers={locations}
            isDesktopLayout={isDesktopSheet}
            activeMarker={activeMarker ?? null}
            onMarkerClear={clearActiveMarker}
          />
        </div>
      </div>

      {!isDesktopSheet && activeMarker ? (
        <TopSheet
          marker={activeMarker}
          isOpen={isTopSheetVisible}
          onDismiss={handleTopSheetDismiss}
        />
      ) : null}
    </section>
  );
};

export default SectionDiscover;
