"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EventsByCountryCount } from "@/domains/analytics";
import { LoadingResult } from "@/domains/shared/types";
import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";

function mapCountToLogOpacity(
  count: number,
  minCount: number,
  maxCount: number,
  minOpacity = 0.3,
  maxOpacity = 1.0,
) {
  // ensure positive values for log
  const c = Math.max(count, 1);
  const lo = Math.max(minCount, 1);
  const hi = Math.max(maxCount, 1);

  const logLo = Math.log(lo);
  const logHi = Math.log(hi);
  const logC = Math.log(c);

  // normalize into [0,1], avoid div-by-zero
  const t = (logC - logLo) / (logHi - logLo || 1);

  // interpolate into [minOpacity, maxOpacity]
  const opacity = minOpacity + t * (maxOpacity - minOpacity);
  return Math.min(Math.max(opacity, minOpacity), maxOpacity);
}

const geoUrl =
  "https://raw.githubusercontent.com/BolajiBI/topojson-maps/refs/heads/master/world-countries-sans-antarctica.json";

export function Map(props: LoadingResult<EventsByCountryCount[]>) {
  const [tooltipContent, setTooltipContent] = useState<{
    country: string;
    count: number;
  } | null>();

  if (props.isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Locations</CardTitle>
          <CardDescription>Countries with recorded activity</CardDescription>
        </CardHeader>
        <CardContent className="h-full">
          {" "}
          <Skeleton className="w-full h-88" />
        </CardContent>
      </Card>
    );
  }

  const results = props.result;
  const maxCount = Math.max(...results.map((r) => Number(r.eventCount)));
  const minCount = Math.min(...results.map((r) => Number(r.eventCount)));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Locations</CardTitle>
        <CardDescription>Countries with recorded activity</CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <div id="map">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 100,
              center: [0, 45],
            }}
            width={800}
            height={400}
            className="h-full w-full"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) => {
                return geographies.map((geo) => {
                  const result = results.find(
                    (r) => r.countryCode === geo.properties["Alpha-2"],
                  );
                  const isHighlighted = !!result;
                  const opacity = result
                    ? mapCountToLogOpacity(
                        Number(result.eventCount),
                        minCount,
                        maxCount,
                      )
                    : 1;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isHighlighted ? "#FF5722" : "#DDD"}
                      onMouseEnter={() => {
                        if (result) {
                          setTooltipContent({
                            country: geo.properties.name,
                            count: result.eventCount,
                          });
                        }
                      }}
                      onMouseLeave={() => {
                        setTooltipContent(null);
                      }}
                      opacity={opacity}
                    />
                  );
                });
              }}
            </Geographies>
          </ComposableMap>
        </div>
        <ReactTooltip
          anchorSelect="#map"
          float
          className="bg-white !opacity-100 rounded-lg shadow-lg p-2 text-sm"
          disableStyleInjection={true}
        >
          {tooltipContent ? (
            <>
              <span className="font-semibold mr-2">
                {tooltipContent.country}
              </span>
              <span className="font-mono">{tooltipContent.count}</span>
            </>
          ) : null}
        </ReactTooltip>
      </CardContent>
    </Card>
  );
}
