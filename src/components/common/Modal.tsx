import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useTheme } from "@/theme";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: ModalProps) {
  const { isDark } = useTheme();
  const [isRendered, setIsRendered] = useState(isOpen);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    if (isOpen) {
      setIsRendered(true);
    } else if (isRendered) {
      closeTimer.current = setTimeout(() => {
        setIsRendered(false);
        closeTimer.current = null;
      }, 180);
    }

    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
    };
  }, [isOpen, isRendered]);

  useEffect(() => {
    if (!isRendered) return;

    const html = document.documentElement;
    const body = document.body;
    const main = document.querySelector<HTMLElement>("main");
    const previousOverflow = {
      html: html.style.overflow,
      body: body.style.overflow,
      main: main?.style.overflow,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (main) main.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousOverflow.html;
      body.style.overflow = previousOverflow.body;
      if (main && previousOverflow.main !== undefined) {
        main.style.overflow = previousOverflow.main;
      }
    };
  }, [isRendered]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isRendered) return null;

  return (
    <div
      data-state={isOpen ? "open" : "closed"}
      className="app-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div
        data-state={isOpen ? "open" : "closed"}
        className={`rounded-2xl shadow-2xl w-full ${maxWidth} overflow-hidden flex flex-col max-h-[90vh] ${
          isDark
            ? "bg-slate-900 border border-slate-700 text-slate-100"
            : "bg-white border border-gray-100 text-gray-900"
        } app-modal-content`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? "border-slate-800" : "border-gray-100"
          }`}
        >
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{title}</h3>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
