import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const notify = {
  success: (title: string, text?: string) => {
    return MySwal.fire({
      icon: 'success',
      title: title,
      text: text,
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
      customClass: {
        popup: 'rounded-[24px] border-none shadow-xl font-sans',
        title: 'text-[#111f42] font-black uppercase tracking-widest text-lg',
        htmlContainer: 'text-slate-500 text-sm font-medium'
      }
    });
  },
  error: (title: string, text?: string) => {
    return MySwal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'Understand',
      confirmButtonColor: '#111f42',
      customClass: {
        popup: 'rounded-[24px] border-none shadow-xl font-sans',
        title: 'text-[#ef4444] font-black uppercase tracking-widest text-lg',
        htmlContainer: 'text-slate-500 text-sm font-medium',
        confirmButton: 'rounded-xl px-8 py-3 text-xs font-black uppercase tracking-widest'
      }
    });
  },
  confirm: (title: string, text?: string) => {
    return MySwal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#111f42',
      cancelButtonColor: '#f1f5f9',
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-[24px] border-none shadow-xl font-sans',
        title: 'text-[#111f42] font-black uppercase tracking-widest text-lg',
        htmlContainer: 'text-slate-500 text-sm font-medium',
        confirmButton: 'rounded-xl px-8 py-3 text-xs font-black uppercase tracking-widest',
        cancelButton: 'rounded-xl px-8 py-3 text-xs font-black uppercase tracking-widest text-slate-500'
      }
    });
  },
  loading: (title: string = 'Processing...') => {
    MySwal.fire({
      title: title,
      allowOutsideClick: false,
      didOpen: () => {
        MySwal.showLoading();
      },
      customClass: {
        popup: 'rounded-[24px] border-none shadow-xl font-sans',
        title: 'text-[#111f42] font-black uppercase tracking-widest text-lg',
      }
    });
  },
  close: () => {
    MySwal.close();
  }
};
