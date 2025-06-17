import { useDialog } from "./use-dialog";
import { Button } from "../button";
import { DialogAnimationTypes, DialogTypes } from "./index";

interface DialogDemoProps {
  type?: DialogTypes;
  animation?: DialogAnimationTypes;
  customContent?: boolean;
}

const DialogDemo = ({ 
  type = 'alert', 
  animation = 'popIn', 
  customContent = false 
}: DialogDemoProps) => {
    const { openDialog } = useDialog();
    
    const openDemoDialog = () => {
      const baseProps = {
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Dialog`,
        dialogType: type as DialogTypes,
        animationKey: animation as DialogAnimationTypes
      };
  
      if (customContent) {
        openDialog({
          ...baseProps,
          children: (
            <div className="space-y-4">
              <p>This is a custom content area with HTML elements.</p>
              <div className="p-3 bg-gray-100 rounded">
                <h4 className="font-semibold mb-2">Custom Section</h4>
                <p>You can put any React components here.</p>
              </div>
            </div>
          )
        });
      } else {
        openDialog({
          ...baseProps,
          content: `This is a ${type} dialog ${animation ? 'with ' + animation + ' animation' : ''}.`,
          ...(type === 'confirm' ? {
            confirmationCallBack: (confirmed: boolean) => {
              console.log('User confirmed:', confirmed);
            }
          } : {})
        });
      }
    };
  
    return (
      <Button onClick={openDemoDialog}>
        Open {type.charAt(0).toUpperCase() + type.slice(1)} Dialog
      </Button>
    );
  }
  
  export default DialogDemo;