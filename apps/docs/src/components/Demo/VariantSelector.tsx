import React from 'react';
import { Dropdown, DropdownItem } from '@site/src/components/UI/dropdown';
import { Button } from '@site/src/components/UI/button';

interface VariantSelectorProps {
  variants: string[];
  selectedVariant: string;
  onSelectVariant: (variant: string) => void;
  type?: string;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
  type = 'Variant',
}) => {
  return (
    <div className="flex justify-end mb-4 ">
      <Dropdown animation='default' className='max-h-[500px] overflow-y-scroll' bg='default' trigger={<Button variant="outline">{type}: {selectedVariant}</Button>}>
        {variants.map((v) => (
          <DropdownItem key={v} onClick={() => onSelectVariant(v)}>
            {v}
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  );
};

export default VariantSelector;
