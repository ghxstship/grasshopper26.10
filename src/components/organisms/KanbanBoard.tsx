"use client";
import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { GripVertical, Plus, MoreVertical, Calendar, User } from "lucide-react";
import { Card } from "@/components/atoms/Card";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { BodyText, CardTitle, SectionHeader as _SectionHeader, SmallHeader as _SmallHeader, SubsectionHeader } from "@/components/atoms/Typography";
export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  tags?: string[];
}
export interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
  color?: string;
}
interface KanbanBoardProps {
  columns: KanbanColumn[];
  onTaskMove?: (_taskId: string, _fromColumn: string, _toColumn: string) => void;
  onTaskClick?: (task: KanbanTask) => void;
  onAddTask?: (columnId: string) => void;
}
export function KanbanBoard({
  columns,
  onTaskMove: _onTaskMove,
  onTaskClick,
  onAddTask,
}: KanbanBoardProps) {
  const [boardColumns, setBoardColumns] = useState(columns);
  const handleReorder = (columnId: string, newOrder: KanbanTask[]) => {
    setBoardColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, tasks: newOrder } : col,
      ),
    );
  };
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return "bg-error";
      case "high":
        return "bg-black";
      case "medium":
        return "bg-warning";
      case "low":
        return "bg-info";
      default:
        return " ";
    }
  };
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {" "}
      {boardColumns.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80">
          {" "}
          {/* Column Header */}{" "}
          <div className="mb-4 flex items-center justify-between">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <div
                className={`w-3 h-3 rounded-full ${column.color || "bg-black"}`}
              />{" "}
              <SubsectionHeader className="text-white"> {column.title} </SubsectionHeader>{" "}
              <Badge> {column.tasks.length} </Badge>{" "}
            </div>{" "}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddTask?.(column.id)}
              className="hover:text-white"
            >
              {" "}
              <Plus className="w-4 h-4" />{" "}
            </Button>{" "}
          </div>{" "}
          {/* Tasks */}{" "}
          <Reorder.Group
            axis="y"
            values={column.tasks}
            onReorder={(newOrder) => handleReorder(column.id, newOrder)}
            className="space-y-3 min-h-[12.50rem]"
          >
            {" "}
            {column.tasks.map((task) => (
              <Reorder.Item
                key={task.id}
                value={task}
                className="cursor-grab active:cursor-grabbing"
              >
                {" "}
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onTaskClick?.(task)}
                >
                  {" "}
                  <Card className="p-4 backdrop-blur-sm border-black/20 hover:border-black/50 transition-all">
                    {" "}
                    {/* Task Header */}{" "}
                    <div className="flex items-start justify-between mb-3">
                      {" "}
                      <div className="flex items-start gap-2 flex-1">
                        {" "}
                        <GripVertical className="w-4 h-4 mt-1 flex-shrink-0" />{" "}
                        <CardTitle className="text-white"> {task.title} </CardTitle>{" "}
                      </div>{" "}
                      <Button variant="ghost" size="sm" className="h-auto p-0">
                        {" "}
                        <MoreVertical className="w-4 h-4" />{" "}
                      </Button>{" "}
                    </div>{" "}
                    {/* Task Description */}{" "}
                    {task.description && (
                      <BodyText className="mb-3 line-clamp-2"> {task.description} </BodyText>
                    )}{" "}
                    {/* Task Meta */}{" "}
                    <div className="flex items-center justify-between">
                      {" "}
                      <div className="flex items-center gap-2">
                        {" "}
                        {task.priority && (
                          <div
                            className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}
                            title={task.priority}
                          />
                        )}{" "}
                        {task.assignee && (
                          <div className="flex items-center gap-1">
                            {" "}
                            <User className="w-3 h-3" />{" "}
                            <span>{task.assignee}</span>{" "}
                          </div>
                        )}{" "}
                      </div>{" "}
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          {" "}
                          <Calendar className="w-3 h-3" />{" "}
                          <span>{task.dueDate}</span>{" "}
                        </div>
                      )}{" "}
                    </div>{" "}
                    {/* Task Tags */}{" "}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {" "}
                        {task.tags.map((tag) => (
                          <Badge key={tag}> {tag} </Badge>
                        ))}{" "}
                      </div>
                    )}{" "}
                  </Card>{" "}
                </motion.div>{" "}
              </Reorder.Item>
            ))}{" "}
          </Reorder.Group>{" "}
        </div>
      ))}{" "}
    </div>
  );
}
