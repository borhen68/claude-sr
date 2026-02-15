"use client";

import { useEffect, useRef, useCallback } from "react";

interface AutosaveOptions {
  projectId: string;
  data: any;
  interval?: number;
  enabled?: boolean;
  onSave?: (savedAt: string) => void;
  onError?: (error: Error) => void;
}

export function useAutosave({
  projectId,
  data,
  interval = 30000, // 30 seconds
  enabled = true,
  onSave,
  onError,
}: AutosaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>();
  const isSavingRef = useRef(false);

  const save = useCallback(async () => {
    if (isSavingRef.current || !enabled) return;

    try {
      isSavingRef.current = true;

      const response = await fetch(`/api/projects/${projectId}/autosave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Autosave failed");
      }

      const result = await response.json();
      lastSavedRef.current = result.savedAt;
      
      if (onSave) {
        onSave(result.savedAt);
      }
    } catch (error) {
      console.error("Autosave error:", error);
      if (onError) {
        onError(error as Error);
      }
    } finally {
      isSavingRef.current = false;
    }
  }, [projectId, data, enabled, onSave, onError]);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      save();
    }, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, interval, enabled, save]);

  return {
    save,
    lastSaved: lastSavedRef.current,
    isSaving: isSavingRef.current,
  };
}
