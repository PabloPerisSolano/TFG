import { Pencil, Save } from "lucide-react";
import { useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";

export const EditableField = ({
  value,
  onUpdate,
  className,
  isTextarea = false,
  inputType = "text",
}) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = async () => {
    if (tempValue === value) {
      setEditing(false);
      return;
    }

    await onUpdate(tempValue);
    setEditing(false);
  };

  return (
    <div className="group flex gap-1 items-center">
      {editing ? (
        isTextarea ? (
          <Textarea
            defaultValue={value}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSave()}
            autoFocus
            className={className}
          />
        ) : (
          <Input
            type={inputType}
            defaultValue={value}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
            className={className}
          />
        )
      ) : (
        <p className={className}>{value}</p>
      )}

      <Button
        className="invisible group-hover:visible"
        size="icon"
        variant="ghost"
        onClick={() => {
          setTempValue(value);
          setEditing((prev) => !prev);
        }}
      >
        {editing ? <Save /> : <Pencil />}
      </Button>
    </div>
  );
};
