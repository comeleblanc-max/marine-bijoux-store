'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

export function ToastContainer() {
  const { toasts, remove } = useToast()
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white min-w-64 max-w-sm ${
              toast.type === 'success' ? 'bg-[#0E4F5E]' :
              toast.type === 'error' ? 'bg-red-500' : 'bg-[#A7D5E6]'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
            {toast.type === 'error' && <XCircle className="w-4 h-4 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 flex-shrink-0" />}
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => remove(toast.id)} className="opacity-70 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
