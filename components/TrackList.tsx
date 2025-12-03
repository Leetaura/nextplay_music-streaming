"use client";

import { Track } from "@/lib/types";
import TrackCard from "./TrackCard";

interface TrackListProps {
  tracks: Track[];
  title?: string;
}

export default function TrackList({ tracks, title }: TrackListProps) {
  if (!tracks || tracks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <TrackCard key={track.id} track={track} index={index} />
        ))}
      </div>
    </div>
  );
}
