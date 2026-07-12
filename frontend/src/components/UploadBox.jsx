import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileUp } from "lucide-react";

export default function UploadBox({ onFiles, compact = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    (fileList) => {
      const files = Array.from(fileList).filter((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"));
      if (files.length) onFiles?.(files);
    },
    [onFiles]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <motion.div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      animate={{
        borderColor: isDragging ? "var(--color-accent-500)" : "var(--color-ink-200)",
        backgroundColor: isDragging ? "var(--color-accent-50)" : "#ffffff",
      }}
      className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-colors ${
        compact ? "gap-2 p-6" : "gap-4 p-12"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      <motion.div
        animate={{ y: isDragging ? -4 : 0, scale: isDragging ? 1.08 : 1 }}
        className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-accent-glow text-white shadow-soft ${
          compact ? "h-10 w-10" : "h-16 w-16"
        }`}
      >
        {isDragging ? <FileUp size={compact ? 18 : 26} /> : <UploadCloud size={compact ? 18 : 26} />}
      </motion.div>
      <div>
        <p className={`font-medium text-ink-900 ${compact ? "text-sm" : "text-base"}`}>
          {isDragging ? "Drop your PDF here" : "Drag & drop a PDF, or click to browse"}
        </p>
        {!compact && (
          <p className="mt-1 text-sm text-ink-500">
            Supports multiple files · Max 25MB each
          </p>
        )}
      </div>
    </motion.div>
  );
}
