"use client";

//Library
import { Scale, ChevronRight } from "lucide-react";
//REACT
import React, { useState } from "react";
//Types
import { DisputeStatus } from "@/src/types/Admin";
//Config
import { FILTERS, MOCK_DISPUTES, STATUS_CONFIG } from "./AdminConfig";

export const DisputesPanel = () => {
  const [filter, setFilter] = useState<DisputeStatus | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);

  const disputes =
    filter === "all"
      ? MOCK_DISPUTES
      : MOCK_DISPUTES.filter((d) => d.status === filter);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Dispute Management</h2>
        </div>
        <span className="text-xs text-muted-foreground border border-border-low rounded-full px-3 py-1">
          {MOCK_DISPUTES.filter((d) => d.status === "pending").length} pending
          review
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer
              ${
                filter === value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border-low text-muted-foreground hover:border-border-strong hover:text-foreground"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border-low overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="border-b border-border-low bg-cream/50">
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">
                  ID
                </th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">
                  Property
                </th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium hidden md:table-cell">
                  Reason
                </th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium hidden lg:table-cell">
                  Amount
                </th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {disputes.map((dispute) => {
                const {
                  icon: Icon,
                  label,
                  className,
                } = STATUS_CONFIG[dispute.status];
                const isSelected = selected === dispute.id;
                return (
                  <React.Fragment key={dispute.id}>
                    <tr
                      onClick={() =>
                        setSelected(isSelected ? null : dispute.id)
                      }
                      className={`border-b border-border-low cursor-pointer transition-colors
                      ${isSelected ? "bg-primary/5" : "hover:bg-cream/60"}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {dispute.id}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">
                          {dispute.property}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dispute.guest} → {dispute.host}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                        {dispute.reason}
                      </td>
                      <td className="px-4 py-3 font-medium hidden lg:table-cell">
                        {dispute.amount}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs border font-medium ${className}`}
                        >
                          <Icon className="h-3 w-3" />
                          {label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ChevronRight
                          className={`h-4 w-4 text-muted-foreground transition-transform ${isSelected ? "rotate-90" : ""}`}
                        />
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isSelected && (
                      <tr key={`${dispute.id}-detail`} className="bg-primary/5">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex flex-col gap-1">
                              <p className="text-xs text-muted-foreground">
                                Date filed
                              </p>
                              <p className="text-sm font-medium">
                                {dispute.date}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="text-xs text-muted-foreground">
                                Guest
                              </p>
                              <p className="text-sm font-medium">
                                {dispute.guest}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="text-xs text-muted-foreground">
                                Host
                              </p>
                              <p className="text-sm font-medium">
                                {dispute.host}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="text-xs text-muted-foreground">
                                Stake at risk
                              </p>
                              <p className="text-sm font-medium text-primary">
                                {dispute.amount}
                              </p>
                            </div>
                            {dispute.status === "pending" ||
                            dispute.status === "reviewing" ? (
                              <div className="flex flex-wrap gap-2">
                                <button className="px-4 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer">
                                  Resolve for guest
                                </button>
                                <button className="px-4 py-1.5 rounded-md text-xs font-medium border border-border-strong text-foreground hover:bg-cream transition-colors cursor-pointer">
                                  Resolve for host
                                </button>
                                <button className="px-4 py-1.5 rounded-md text-xs font-medium border border-border-low text-muted-foreground hover:bg-cream transition-colors cursor-pointer">
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">
                                No actions available
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {disputes.length === 0 && (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
              No disputes match this filter
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
