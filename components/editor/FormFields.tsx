"use client";

import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useEditor } from "./EditorProvider";
import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/RichTextEditor";

// Base field props
interface BaseFieldProps {
  label: string;
  value: string;
  path: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// Form Group component for grouping related fields
interface FormGroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const FormGroup = ({ 
  title, 
  children, 
  className = "p-3 bg-sidebar rounded-md space-y-3 mb-5" 
}: FormGroupProps) => {
  return (
    <div className={className}>
      <Label className="text-xs font-medium text-gray-700">{title}</Label>
      {children}
    </div>
  );
};

// Text Field
export const TextField = ({ 
  label, 
  value, 
  path, 
  placeholder, 
  className = "space-y-2 mb-4",
  disabled = false,
  onChange
}: BaseFieldProps & { onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  const { handleTextChange } = useEditor();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleTextChange(e.target.value, path);
    
    // If an onChange handler is provided, call it with the event
    if (onChange) {
      onChange(e);
    }
  };
  
  return (
    <div className={className}>
      <Label className="text-xs text-gray-500">{label}</Label>
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-8 text-xs"
        disabled={disabled}
      />
    </div>
  );
};

// Textarea Field
interface TextAreaFieldProps extends BaseFieldProps {
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextAreaField = ({ 
  label, 
  value, 
  path, 
  placeholder, 
  rows = 4,
  className = "space-y-2 mb-4", 
  disabled = false,
  onChange
}: TextAreaFieldProps) => {
  const { handleTextChange } = useEditor();
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleTextChange(e.target.value, path);
    
    // If an onChange handler is provided, call it with the event
    if (onChange) {
      onChange(e);
    }
  };
  
  return (
    <div className={className}>
      <Label className="text-xs text-gray-500">{label}</Label>
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="min-h-[100px] text-xs resize-y"
        rows={rows}
        disabled={disabled}
      />
    </div>
  );
};

// Link Field
export const LinkField = ({ 
  label, 
  value, 
  path, 
  placeholder = "e.g. /contact or https://example.com", 
  className = "space-y-2 mb-4",
  disabled = false
}: BaseFieldProps) => {
  const { handleTextChange } = useEditor();
  
  return (
    <div className={className}>
      <Label className="text-xs text-gray-500">{label}</Label>
      <Input
        value={value}
        onChange={(e) => handleTextChange(e.target.value, path)}
        placeholder={placeholder}
        className="h-8 text-xs"
        disabled={disabled}
      />
    </div>
  );
};

// Section Type Selector
interface SectionTypeSelectorProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const SectionTypeSelector = ({ 
  label, 
  value, 
  options, 
  onChange, 
  className = "space-y-2 mb-4",
  disabled = false
}: SectionTypeSelectorProps) => {
  return (
    <div className={className}>
      <Label className="text-xs text-gray-500">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-md border border-input bg-background px-3 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none bg-no-repeat bg-[right_0.5rem_center]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Image Upload Field
export const ImageUploadField = ({ 
  label, 
  value, 
  path, 
  placeholder = "Upload image", 
  className = "space-y-2 mb-4",
  disabled = false
}: BaseFieldProps) => {
  const { handleImageUpload, imageUploading } = useEditor();
  
  return (
    <div className={className}>
      <Label className="text-xs text-gray-500">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
            onChange={(e) => handleImageUpload(e, path)}
            disabled={disabled || imageUploading}
          />
          <Input
            readOnly
            value={value}
            placeholder={placeholder}
            className="h-8 text-xs pr-20"
            disabled={disabled}
          />
          <Button
            type="button"
            variant="outline"
            disabled={disabled || imageUploading}
            className="absolute right-0 top-0 h-8 rounded-l-none text-xs"
            size="sm"
          >
            {imageUploading ? (
              "Uploading..."
            ) : (
              <>
                <Upload className="w-3 h-3 mr-1" />
                Upload
              </>
            )}
          </Button>
        </div>
      </div>
      {value && (
        <div className="mt-2 border rounded overflow-hidden w-full h-24">
          <img 
            src={value} 
            alt={label} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

// Image Preview
interface ImagePreviewProps {
  src: string;
  path: string;
  alt: string;
  className?: string;
  disabled?: boolean;
}

export const ImagePreview = ({ 
  src, 
  path, 
  alt, 
  className = "w-full h-16 object-cover", 
  disabled = false
}: ImagePreviewProps) => {
  const { handleImageUpload, imageUploading } = useEditor();
  
  const handleClick = () => {
    if (disabled || imageUploading) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleImageUpload(e as any, path);
    input.click();
  };
  
  return (
    <div className="border rounded overflow-hidden mb-3">
      <div className="relative">
        <img 
          src={src} 
          alt={alt} 
          className={className}
        />
        <div className="p-1 bg-sidebar text-xs">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-full text-[10px]"
            onClick={handleClick}
            disabled={disabled || imageUploading}
          >
            <Upload className="w-3 h-3 mr-1" />
            {imageUploading ? "Uploading..." : "Change Image"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Checkbox field
interface CheckboxFieldProps extends Omit<BaseFieldProps, 'value'> {
  checked: boolean;
}

export const CheckboxField = ({ 
  label, 
  checked, 
  path, 
  className = "flex items-center gap-2 mb-4",
  disabled = false
}: CheckboxFieldProps) => {
  const { handleTextChange } = useEditor();
  
  return (
    <div className={className}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => handleTextChange(e.target.checked.toString(), path)}
        id={`checkbox-${path}`}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        disabled={disabled}
      />
      <Label htmlFor={`checkbox-${path}`} className="text-xs text-gray-600 font-normal">
        {label}
      </Label>
    </div>
  );
};

// Rich Text Field
export const RichTextField = ({ 
  label, 
  value, 
  path, 
  placeholder = "Enter content here...", 
  className = "space-y-2 mb-4",
  disabled = false
}: BaseFieldProps) => {
  const { handleTextChange } = useEditor();
  
  const handleRichTextChange = (html: string) => {
    handleTextChange(html, path);
  };
  
  return (
    <div className={className}>
      <Label className="text-xs text-gray-500">{label}</Label>
      <div className="border border-input rounded-md overflow-hidden">
        <RichTextEditor
          content={value}
          onChange={handleRichTextChange}
          placeholder={placeholder}
          className="min-h-[300px]"
        />
      </div>
    </div>
  );
};

// Color Picker Field
export const ColorField = ({ label, value, path, className, onChange }: {
  label: string;
  value: string;
  path: string;
  className?: string;
  onChange?: (color: string) => void;
}) => {
  const { handleTextChange } = useEditor();
  const [color, setColor] = useState<string>(value || "");
  
  const handleChange = (newColor: string) => {
    setColor(newColor);
    handleTextChange(newColor, path);
    
    // If an onChange handler is provided, call it with the new color
    if (onChange) {
      onChange(newColor);
    }
  };

  return (
    <div className={cn("grid w-full items-center gap-1.5", className)}>
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-8 h-8 p-0 border"
              style={{ 
                backgroundColor: color || 'transparent',
                borderColor: !color ? '#ccc' : 'transparent'
              }}
            >
              {!color && <span className="text-xs text-gray-500">+</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3">
            <HexColorPicker color={color} onChange={handleChange} />
            <div className="flex items-center mt-2">
              <Input
                value={color}
                onChange={(e) => handleChange(e.target.value)}
                className="h-8 text-xs"
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 ml-1"
                onClick={() => handleChange("")}
              >
                Clear
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <span className="text-xs text-gray-500">{color || "Not set"}</span>
      </div>
    </div>
  );
};

// Toggle Field
export const ToggleField = ({ label, value, path, className }: {
  label: string;
  value: boolean;
  path: string;
  className?: string;
}) => {
  const { updateData } = useEditor();
  const [isChecked, setIsChecked] = useState(value);
  
  // Update local state when props change
  useEffect(() => {
    setIsChecked(value);
  }, [value]);
  
  const handleChange = (checked: boolean) => {
    // Update local state first
    setIsChecked(checked);
    
    // Then update the data using updateData
    try {
      updateData(path, checked);
    } catch (error) {
      console.error("Error updating toggle field:", error);
      // Revert local state if update fails
      setIsChecked(value);
    }
  };

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <Label htmlFor={path} className="text-xs cursor-pointer">{label}</Label>
      <Switch
        id={path}
        checked={isChecked}
        onCheckedChange={handleChange}
      />
    </div>
  );
};

// Custom Button component for editor forms
interface EditorButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export const EditorButton = ({ 
  children, 
  onClick, 
  className = "", 
  icon,
  disabled = false
}: EditorButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}; 