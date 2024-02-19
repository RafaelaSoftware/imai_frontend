import { useState } from "react";
import { useToast } from "@chakra-ui/react";

const useCustomToast = () => {
  const [isToastOpen, setIsToastOpen] = useState(false);
  const toast = useToast();

  const showToast = (
    title,
    description,
    status = "success",
    duration = 3000,
    position = "bottom-right"
  ) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: duration,
      isClosable: true,
      position: position,
    });
    setIsToastOpen(true);
  };

  const closeToast = () => {
    setIsToastOpen(false);
  };

  return { isToastOpen, showToast, closeToast };
};

export default useCustomToast;
