import { Save } from "lucide-react";
import { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  Input,
} from "@/components/ui";

export const DialogOneInput = ({
  children,
  dialogTitle,
  inputPlaceholder,
  onSave,
}) => {
  const [inputValue, setInputValue] = useState("");
  const closeButtonRef = useRef(null);

  const handleSave = () => {
    onSave(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      closeButtonRef.current.click();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            Introduce un valor y pulsa Guardar.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder={inputPlaceholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleSave} ref={closeButtonRef}>
              <Save /> Guardar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
