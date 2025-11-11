import {
  AnalyticsQuery,
  AnalyticsReportQuerySchema,
} from "@/schemas/analytics";
import {
  getCountDistinctCountriesForReport,
  getEventsForReport,
  getTopArticlesForReport,
  getTopSearchesForReport,
} from "@/services/analytics";
import { format } from "date-fns";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedParams = AnalyticsReportQuerySchema.parse(body);
    const query: AnalyticsQuery = {
      ...parsedParams,
      sortBy: "occuredAt",
      sortDirection: "desc",
    };

    let data: any[] = [];
    let filename = "";

    switch (parsedParams.reportType) {
      case "events":
      default:
        data = await getEventsForReport(query);
        filename = "events-export";
        break;
      case "top-articles":
        data = await getTopArticlesForReport(query);
        filename = "top-articles-export";
        break;
      case "top-searches":
        data = await getTopSearchesForReport(query);
        filename = "top-searches-export";
        break;
      case "locations":
        data = await getCountDistinctCountriesForReport(query);
        filename = "locations-export";
        break;
    }

    const csvData = convertToCSV(data);

    return new Response(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}-${format(new Date(), "yyyy-MM-dd")}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting analytics data:", error);
    return new Response("Failed to export data", { status: 500 });
  }
}

function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) {
    return "No data available";
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  const csvRows = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Handle null/undefined values and escape quotes
          const stringValue = value == null ? "" : String(value);
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          return stringValue.includes(",") ||
            stringValue.includes('"') ||
            stringValue.includes("\n")
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue;
        })
        .join(","),
    ),
  ];

  return csvRows.join("\n");
}
