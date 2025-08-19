"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, Info } from "lucide-react";

export type ConfirmationType = "danger" | "warning" | "info" | "success";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
  loading?: boolean;
  destructive?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
  loading = false,
  destructive = false,
}: ConfirmationDialogProps) {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "success":
        return <Check className="h-6 w-6 text-green-500" />;
      case "info":
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "danger":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          button: destructive
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white",
        };
      case "warning":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-200 dark:border-yellow-800",
          button: destructive
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-yellow-600 hover:bg-yellow-700 text-white",
        };
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-800",
          button: "bg-green-600 hover:bg-green-700 text-white",
        };
      case "info":
      default:
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          button: "bg-blue-600 hover:bg-blue-700 text-white",
        };
    }
  };

  const colors = getColors();

  const handleConfirm = () => {
    onConfirm();
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`flex-shrink-0 p-2 rounded-full ${colors.bg} ${colors.border} border`}
          >
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1 sm:flex-none bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                {cancelText}
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={loading}
                className={`flex-1 sm:flex-none ${colors.button}`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Loading...
                  </div>
                ) : (
                  confirmText
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Hook for confirmation dialog
export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    type?: ConfirmationType;
    destructive?: boolean;
    onConfirm: () => void;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const confirm = (options: {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    type?: ConfirmationType;
    destructive?: boolean;
    onConfirm: () => Promise<void> | void;
  }) => {
    setConfig({
      ...options,
      onConfirm: async () => {
        setLoading(true);
        try {
          await options.onConfirm();
        } finally {
          setLoading(false);
          setIsOpen(false);
        }
      },
    });
    setIsOpen(true);
  };

  const close = () => {
    if (!loading) {
      setIsOpen(false);
      setConfig(null);
    }
  };

  return {
    isOpen,
    config,
    loading,
    confirm,
    close,
  };
}

import { useState } from "react";
import { Modal } from "./ui/modal";
