import { useContext } from 'react';
import { DialogContext } from './index'; //! might have to replace with the absolute path

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('useDialog must be used within a DialogProvider');
  return context;
};