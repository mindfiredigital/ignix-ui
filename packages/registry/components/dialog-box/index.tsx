import { motion, AnimatePresence } from 'framer-motion';
import { createContext, CSSProperties, useState } from 'react';

// types/dialog.ts
export interface DialogRef {
  open: (options?: DialogProps) => void;
  close: () => void;
}

export type DialogAnimationTypes = 'popIn'
  | 'springPop'
  | 'backdropZoom'
  | 'flip3D'
  | 'skewSlide'
  | 'glassBlur'
  | 'skyDrop';
export type DialogTypes = 'success' | 'confirm' | 'error' | 'alert';
export const animations = {
  popIn: {
    initial: { scale: 0.4, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.4, opacity: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  springPop: {
    initial: { y: 100, opacity: 0, scale:0.2, transition: { duration: 0.4 }},
    animate: { y: [50, 0], opacity: 1, scale: 1, transition: { duration: 1.2, type:'spring', stiffness:100, ease: 'easeOut' }, },
    exit: { y: 100, scale: 0.2, opacity: [0.8, 0.4, 0], transition: { duration: 0.4 } },
    
  },
  backdropZoom: {
      initial: { scale: 1.2, opacity: 0 },
      animate: { scale: 1, opacity: 1, transition: { duration: 0.8, type:'spring', stiffness:200, ease: 'easeInOut' } },
      exit: { scale: 0.95, opacity: 0 },
  },
  flip3D: {
    initial: { rotateY: -180, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -180, opacity: 0 },
    transition: { duration: 0.7, ease: 'easeInOut' },
  },
  skewSlide: {
    initial: { skewY: -30, skewX:-30, scale: 0.2, y: -300, x: -300, opacity: 0 },
    animate: { skewY: 0, skewX:0, scale: 1, y: 0, x: 0, opacity: [0.5, 1] },
    exit: { skewY: 30, skewX:30, scale: 0.2, y: -300, x: 300, opacity: [0.8, 0.4, 0] },
    transition: { duration: 1, ease: 'easeInOut' },
  },
  glassBlur: {
    initial: { opacity: 0 },
    animate: { opacity: [0.5, 1] },
    exit: { opacity: 0 },
    transition: { duration: 0.8, ease: 'easeInOut' },
  },
  skyDrop: {
    initial: { y: -300, opacity: 0 },
    animate: { y: 0, opacity: [0.5, 1]},
    exit: { y: -300, opacity: 0 },
    transition: { duration: 0.6, ease: 'easeInOut' },
  }
};

interface DialogProps{
  animationKey?: DialogAnimationTypes;
  confirmationCallBack?: (confirm: boolean) => void;
  dialogType?: DialogTypes;
  title?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  headerStyles?: CSSProperties;
  children?: React.ReactNode;
  defaultButtons?: boolean;
  content?: string
}

const headerGradient = (type: DialogTypes) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-400 to-green-600';
      case 'confirm':
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
      case 'error':
        return 'bg-gradient-to-r from-red-400 to-red-600';
      case 'alert':
        return 'bg-gradient-to-r from-yellow-300 to-yellow-500';
      default:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
    }
  };
export interface DialogContextType 
{
    openDialog: (opts: DialogProps) => void;
    closeDialog: () => void;
}
  
export const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DialogProps>({
    dialogType: 'alert',
    title: 'Default Title',
  });
  const openDialog = (opts: DialogProps) => {
    const finalOptions: DialogProps = {
        animationKey: 'popIn',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        defaultButtons: false,
        ...opts, // override defaults
      };
      setOptions(finalOptions);
      setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false)
  };
  const handleClose = (confirm = false) => {
    setIsOpen(false);
    if (options?.dialogType === 'confirm' && options?.confirmationCallBack) {
      options?.confirmationCallBack(confirm);
    } 
  }
  const anim = animations[options?.animationKey || 'popIn'];
  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[70vh] flex flex-col m-4"
            {...anim}
          >
            <div className={`flex items-center justify-center rounded-t-xl ${headerGradient(options?.dialogType || 'alert')} p-2`}
            style={options?.headerStyles}>
                <h2 className="text-xl font-bold">{options?.title}</h2>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              {options.children ?? <p>{options.content}</p>}
            </div>
            { !options?.defaultButtons && <div className="flex items-center justify-center space-x-4  gap-4 p-4">              
                    {
                        options?.dialogType === 'confirm' && 
                        <button onClick={()=>handleClose(true)} className="px-6 py-2 font-medium bg-indigo-500 text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
                            {options?.confirmButtonText || 'Confirm'}
                        </button>
                    }
                    <button onClick={()=>handleClose(false)} className="px-6 py-2 font-medium bg-gray-100 text-black w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
                        {options?.cancelButtonText || 'Cancel'}
                    </button>
            </div>}
            
          </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
};
