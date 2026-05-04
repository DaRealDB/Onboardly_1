import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onConfirm?: () => void;
}

export default function DeleteConfirmModal({
  open,
  onOpenChange,
  itemName,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const isValid = confirmText === itemName;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <AlertDialogTitle className="text-center">
            Delete Workspace Permanently
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action is{" "}
            <span className="font-semibold text-destructive">irreversible</span>
            . All data, configurations, pipelines, and candidate records
            associated with{" "}
            <span className="font-semibold text-foreground">{itemName}</span>{" "}
            will be permanently erased.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 py-2">
          <p className="text-xs text-muted-foreground">
            Type{" "}
            <span className="font-mono font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded">
              {itemName}
            </span>{" "}
            to confirm:
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={itemName}
            className="font-mono text-sm"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={!isValid}
            onClick={() => {
              onConfirm?.();
              setConfirmText("");
              onOpenChange(false);
            }}
            className="gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Permanently Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
