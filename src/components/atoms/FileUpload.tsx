import * as React from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileUploadProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
  onFileSelect?: (files: FileList | null) => void;
  dragDropText?: string;
  browseText?: string;
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ 
    className, 
    variant = "default", 
    onFileSelect,
    dragDropText = "Drag and drop files or click to browse",
    browseText = "Browse files",
    id,
    ...props 
  }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id || `file-upload-${generatedId}`;

    const variantStyles = {
      default: "border-gray-300 hover:border-gray-400 focus-within:border-gray-500",
      gvteway: "border-gvteway-red-500/30 hover:border-gvteway-red-500/50 focus-within:border-gvteway-red-500",
      compvss: "border-compvss-cyan-500/30 hover:border-compvss-cyan-500/50 focus-within:border-compvss-cyan-500",
      atlvs: "border-atlvs-green-500/30 hover:border-atlvs-green-500/50 focus-within:border-atlvs-green-500",
    };

    const iconColorStyles = {
      default: "text-gray-400",
      gvteway: "text-gvteway-red-500",
      compvss: "text-compvss-cyan-500",
      atlvs: "text-atlvs-green-500",
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (onFileSelect) {
        onFileSelect(files);
      }
      // Also trigger the input's onChange if it exists
      const input = document.getElementById(inputId) as HTMLInputElement;
      if (input && props.onChange) {
        const dataTransfer = new DataTransfer();
        Array.from(files).forEach(file => dataTransfer.items.add(file));
        input.files = dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onFileSelect) {
        onFileSelect(e.target.files);
      }
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer",
          isDragging && "border-solid bg-gray-50 dark:bg-gray-800",
          variantStyles[variant],
          className
        )}
      >
        <label
          htmlFor={inputId}
          className="flex flex-col items-center justify-center cursor-pointer w-full"
        >
          <Upload className={cn("w-10 h-10 mb-3", iconColorStyles[variant])} />
          <p className="text-body-sm text-gray-400 font-share-tech mb-3">
            {dragDropText}
          </p>
          <span className={cn(
            "text-body-sm font-share-tech",
            iconColorStyles[variant]
          )}>
            {browseText}
          </span>
        </label>
        <input
          type="file"
          id={inputId}
          className="hidden"
          ref={ref}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export { FileUpload };
