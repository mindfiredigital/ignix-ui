import React, { useState } from 'react';
import {
  ProductCard,
  ProductCardHeader,
  ProductCardImage,
  ProductCardDiscount,
  ProductCardWishlist,
  ProductCardTag,
  ProductCardThumbnails,
  ProductCardSubHeading,
  ProductCardContent,
  ProductCardTitle,
  ProductCardPrice,
  ProductCardSizes,
  ProductCardRating,
  ProductCardButton,
  ProductCardFooter,
  ProductCardPromo,
} from '@site/src/components/UI/product-card';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const sizeOptions = ['sm', 'md', 'lg'] as const;
type CardSize = typeof sizeOptions[number];

const PRODUCT_IMAGE = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop";

const ProductCardDemo = () => {
  const [size, setSize] = useState<CardSize>('sm');
  const [showTag, setShowTag] = useState<boolean>(false);
  const [showDiscount, setShowDiscount] = useState<boolean>(false);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false);
  const [showSizes, setShowSizes] = useState<boolean>(false);
  const [showPromo, setShowPromo] = useState<boolean>(false);

  // Build code string
  const codeParts: string[] = [];
  
  codeParts.push(`<ProductCard size="${size}">`);
  
  codeParts.push(`  <ProductCardHeader>`);
  codeParts.push(`    <ProductCardImage 
      src="${PRODUCT_IMAGE}"
      alt="Premium Product"
    />`);
  
  if (showTag) {
    codeParts.push(`    <ProductCardTag text="Best Seller" />`);
  }
  
  if (showDiscount) {
    codeParts.push(`    <ProductCardDiscount 
      originalPrice={99.99}
      currentPrice={79.99}
    />`);
  }
                
  codeParts.push(`    <ProductCardWishlist />`);
  
  if (showThumbnails) {
    codeParts.push(`    <ProductCardThumbnails 
      images={[
        "${PRODUCT_IMAGE}",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
      ]}
    />`);
  }
  
  
  codeParts.push(`  </ProductCardHeader>`);
  
  codeParts.push(`  <ProductCardContent>`);
  codeParts.push(`    <ProductCardSubHeading>Electronics</ProductCardSubHeading>`);
  codeParts.push(`    <ProductCardTitle>Premium Wireless Headphones Pro</ProductCardTitle>`);
  
  if (showSizes) {
    codeParts.push(`    <ProductCardSizes sizes={["S", "M", "L", "XL"]} />`);
  }
  
  codeParts.push(`    <ProductCardRating value={4.8} outOf={256} />`);
  
  codeParts.push(`  </ProductCardContent>`);
  
  codeParts.push(`  <ProductCardFooter>`);
  codeParts.push(`    <ProductCardPrice 
      currentPrice={79.99}
      originalPrice={99.99}
    />`);
  codeParts.push(`    <ProductCardButton />`);
  codeParts.push(`  </ProductCardFooter>`);
  
  if (showPromo) {
    codeParts.push(`  <ProductCardPromo code="SAVE20" text="Use Code" />`);
  }
  
  codeParts.push(`</ProductCard>`);
  
  const codeString = codeParts.join('\n');

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-1">
          <VariantSelector
            variants={[...sizeOptions]}
            selectedVariant={size}
            onSelectVariant={(value) => setSize(value as CardSize)}
            type="Size"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-start sm:justify-end rounded-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showTag}
            onChange={(e) => setShowTag(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Tag</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showDiscount}
            onChange={(e) => setShowDiscount(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Discount</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showThumbnails}
            onChange={(e) => setShowThumbnails(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Thumbnails</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showSizes}
            onChange={(e) => setShowSizes(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Sizes</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showPromo}
            onChange={(e) => setShowPromo(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Promo</span>
        </label>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 p-4 rounded-lg overflow-hidden mt-4 flex justify-center">
            <ProductCard size={size}>
              <ProductCardHeader>
                <ProductCardImage 
                  src={PRODUCT_IMAGE}
                  alt="Premium Product"
                />
                {showTag && <ProductCardTag text="Best Seller" />}
                {showDiscount && (
                  <ProductCardDiscount 
                    originalPrice={99.99}
                    currentPrice={79.99}
                  />
                )}
                <ProductCardWishlist />
                {showThumbnails && (
                  <ProductCardThumbnails 
                    images={[
                      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
                      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
                      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop",
                    ]}
                  />
                )}
              </ProductCardHeader>
              <ProductCardContent>
                <ProductCardSubHeading>Electronics</ProductCardSubHeading>
                <ProductCardTitle>Premium Wireless Headphones Pro</ProductCardTitle>
                {showSizes && <ProductCardSizes sizes={["S", "M", "L", "XL"]} />}
                <ProductCardRating value={4.8} outOf={256} />
              </ProductCardContent>
              <ProductCardFooter>
                <ProductCardPrice 
                  currentPrice={79.99}
                  originalPrice={99.99}
                />
                <ProductCardButton />
              </ProductCardFooter>
              {showPromo && <ProductCardPromo code="SAVE20" text="Use Code" />}
            </ProductCard>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <div className="mt-4">
            <CodeBlock language="tsx" className="text-sm">
              {codeString}
            </CodeBlock>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};

export { ProductCardDemo };

