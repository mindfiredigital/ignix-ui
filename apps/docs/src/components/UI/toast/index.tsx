import React, {useRef, useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { ToastVariantTypes, ToastAnimationTypes } from './types'; //! might have to replace with the absolute path


interface ToastContainerData { 
  id: number; message: string; variant: ToastVariantTypes; 
  animation: ToastAnimationTypes, 
  mode?: 'dark' | 'light', 
  icon: React.ReactNode,
  appearance?: 'glow' | 'gradient';
  gradientColor?: string;
  duration?: number;
}
interface ToastNotificationProps extends ToastContainerData {
  onClose: (id: number) => void; // Callback to remove the toast
  timeoutMapRef: React.RefObject<Map<number, ReturnType<typeof setTimeout>>>;
}
export type ToastDataArgs = Omit<ToastContainerData, 'id'>;

export interface ToastManagerRef {
  addToast: (data: ToastDataArgs) => void;
}
export const ToastContext = React.createContext<ToastManagerRef | undefined>(undefined);


const animationVariants = {
  slide: {
      hidden: { x: '100%', opacity: 0, skewX: -30, scale: 0.5 },
      visible: { x: 0, opacity: 1, skewX: 0, scale: 1  },
      exit: { x: '100%', opacity: 0, skewX: 30, scale: 0.5  },
  },
  fade: {
      hidden: { opacity: 0},
      visible: { opacity: 1},
      exit: { opacity: 0},
  },
  bounce: {
      hidden: { y: -50, opacity: 0 },
      visible: { y: 0, opacity: 1 },
      exit: { y: -50, opacity: 0 },
  },
  pop: {
      hidden: { opacity: 0, scale: 0.5 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.5 },
  },
};

const getVariantStyles = (appearance: 'glow'|'gradient', variant: ToastVariantTypes, gradientColor: string) => {
if(appearance === 'glow') 
  {
    switch (variant) {
      case 'success':
        return {border: 'border-2 border-solid border-green-700',  
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.4)', };
      case 'error':
        return { border: 'border-2 border-solid border-red-700',   
                boxShadow: '0 0 10px 5px rgba(255, 0, 0, 0.5)', };
      case 'warning':
        return { border: 'border-2 border-solid border-yellow-400', 
            boxShadow: '0 0 10px rgba(252, 211, 77, 0.8), 0 0 20px rgba(252, 211, 77, 0.6), 0 0 30px rgba(252, 211, 77, 0.4)'};
      case 'info':
        return { border: 'border-2 border-solid border-blue-700',  
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.4)'};
      default:
        return {border: 'border-2 border-solid border-inherit'} ;
    }
  }
else 
  {
    return {borderLeft:`6px solid ${gradientColor}`, 
        background:`linear-gradient(135deg, ${createGradient(gradientColor)}, ${gradientColor})`};
  }

};

const createGradient = (color: string) => 
{
  const arr = color.slice(color.indexOf('(') + 1, color.indexOf(')')).split(',');
  if(arr.length > 3) 
  {
    arr.pop();
  }
  arr.push(' 0.7');
  const fromGrad = `rgba(${arr.join(',')})`;
  return fromGrad;
}

export const ToastProvider = ({ children, maxToasts = 100 }: { children: React.ReactNode, maxToasts?: number }) => {
    const [toasts, setToasts] = useState<ToastContainerData[]>([]);
    const timeoutMapRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
    const removeToast = useCallback((id: number) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
        const timeout = timeoutMapRef.current.get(id);
        if (timeout) {
          clearTimeout(timeout);
          timeoutMapRef.current.delete(id);
        }
      }, []);
    const addToast = (data: ToastDataArgs) => {
    const { message, variant, animation, mode, icon, appearance = 'glow', gradientColor = 'rgba(5, 1, 1, 1)', duration = 4000 } = data;
    const newToast = {id:Date.now() + Math.random(), message, variant, animation, mode, icon, appearance, gradientColor, duration}
    const updatedToasts = [newToast, ...toasts];
    // If the number of toasts exceeds maxToasts, remove the oldest one
    if (updatedToasts.length > maxToasts) {
        const deletedToast = updatedToasts.pop();
        removeToast(deletedToast?.id || 0);
    }
    setToasts(updatedToasts);
    };

      return (
        <ToastContext.Provider value={{addToast}}>
            {children}
            <div className="fixed top-16 right-5 mt-4 mr-4 w-sm space-y-8">
                <AnimatePresence>
                {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    variant={toast.variant}
                    message={toast.message}
                    animation={toast.animation}
                    onClose={(id) => removeToast(id)}
                    icon={toast.icon}
                    mode={toast.mode}
                    appearance={toast.appearance}
                    gradientColor={toast.gradientColor}
                    duration={toast.duration}
                    timeoutMapRef={timeoutMapRef}
                />
                ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
      );
}

//? Component for individual toast notifications
const Toast = ({ message, onClose, id, animation, variant='default', mode, icon, appearance='gradient', gradientColor='rgba(5, 1, 1, 1)', duration = 4000, timeoutMapRef }: ToastNotificationProps) => {
  const modeColor = appearance === 'glow' ? 
                                    mode === 'dark' ? 'bg-gradient-to-t from-gray-800 via-slate-800 to-gray-800 text-white' 
                                    : 'bg-white text-black'
                                    : '';
  gradientColor = gradientColor.indexOf('rgb') === -1 ? 'rgba(5, 1, 1, 1)' : gradientColor;
 

  useEffect(() => {
    const timeoutId = setTimeout(()=>onClose(id), duration); 
    const timeoutRefMap = timeoutMapRef.current; //capture the current timeoutRefMap
    timeoutRefMap.set(id, timeoutId);

    return () => {
      clearTimeout(timeoutId);
      timeoutRefMap.delete(id); // use captured reference
    };
  }, [duration]);

  return (
    <motion.div
      className={`toast p-1 rounded-lg shadow-lg mb-3 flex justify-between items-center ${modeColor}`}
      variants={animationVariants[animation]}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ type: 'spring', stiffness: 100, damping: 25 }}
      key={id}
      style={getVariantStyles(appearance, variant, gradientColor)}
      aria-live="assertive"
    >
        <motion.span className='p-2'
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: [50, 0], scale: 1 }}
            transition={{ duration: 1,
                    ease: "easeInOut",
                    type: "spring",
                    stiffness: 300,
                    }}>
            <span style={{color: `${gradientColor} !important`}}>{icon}</span>
            </motion.span>
        <p className={mode === 'dark' ? 'text-white' : 'text-black'}>{message}</p>
        <button onClick={()=>onClose(id)} className={`ml-4 mb-2 text-xs transform hover:scale-75 ${mode === 'dark' ? 'text-white' : 'text-black'} font-semibold hover:text-gray-400`}>
            <CrossCircledIcon/>
        </button>
    </motion.div>
  );
};