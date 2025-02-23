"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaSave } from "react-icons/fa";
import { useState, useRef } from "react";

export default function AddItemDialog({
  dialogTitle,
  inputPlaceholder,
  onSave,
  children,
}) {
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
      <DialogContent className="bg-gray-800 border border-gray-800">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <Input
          placeholder={inputPlaceholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="secondary"
              onClick={handleSave}
              ref={closeButtonRef}
            >
              <FaSave /> Guardar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
