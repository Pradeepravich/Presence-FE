import {
  EMPLOYEE_WORKING_MODES,
  NON_WORKING_MODE_STATUSES,
  WORKING_MODE_STATUSES,
} from "./constants";

export const getAvailability = (availability: string) => {
  if (availability === EMPLOYEE_WORKING_MODES[0]) {
    return WORKING_MODE_STATUSES.join(",");
  } else if (availability === EMPLOYEE_WORKING_MODES[1]) {
    return NON_WORKING_MODE_STATUSES.join(",");
  } else {
    return availability;
  }
};

export const downloadFile = (data: ArrayBuffer) => {
  if (data) {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `presence-data.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
  }
};

export function getGMTOffsetFromTimezone(timezone: string): string {
  const date = new Date();
  const options = {
    timeZone: timezone,
    timeZoneName: "shortOffset" as const,
    hour: "2-digit" as const,
    minute: "2-digit" as const,
  };

  const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date);

  const offset = parts.find((part) => part.type === "timeZoneName");
  return offset?.value || "GMT";
}
