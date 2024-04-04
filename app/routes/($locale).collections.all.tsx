// Import necessary modules
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: 'Yooper Bros Coffee | All Products'},
    {
      name: 'description',
      content: 'Browse premium coffee. Shop now!',
    },
  ];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 71, //adjust when adding more products to store.
  });

  const {products} = await storefront.query(ALL_PRODUCTS_QUERY, {
    variables: paginationVariables,
  });

  return json({products});
}

export default function AllProducts() {
  const {products} = useLoaderData<typeof loader>();

  const filteredProducts = products.nodes.filter(
    (node: any) => node.metafield && node.metafield.value === 'yb',
  ) as ProductItemFragment[];

  return (
    <div className="collection">
      <h1>All Yooper Products</h1>
      <Pagination connection={products}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <>
            <PreviousLink>
              {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
            </PreviousLink>
            <ProductsGrid products={filteredProducts} />
            <br />
            <NextLink>
              {isLoading ? 'Loading...' : <span>Load more ↓</span>}
            </NextLink>
          </>
        )}
      </Pagination>
    </div>
  );
}

function ProductsGrid({products}: {products: ProductItemFragment[]}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map((product, index) => {
        return (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        );
      })}
    </div>
  );
}

function ProductItem({
  product,
  loading,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
      aria-label={product.title}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="1/1"
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h2>{product.title}</h2>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    metafield(namespace: "ptosf", key: "storefront") {
      value
    }
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

// const ALL_PRODUCTS_QUERY = `#graphql
//   ${PRODUCT_ITEM_FRAGMENT}
//   query AllProducts(
//     $country: CountryCode
//     $language: LanguageCode
//     $first: Int
//     $last: Int
//     $startCursor: String
//     $endCursor: String
//   ) @inContext(country: $country, language: $language) {
//     products(
//       first: $first
//       last: $last
//       before: $startCursor
//       after: $endCursor
//     ) {
//       nodes {
//         ...ProductItem
//         tags

//       }
//       pageInfo {
//         hasPreviousPage
//         hasNextPage
//         endCursor
//         startCursor
//       }
//     }
//   }
// ` as const;

const ALL_PRODUCTS_QUERY = `
  ${PRODUCT_ITEM_FRAGMENT}
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      query: "metafield:ptosf.storefront:yb"
    ) {
      nodes {
        ...ProductItem
        tags
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
` as const;
