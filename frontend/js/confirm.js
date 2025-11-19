window.confirm = function(message) {
  return Swal.fire({
    title: message,
    icon: 'question',
    background: '#1e293b', // fondo oscuro elegante
    color: '#f1f5f9', // texto claro
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
    confirmButtonColor: '#10b981', // verde
    cancelButtonColor: '#ef4444',  // rojo
    reverseButtons: true,
    allowOutsideClick: false,
    customClass: {
        borderradius: '10px',
        popup: 'rounded-2xl shadow-2xl border border-gray-600',
        title: 'text-lg font-semibold'
    }
  }).then(result => result.isConfirmed);
};