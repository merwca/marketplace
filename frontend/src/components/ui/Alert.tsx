interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
  const bgColor = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200",
  }[type];

  const textColor = {
    success: "text-green-800",
    error: "text-red-800",
    warning: "text-yellow-800",
    info: "text-blue-800",
  }[type];

  return (
    <div className={`border rounded p-4 mb-4 ${bgColor} ${textColor} flex justify-between items-start`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="font-bold text-lg">
          ×
        </button>
      )}
    </div>
  );
}
