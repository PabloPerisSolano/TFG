import { toast } from "@/hooks/use-toast";
import { TRANSITION_DURATION } from "@/config/config";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

export const showSuccessToast = ({ title, description }) => {
  toast({
    title: (
      <div className="flex items-center space-x-2">
        <FaCheckCircle />
        <span>{title}</span>
      </div>
    ),
    description: <div style={{ marginLeft: "1.35rem" }}>{description}</div>,
    variant: "success",
    duration: TRANSITION_DURATION,
  });
};

export const showErrorToast = ({ title, description }) => {
  toast({
    title: (
      <div className="flex items-center space-x-2">
        <FaExclamationCircle />
        <span>{title}</span>
      </div>
    ),
    description: <div style={{ marginLeft: "1.35rem" }}>{description}</div>,
    variant: "destructive",
    duration: TRANSITION_DURATION,
  });
};

export const showServerErrorToast = () => {
  showErrorToast({
    title: "Error de servidor",
    description: "No se pudo conectar con el servidor.",
  });
};
