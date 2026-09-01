import {
  FileText,
  Loader2,
  Trash2,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { uploadResume, deleteResume } from "../../../services/api";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function ResumeUpload({ resumeData, onUploadSuccess, onDeleteSuccess }) {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (resumeData) {
      setFile({
        name: resumeData.fileName,
        size: resumeData.fileSize || 1024 * 1024,
      });
    }
  }, [resumeData]);

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;

    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
      setError("Only PDF files are supported.");
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5 MB.");
      return false;
    }

    setError("");
    return true;
  };

  const processFile = async (selectedFile) => {
    if (!validateFile(selectedFile)) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);

      const res = await uploadResume(formData);
      if (res.success && res.resume) {
        if (onUploadSuccess) onUploadSuccess(res.resume);
      }
    } catch (err) {
      console.error("Resume upload error:", err);
      setError(err.message || "Failed to upload resume.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      processFile(selectedFile);
    }

    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleRemove = async () => {
    try {
      await deleteResume();
      setFile(null);
      setIsProcessing(false);
      setError("");
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      console.error("Delete resume error:", err);
      setError(err.message || "Failed to delete resume.");
    }
  };

  return (
    <div className="rounded-xl border bg-background p-6">
      <div>
        <h2 className="font-semibold">Upload resume</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Upload your latest PDF resume for AI analysis.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`mt-6 flex w-full flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center transition-colors ${
            isDragging
              ? "border-foreground bg-muted"
              : "hover:bg-muted/50"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border">
            <Upload className="h-5 w-5" />
          </div>

          <p className="mt-4 text-sm font-medium">
            Drop your resume here or browse
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            PDF only · Maximum file size: 5 MB
          </p>
        </button>
      ) : (
        <div className="mt-6 rounded-xl border p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
              <FileText className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>

              {isProcessing ? (
                <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Processing resume...
                </p>
              ) : (
                <p className="mt-3 flex items-center gap-2 text-xs text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Resume ready
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Remove resume"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {!isProcessing && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-4 w-full rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Replace resume
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export default ResumeUpload;