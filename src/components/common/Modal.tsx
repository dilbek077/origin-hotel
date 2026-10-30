import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useTheme } from "@/theme";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  variant?: "auto" | "dark";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  variant = "auto",
}: ModalProps) {
  const { isDark } = useTheme();
  const isDarkMode = variant === "dark" || (variant === "auto" && isDark);
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
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        data-state={isOpen ? "open" : "closed"}
        className={`rounded-[26px] shadow-[0_20px_60px_rgba(0,0,0,0.55)] w-full ${maxWidth} overflow-hidden flex flex-col max-h-[90vh] ${
          isDarkMode
            ? "bg-[#11181d] border border-slate-700/80 text-slate-100"
            : "bg-white border border-gray-100 text-gray-900"
        } app-modal-content`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-5 ${
            isDarkMode ? "border-b border-slate-800/80" : "border-b border-gray-100"
          }`}
        >
          <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{title}</h3>
          <button
            onClick={onClose}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              isDarkMode
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-0 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
