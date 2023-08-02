import { AnimatePresence, motion } from 'framer-motion';
import React, { PropsWithChildren } from 'react';

interface IProps {
  open: boolean;
}

const Opacity: React.FC<PropsWithChildren<IProps>> = ({ open, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Opacity;
