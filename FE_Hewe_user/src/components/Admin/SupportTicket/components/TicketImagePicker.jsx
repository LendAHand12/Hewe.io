import { useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

// Chọn ảnh đính kèm, files được quản lý ở component cha
export const TicketImagePicker = ({ files, onChange, maxFiles, disabled }) => {
  const inputRef = useRef(null);

  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    e.target.value = "";

    const valid = selected.filter((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: only PNG, JPEG or WEBP images are supported`);
        return false;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name}: image must be ${MAX_SIZE_MB}MB or smaller`);
        return false;
      }
      return true;
    });

    const merged = [...files, ...valid];
    if (merged.length > maxFiles) {
      toast.error(`You can upload at most ${maxFiles} image(s)`);
    }
    onChange(merged.slice(0, maxFiles));
  };

  const handleRemove = (index) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple={maxFiles > 1}
        onChange={handleSelect}
        style={{ display: "none" }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {previews.map((url, index) => (
          <div
            key={url}
            style={{ position: "relative", width: "72px", height: "72px" }}
          >
            <img
              src={url}
              alt={`attachment ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              disabled={disabled}
              aria-label="Remove image"
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                border: "none",
                background: "#ff4d4f",
                color: "#fff",
                lineHeight: "20px",
                padding: 0,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        ))}
        {files.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "6px",
              border: "1px dashed rgba(255,255,255,0.4)",
              background: "transparent",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            + Image
          </button>
        )}
      </div>
      <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "6px" }}>
        {files.length}/{maxFiles} image(s) · PNG, JPEG, WEBP · max {MAX_SIZE_MB}MB each
      </div>
    </div>
  );
};
