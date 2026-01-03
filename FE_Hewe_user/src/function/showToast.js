import Swal from "sweetalert2";

const ToastSuccess = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  iconHtml: '<i class="fa-solid fa-circle-check"></i>',
  iconColor: "#52c41a",
  customClass: {
    icon: "no-border",
  },
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const ToastError = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  iconHtml: '<i class="fa-solid fa-circle-xmark"></i>',
  iconColor: "#ff4d4f",
  customClass: {
    icon: "no-border",
  },
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const showToast = (type, text) => {
  if (type === "success") {
    ToastSuccess.fire({
      title: text,
    });
  } else if (type === "error") {
    ToastError.fire({
      title: text,
    });
  }
};
