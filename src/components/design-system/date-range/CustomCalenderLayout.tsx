import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import { CalenderLayoutContainer } from "./styled";
import ToolbarButton from "./QuickRangeSelector";
import React from "react";

interface LayoutProps {
  handleToolbarAction: (
    startDate: Moment | null,
    endDate: Moment | null,
    action: string
  ) => void;
  children: React.ReactNode;
  startDate: Moment | null;
  endDate: Moment | null;
}

const today = moment();

const quickRanges = [
  {
    label: "Today",
    action: "today",
    start: today.clone().startOf("day"),
    end: today.clone().endOf("day"),
  },
  {
    label: "Yesterday",
    action: "yesterday",
    start: today.clone().subtract(1, "day").startOf("day"),
    end: today.clone().subtract(1, "day").endOf("day"),
  },
  {
    label: "Last week",
    action: "lastWeek",
    start: today.clone().subtract(1, "week").startOf("week"),
    end: today.clone().subtract(1, "week").endOf("week"),
  },
  {
    label: "This week",
    action: "thisWeek",
    start: today.clone().startOf("week"),
    end: today.clone(),
  },
  {
    label: "Last month",
    action: "lastMonth",
    start: today.clone().subtract(1, "month").startOf("month"),
    end: today.clone().subtract(1, "month").endOf("month"),
  },
  {
    label: "This month",
    action: "thisMonth",
    start: today.clone().startOf("month"),
    end: today.clone(),
  },
] as const;

const Layout = ({
  handleToolbarAction,
  children,
  startDate,
  endDate,
}: LayoutProps) => {
  const [selectedToolbarAction, setSelectedToolbarAction] = useState<
    string | null
  >(null);

  const handleQuickRangeChange = (action: string) => {
    const range = quickRanges.find((range) => range.action === action);
    handleToolbarAction(range?.start || null, range?.end || null, action);
  };

  useEffect(() => {
    const selectedRange = quickRanges.find(
      ({ start, end }) =>
        startDate?.isSame(start, "day") && endDate?.isSame(end, "day")
    );
    setSelectedToolbarAction(selectedRange?.action || null);
  }, [startDate, endDate]);

  return (
    <CalenderLayoutContainer>
      <div className="toolbar-container" data-testid="quick-range-container">
        <div>
          {quickRanges.map(({ label, action }) => (
            <ToolbarButton
              key={action}
              label={label}
              selected={selectedToolbarAction === action}
              action={action}
              onActionClick={handleQuickRangeChange}
            />
          ))}
        </div>
      </div>
      {children}
    </CalenderLayoutContainer>
  );
};

export default Layout;
