import { useState } from "react";
import { FaPencilAlt, FaSave } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EditableField({
  value,
  onUpdate,
  className,
  isTextarea = false,
}) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = async () => {
    if (!tempValue.trim() || tempValue === value) {
      setEditing(false);
      return;
    }

    await onUpdate(tempValue);
    setEditing(false);
  };

  return (
    <div className="group flex items-center space-x-2">
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
        {editing ? <FaSave /> : <FaPencilAlt />}
      </Button>
    </div>
  );
}
