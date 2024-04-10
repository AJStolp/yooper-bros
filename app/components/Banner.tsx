import {useState} from 'react';

interface BannerProps {
  code: string;
}

export default function Banner({code}: BannerProps) {
  const [toggle, setToggle] = useState(true);

  function toggleBannerVisibility() {
    return setToggle(!toggle);
  }

  return (
    <div
      id="sticky-banner"
      tabIndex={-1}
      className={`${
        toggle ? 'start-0' : 'hidden'
      } flex justify-between w-full p-4 border-b border-background bg-secondary`}
    >
      <div className="flex items-center mx-auto">
        <p className="flex items-center text-sm font-normal">
          <span className="inline-flex p-1 me-3 bg-background rounded-full  w-6 h-6 items-center justify-center flex-shrink-0">
            <svg
              className="w-3 h-3 text-text"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 19"
            >
              <path d="M15 1.943v12.114a1 1 0 0 1-1.581.814L8 11V5l5.419-3.871A1 1 0 0 1 15 1.943ZM7 4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V4ZM4 17v-5h1v5H4ZM16 5.183v5.634a2.984 2.984 0 0 0 0-5.634Z" />
            </svg>
            <span className="sr-only">Mega Phone</span>
          </span>
          <span className="text-white">
            Use code:
            <span className="text-text px-1">{`${code}`}</span>
            for 10% off your first order + Enjoy Free Shipping!
            <a href={`/collections/all`} className="shop-now-btn pl-1">
              Shop Now!
            </a>
          </span>
        </p>
      </div>
      <div className="flex items-center">
        <button
          data-dismiss-target="#sticky-banner"
          type="button"
          className="flex-shrink-0 inline-flex justify-center w-7 h-7 items-center text-white hover:bg-background hover:text-accent rounded-lg text-sm p-1.5"
          onClick={toggleBannerVisibility}
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14 14"
            fill="currentColor"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close banner</span>
        </button>
      </div>
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
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
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;
