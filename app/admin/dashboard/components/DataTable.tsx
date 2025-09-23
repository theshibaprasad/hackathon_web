"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  ChevronDown,
  ChevronUp,
  MoreHorizontal
} from "lucide-react";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  title: string;
  searchPlaceholder?: string;
  onExport?: () => void;
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  className?: string;
}

export default function DataTable({
  data,
  columns,
  title,
  searchPlaceholder = "Search...",
  onExport,
  onView,
  onEdit,
  onDelete,
  className = ""
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = sortKey
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : filteredData;

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // Default CSV export
      const csvContent = [
        columns.map(col => col.label).join(","),
        ...data.map(row =>
          columns.map(col => {
            const value = row[col.key];
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value;
          }).join(",")
        )
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, "_")}_export.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className={`${className} h-full`}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center space-x-2">
            {onExport && (
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1 flex flex-col">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`text-left py-3 px-4 font-medium text-gray-900 ${
                        column.sortable ? "cursor-pointer hover:bg-gray-50" : ""
                      }`}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {column.sortable && (
                          <div className="flex flex-col">
                            {sortKey === column.key && sortDirection === "asc" ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : sortKey === column.key && sortDirection === "desc" ? (
                              <ChevronDown className="w-3 h-3" />
                            ) : (
                              <div className="w-3 h-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                  {(onView || onEdit || onDelete) && (
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.key} className="py-3 px-4">
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] || "-")}
                      </td>
                    ))}
                    {(onView || onEdit || onDelete) && (
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {onView && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onView(row)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(row)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(row)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, sortedData.length)} of{" "}
                {sortedData.length} results
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {paginatedData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No data found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
