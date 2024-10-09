import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { UrlQueryParams, RemoveUrlQueryParams } from "@/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DateTime } from "luxon";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

export function formatDate(dateString: Date | string | null) {
  if (!dateString) {
    return ""; // or you can return a default value like 'N/A'
  }
  const date = DateTime.fromISO(dateString.toString());
  return date.toFormat("MM / dd / yyyy");
}

export function formatTime(timeString: string | null) {
  if (!timeString) {
    return ""; // or you can return a default value like 'N/A'
  }
  const time = DateTime.fromFormat(timeString, "HH:mm");
  return time.toFormat("h:mm a");
}

export const formatTableTime = (timeString: any) => {
  const now = new Date();
  const [hours, minutes] = timeString.toString().split(':').map(Number);

  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const formattedTimeWithoutSpace = formattedTime.replace(/([\d]+:[\d]+)\s([aApP][mM])/, '$1$2');

  return formattedTimeWithoutSpace.toLowerCase();
};

export const formatCreatedTime = (dateTimeString: string) => {
  // Parse the date-time string into a Date object
  const date = new Date(dateTimeString);


  // Format the time to the desired format
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Remove the space between the time and the AM/PM marker and convert to lowercase
  const formattedTimeWithoutSpace = formattedTime.replace(/([\d]+:[\d]+)\s([aApP][mM])/, '$1$2').toLowerCase();

  return formattedTimeWithoutSpace;
};

// Example usage
const dateTimeString = '2024-05-02T23:34:32.957Z';
const formattedTime = formatCreatedTime(dateTimeString);
console.log(formattedTime); // Output: "7:00am"


export function formatTableDate(dateString: string | number | Date): string {
  // Create a new Date object from the provided date
  const date = new Date(dateString);

  // Get the month, day, and year
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  // Format the date
  const formattedDate = `${month} ${day}, ${year}`;

  return formattedDate;
};


export async function downloadPdf(jsonFile: any, props: any, variant: string) {
  const doc = new jsPDF({ orientation: 'landscape' });

  const columns = props.map((prop: any) => ({ header: prop, dataKey: prop }));

  const data = jsonFile.map((row: any) => {
    let newRow: any = {};
    props.forEach((prop: any) => {
      newRow[prop] = row[prop];
    });
    return newRow;
  });

  // Calculate the total table width to be the width of the PDF page
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20; // Assume a margin of 20 units on each side
  const availableWidth = pageWidth - margin * 2;

  // Adjust cell widths proportionally to fill the table width
  const columnCount = columns.length;
  const cellWidth = availableWidth / columnCount;

  autoTable(doc, {
    head: [columns.map((col: { header: string }) => col.header)],
    body: data.map((row: { [x: string]: any }) =>
      columns.map((col: { dataKey: string }) => {
        const cellContent = String(row[col.dataKey]);
        const fontSize = Math.max(8, 10 - (cellContent.length / 10));
        return { content: cellContent, styles: { minCellWidth: cellWidth, fontSize: fontSize } };
      })
    ),
    styles: { cellPadding: 1, fontSize: 10 },
    margin: { top: 20, left: margin, right: margin },
    theme: 'striped',
    tableWidth: 'auto', // Automatically adjust table width
    columnStyles: {
      0: { cellWidth: cellWidth }, // Apply calculated width to the first column
      // Add more column styles if needed
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.row.index === data.table.body.length - 1) {
        data.cell.styles.fillColor = [255, 255, 255];
      }
    },
  });

  doc.save(`${variant}.pdf`);
}


export function formatCreatedAtDate(isoString: string) {
  const date = DateTime.fromISO(isoString);
  if (!isoString) {
    return ""; // or you can return a default value like 'N/A'
  }
  if (!date.isValid) {
    console.error('Invalid date:', isoString, date.invalidReason);
    return 'Invalid date';
  }
  return `${date.toLocaleString(DateTime.DATE_MED)}`;
}

export function formatCreatedAtTime(isoString: string) {
  const time = DateTime.fromISO(isoString);
  if (!time.isValid) {
    console.error('Invalid time:', isoString, time.invalidReason);
    return 'Invalid time';
  }
  return time.toLocaleString(DateTime.TIME_SIMPLE); // Customize the format as needed
}

export function timeElapsed(dateString: string, timeString: string): string {
  // Combine date and time strings into one Date string
  const dateTimeString = `${dateString}T${timeString}`;
  const givenDateTime = new Date(dateTimeString);
  const now = new Date();

  // Calculate the difference in milliseconds
  const diffInMillis = now.getTime() - givenDateTime.getTime();

  // Convert milliseconds to a more readable format
  const diffInSeconds = Math.floor(diffInMillis / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) return `${diffInDays}d`;
  if (diffInHours > 0) return `${diffInHours}h`;
  if (diffInMinutes > 0) return `${diffInMinutes}m`;
  return `${diffInSeconds}s`;
}