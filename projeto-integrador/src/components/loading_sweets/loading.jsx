import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      Swal.fire({
        title: "Carregando...",
        text: "Por favor, aguarde.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    } else {
      Swal.close();
    }
  }, [isLoading]);

  return [isLoading, setIsLoading];
};


