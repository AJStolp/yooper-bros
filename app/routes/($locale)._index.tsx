import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import Hero from '~/components/Hero';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  // Query featured collections with the metafield value 'yb'
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);

  // Query recommended products filtered by the storefront value 'yb'
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  // Return both the filtered collections and recommended products
  return defer({
    featuredCollections: collections.nodes,
    recommendedProducts,
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  // Filter featured collection for 'yb'
  const featuredCollection = data.featuredCollections.find(
    (collection) => collection.metafield && collection.metafield.value === 'yb',
  );

  return (
    <div className="home">
      <Hero />
      <FeaturedCollection collection={featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function AddToCartButton({
  analytics,
  children,
  disabled,
  variantId, // Accept the variant ID as a prop
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  variantId: string; // Variant ID prop
  onClick?: () => void;
}) {
  // Create the lines object with the correct structure
  const lines = [
    {
      merchandiseId: variantId, // Use the variant ID
      quantity: 1, // You can adjust the quantity as needed
    },
  ];

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className="bg-primary rounded py-2 px-4 text-text"
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment | undefined;
}) {
  if (!collection) return null;

  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {collection.image && (
        <div className="featured-collection-image">
          <Image data={collection.image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div className="recommended-products">
      <h2>Coffee Connoisseur's Picks</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => {
            const filteredProducts = products.nodes.filter(
              (product) => product.metafield?.value === 'yb', // Adjust filter logic
            );
            return (
              <div className="recommended-products-grid">
                {filteredProducts.map((product) => (
                  <section key={product.id}>
                    <Link
                      className="recommended-product rounded-lg"
                      to={`/products/${product.handle}`}
                    >
                      <Image
                        data={product.images.nodes[0]}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                        alt={`product name: ${product.title}`}
                      />
                    </Link>
                    <section className="bg-accent text-background rounded p-2 flex flex-col lg:flex-row lg:justify-between">
                      <div className="pb-2">
                        <h3 className="text">{product.title}</h3>
                        <small className="text-sm">
                          <Money data={product.priceRange.minVariantPrice} />
                        </small>
                      </div>
                      {/* <AddToCartButton variantId={product.variants.nodes[0].id}>
                        Add to Cart
                      </AddToCartButton> */}
                    </section>
                  </section>
                ))}
              </div>
            );
          }}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    metafield(namespace: "tosf", key: "storefront") {
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1,  query: "metafield:tosf:storefront:yb") {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    tags
    metafield(namespace: "ptosf", key: "storefront") {
      value
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: BEST_SELLING, query: "metafield:storefront:yb") {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
