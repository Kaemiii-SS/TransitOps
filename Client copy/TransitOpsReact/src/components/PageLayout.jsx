import { motion } from 'framer-motion';

export default function PageLayout({ children, title, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6 w-full max-w-6xl mx-auto"
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-2">
          {title && <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>}
          {action && <div className="flex items-center gap-3">{action}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
}
