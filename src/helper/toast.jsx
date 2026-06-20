import toast from "react-hot-toast";
import { Check, X, AlertTriangle, AlertCircle } from "lucide-react";

const Toast = ({ type, title, message, id }) => {
  const config = {
    success: {
      icon: <Check size={18} />,
      bg: "bg-green-50",
      text: "text-green-600",
    },

    error: {
      icon: <AlertCircle size={18} />,
      bg: "bg-red-50",
      text: "text-red-500",
    },

    warning: {
      icon: <AlertTriangle size={18} />,
      bg: "bg-orange-50",
      text: "text-orange-500",
    },
  }[type];

  return (
    <div
      className={`
    w-[300px] sm:w-[360px]
    min-h-[70px]
    ${config.bg}
    rounded-xl
    px-4 py-3
    flex items-center gap-3
    shadow-lg
  `}
    >
      {/* Icon */}
      <div
        className={`
          shrink-0
          w-9 h-9
          rounded-full
          flex items-center justify-center
          bg-white
          ${config.text}
        `}
      >
        {config.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h4
          className={`
      text-m
      font-bold
      ${config.text}
    `}
        >
          {title}
        </h4>

        {message && (
          <p
            className="
        text-xs
        text-gray-500
        mt-1
        break-words
        leading-5
      "
          >
            {message}
          </p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={() => toast.dismiss(id)}
        className="
          text-gray-400
          hover:text-gray-700
          transition
        "
      >
        <X size={18} />
      </button>
    </div>
  );
};

export const showToast = {
  success(message, title = "Success") {
    toast.custom((t) => <Toast id={t.id} type="success" title={title} message={message} />);
  },

  error(message, title = "Error") {
    toast.custom((t) => <Toast id={t.id} type="error" title={title} message={message} />);
  },

  warning(message, title = "Warning") {
    toast.custom((t) => <Toast id={t.id} type="warning" title={title} message={message} />);
  },
};
