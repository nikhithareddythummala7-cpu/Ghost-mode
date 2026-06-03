import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const Toast = () => {
  const { toast } = useToast();

  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          className="fixed right-4 top-4 z-50 w-full max-w-sm rounded-[28px] border border-white/10 bg-slate-950/90 p-4 shadow-glow backdrop-blur-xl"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-neon-blue">{toast.type === 'success' ? 'Success' : 'Notice'}</p>
          <p className="mt-2 text-sm text-slate-200">{toast.message}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Toast;
