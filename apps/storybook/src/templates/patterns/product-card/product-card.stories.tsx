import type { Meta, StoryObj } from "@storybook/react-vite";
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
} from ".";

const meta: Meta<typeof ProductCard> = {
  title: "Templates/Patterns/ProductCard",
  component: ProductCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  render: (args) => (
    <ProductCard {...args}>
      <ProductCardHeader>
        <ProductCardImage
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"
          alt="New Product"
        />
        <ProductCardTag text="Best Seller" />
        <ProductCardWishlist />
      </ProductCardHeader>
      <ProductCardContent>
        <ProductCardSubHeading>Shoes</ProductCardSubHeading>
        <ProductCardTitle>Brand New Product</ProductCardTitle>
        <ProductCardRating value={4.6} outOf={128}/>
      </ProductCardContent>
      <ProductCardFooter>
        <ProductCardPrice currentPrice={3999} originalPrice={5000}/>
        <ProductCardButton />
      </ProductCardFooter>
    </ProductCard>
  ),
};

export const WithSize: Story = {
  render: (args) => (
    <ProductCard {...args}>
      <ProductCardHeader>
        <ProductCardImage
          src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
          alt="White traditional long dress"
        />
        <ProductCardDiscount originalPrice={5.99} currentPrice={3.99} />
        <ProductCardWishlist />
      </ProductCardHeader>
      <ProductCardContent>
        <ProductCardTitle>White traditional long dress</ProductCardTitle>
        <ProductCardSizes sizes={["S", "M", "L"]} />
        <ProductCardRating value={4} outOf={187}/>
      </ProductCardContent>
      <ProductCardFooter>
        <ProductCardPrice currentPrice={3.99} originalPrice={5.99} />
        <ProductCardButton />
      </ProductCardFooter>
    </ProductCard>
  ),
};

export const ProductPromoCode: Story = {
  render: (args) => (
    <ProductCard {...args}>
      <ProductCardHeader>
        <ProductCardImage
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"
          alt="Hush Puppies"
        />
        <ProductCardDiscount originalPrice={5.99} currentPrice={3.99} />
        <ProductCardWishlist />
      </ProductCardHeader>
      <ProductCardContent>
        <ProductCardTitle>Hush Puppies</ProductCardTitle>
        <ProductCardSizes sizes={["7", "8", "9", "10"]} />
        <ProductCardRating value={4.2} />
      </ProductCardContent>
      <ProductCardFooter>
        <ProductCardPrice currentPrice={3.99} originalPrice={5.99} />
        <ProductCardButton />
      </ProductCardFooter>
      <ProductCardPromo code="VEGANLOVE" text="Vegetarian Food" />
    </ProductCard>
  ),
};

export const ProductBestSellerAndDiscount: Story = {
  render: (args) => (
    <ProductCard {...args}>
      <ProductCardHeader>
        <ProductCardImage
          src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop"
          alt="Athens skirt"
        />
        <ProductCardTag text="Best Seller"/>
        <ProductCardDiscount originalPrice={5.99} currentPrice={3.99} />
        <ProductCardWishlist />
      </ProductCardHeader>
      <ProductCardContent>
        <ProductCardTitle>Athens skirt</ProductCardTitle>
        <ProductCardSizes sizes={["S", "M", "L"]} />
        <ProductCardRating value={3.8} />
      </ProductCardContent>
      <ProductCardFooter>
        <ProductCardPrice currentPrice={3.99} originalPrice={5.99} />
        <ProductCardButton />
      </ProductCardFooter>
      <ProductCardPromo code="VEGANLOVE" text="Vegetarian Food" />
    </ProductCard>
  ),
};

// Enhanced Stories with Better Design
export const Thumbnails: Story = {
  render: (args) => (
    <ProductCard {...args}>
      <ProductCardHeader>
        <ProductCardImage
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
          alt="Premium Headphones"
        />
        <ProductCardTag text="Premium" />
        <ProductCardDiscount originalPrice={299.99} currentPrice={199.99} />
        <ProductCardWishlist />
        <ProductCardThumbnails
          images={[
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
          ]}
        />
      </ProductCardHeader>
      <ProductCardContent>
        <ProductCardTitle>Premium Wireless Headphones Pro</ProductCardTitle>
        <ProductCardRating value={4.9} outOf={256} />
      </ProductCardContent>
      <ProductCardFooter>
        <ProductCardPrice currentPrice={199.99} originalPrice={299.99} />
        <ProductCardButton />
      </ProductCardFooter>
    </ProductCard>
  ),
};

// Card Size Variants
const PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop";

type CardSize = "sm" | "md" | "lg";

interface CardConfig {
  size: CardSize;
  title: string;
  tag?: string;
  productImage: string;
  price: { current: number; original?: number };
  rating: { value: number; outOf?: number };
  discount?: { current: number; original: number };
  thumbnails?: string[];
  sizes?: string[];
  subHeading?: string;
}

const cardConfigs: CardConfig[] = [
  {
    size: "sm",
    title: "Large Product Card with All Features",
    tag: "Premium",
    productImage: PRODUCT_IMAGE,
    price: { current: 75, original: 100 },
    rating: { value: 4.8, outOf: 256 },
    discount: { current: 75, original: 100 },
    thumbnails: [
      PRODUCT_IMAGE,
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    subHeading: "Electronics",
  },
  {
    size: "md",
    title: "Large Product Card with All Features",
    tag: "Premium",
    productImage: PRODUCT_IMAGE,
    price: { current: 75, original: 100 },
    rating: { value: 4.8, outOf: 256 },
    discount: { current: 75, original: 100 },
    thumbnails: [
      PRODUCT_IMAGE,
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    subHeading: "Electronics",
  },
  {
    size: "lg",
    title: "Large Product Card with All Features",
    tag: "Premium",
    productImage: PRODUCT_IMAGE,
    price: { current: 75, original: 100 },
    rating: { value: 4.8, outOf: 256 },
    discount: { current: 75, original: 100 },
    thumbnails: [
      PRODUCT_IMAGE,
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    subHeading: "Electronics",
  },
];

export const AllCardSizes: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-2">
      {cardConfigs.map(
        ({
          size,
          title,
          tag,
          productImage,
          price,
          rating,
          discount,
          thumbnails,
          sizes,
          subHeading,
        }) => (
          <ProductCard key={size} {...args} size={size}>
            <ProductCardHeader>
              <ProductCardImage src={productImage} alt={title} />

              {tag && <ProductCardTag text={tag} />}

              {discount && (
                <ProductCardDiscount
                  originalPrice={discount.original}
                  currentPrice={discount.current}
                />
              )}

              <ProductCardWishlist />

              {thumbnails && (
                <ProductCardThumbnails images={thumbnails} />
              )}

             
            </ProductCardHeader>

            <ProductCardContent>
              {subHeading && (
                <ProductCardSubHeading>{subHeading}</ProductCardSubHeading>
              )}
              <ProductCardTitle>{title}</ProductCardTitle>

              {sizes && <ProductCardSizes sizes={sizes} />}

              <ProductCardRating
                value={rating.value}
                outOf={rating.outOf}
              />
            </ProductCardContent>

            <ProductCardFooter>
              <ProductCardPrice
                currentPrice={price.current}
                originalPrice={price.original}
              />
              <ProductCardButton />
            </ProductCardFooter>
          </ProductCard>
        )
      )}
    </div>
  ),
};

const cardConfig: CardConfig[] = [
  {
    size: "sm",
    title: "Large Product Card with All Features",
    tag: "Premium",
    price: { current: 75, original: 100 },
    rating: { value: 4.8, outOf: 256 },
    discount: { current: 75, original: 100 },
    productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    thumbnails: [
      PRODUCT_IMAGE,
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    subHeading: "Electronics",
  },
  {
    size: "sm",
    title: "Large Product Card with All Features",
    tag: "Premium",
    price: { current: 75, original: 100 },
    rating: { value: 4.8, outOf: 256 },
    discount: { current: 75, original: 100 },
    productImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    thumbnails: [
      PRODUCT_IMAGE,
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    subHeading: "Electronics",
  },
  {
    size: "sm",
    title: "Large Product Card with All Features",
    tag: "Premium",
    price: { current: 75, original: 100 },
    rating: { value: 4.8, outOf: 256 },
    discount: { current: 75, original: 100 },
    productImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    thumbnails: [
      PRODUCT_IMAGE,
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    subHeading: "Electronics",
  },
];
export const CompleteExample: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-10">
      {cardConfig.map(
        ({
          size,
          title,
          tag,
          price,
          rating,
          discount,
          thumbnails,
          productImage,
          sizes,
          subHeading,
        }) => (
          <ProductCard key={size} {...args} size={size}>
            <ProductCardHeader>
              <ProductCardImage src={productImage} alt={title} />

              {tag && <ProductCardTag text={tag} />}

              {discount && (
                <ProductCardDiscount
                  originalPrice={discount.original}
                  currentPrice={discount.current}
                />
              )}

              <ProductCardWishlist />

              {thumbnails && (
                <ProductCardThumbnails images={thumbnails} />
              )}

             
            </ProductCardHeader>

            <ProductCardContent>
              {subHeading && (
                <ProductCardSubHeading>{subHeading}</ProductCardSubHeading>
              )}
              <ProductCardTitle>{title}</ProductCardTitle>

              {sizes && <ProductCardSizes sizes={sizes} />}

              <ProductCardRating
                value={rating.value}
                outOf={rating.outOf}
              />
            </ProductCardContent>

            <ProductCardFooter>
              <ProductCardPrice
                currentPrice={price.current}
                originalPrice={price.original}
              />
              <ProductCardButton />
            </ProductCardFooter>
          </ProductCard>
        )
      )}
    </div>
  ),
};