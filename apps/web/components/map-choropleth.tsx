"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import { useEffect, useRef } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

export interface ChoroplethFeature {
  readonly id: string;
  readonly geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
  readonly value: number;
}

interface MapChoroplethProps {
  readonly features: readonly ChoroplethFeature[];
}

const tokenToHex = (token: string): string => {
  if (typeof window === "undefined") {
    return "#FFFFFF";
  }
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  const match = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(value);
  if (!match) {
    return "#FFFFFF";
  }
  const [, r, g, b] = match;
  const toHex = (component: string) => Number.parseInt(component, 10).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export function MapChoropleth({ features }: MapChoroplethProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || !process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      return;
    }
    if (mapRef.current) {
      return;
    }

    // Mapbox GL requires hex values; convert from token palette.
    const primary = tokenToHex("--chart-1");
    const accent = tokenToHex("--chart-4");
    const outline = tokenToHex("--foreground");

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      attributionControl: false,
    });

    map.on("load", () => {
      const geojson: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
        type: "FeatureCollection",
        features: features.map((feature) => ({
          type: "Feature",
          geometry: feature.geometry,
          properties: {
            value: feature.value,
          },
          id: feature.id,
        })),
      };

      map.addSource("regions", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "regions-fill",
        type: "fill",
        source: "regions",
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "value"],
            0,
            primary,
            1,
            accent,
          ],
          "fill-opacity": 0.65,
        },
      });

      map.addLayer({
        id: "regions-outline",
        type: "line",
        source: "regions",
        paint: {
          "line-color": outline,
          "line-width": 1,
        },
      });

      if (features.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        geojson.features.forEach((feature) => {
          if (feature.geometry?.type === "Polygon") {
            feature.geometry.coordinates[0].forEach((coord) => bounds.extend(coord as mapboxgl.LngLatLike));
          } else if (feature.geometry?.type === "MultiPolygon") {
            feature.geometry.coordinates.forEach((polygon) =>
              polygon[0]?.forEach((coord) => bounds.extend(coord as mapboxgl.LngLatLike)),
            );
          }
        });
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 40 });
        }
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [features]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-xl border border-border bg-secondary text-secondary-foreground">
        <p>Provide MAPBOX_TOKEN to enable interactive map rendering.</p>
      </div>
    );
  }

  return <div ref={containerRef} className="h-72 w-full rounded-xl border border-border shadow-[var(--shadow-sm)]" />;
}

