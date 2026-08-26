import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  width?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function Sheet({
  open,
  onClose,
  title,
  description,
  width = 'max-w-5xl',
  footer,
  children
}: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ?
      <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
          className="absolute inset-0 bg-[#0d1411]/45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          onClick={onClose} />
        
          <motion.div
          className={cn('relative flex h-full w-full flex-col bg-canvas shadow-pop', width)}
          initial={{ x: 32, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 32, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}>
          
            <header className="flex items-start justify-between gap-4 border-b border-line bg-surface px-6 py-4">
              <div>
                <h2 className="font-display text-lg font-medium text-ink">{title}</h2>
                {description ? <p className="mt-0.5 text-[13px] text-body">{description}</p> : null}
              </div>
              <button
              onClick={onClose}
              aria-label="Close panel"
              className="rounded-lg p-2 text-body transition-colors duration-150 ease-calm hover:bg-primary-tint hover:text-ink">
              
                <XIcon className="h-4 w-4" />
              </button>
            </header>
            <div className="mha-scroll flex-1 overflow-y-auto">{children}</div>
            {footer ?
          <footer className="flex items-center justify-end gap-2 border-t border-line bg-surface px-6 py-4">
                {footer}
              </footer> :
          null}
          </motion.div>
        </div> :
      null}
    </AnimatePresence>);

}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, description, footer, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ?
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label={title}>
        
          <motion.div
          className="absolute inset-0 bg-[#0d1411]/45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          onClick={onClose} />
        
          <motion.div
          className="relative w-full max-w-lg rounded-card border border-line bg-surface shadow-pop"
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
          
            <div className="border-b border-line px-5 py-4">
              <h2 className="font-display text-lg font-medium text-ink">{title}</h2>
              {description ? <p className="mt-0.5 text-[13px] text-body">{description}</p> : null}
            </div>
            <div className="px-5 py-4">{children}</div>
            {footer ?
          <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-3.5">{footer}</div> :
          null}
          </motion.div>
        </div> :
      null}
    </AnimatePresence>);

}