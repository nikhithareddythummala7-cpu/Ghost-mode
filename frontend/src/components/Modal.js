const Modal = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Close</button>
        </div>
        <div className="p-6 text-slate-700 dark:text-slate-200">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
