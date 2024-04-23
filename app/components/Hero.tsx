export default function Hero() {
  return (
    <section className="mb-12  rounded p-4">
      <div className="grid max-w-screen-xl lg:px-4 pb-8 pt-4 mx-auto lg:gap-8 xl:gap-0  lg:grid-cols-12">
        <div className="h-fit w-full mr-auto place-self-center lg:col-span-7 text-text">
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
            Fuel Your Day with Good Ole Camp Coffee, eh?
          </h1>
          <p className="text-secondary max-w-2xl mb-6 font-light lg:mb-8 md:text-lg lg:text-xl">
            Indulge in our specially curated collection of coffee, tailored to
            suit your campfire adventures or cozy home mornings. Discover the
            ideal brew to elevate your coffee experience, whether you're in the
            wilderness or snuggled up indoors. We have a brew that'll have you
            saying 'Eh'mazing!
          </p>
          <a
            href="/collections/all"
            className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-text hover:bg-primary-800 focus:ring-4 focus:ring-primary-300"
          >
            Shop Now
            <svg
              className="w-5 h-5 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img
            src="/assets/yb-logo-main-nobg-transformed.png"
            className="w-full"
            alt="mockup"
          />
        </div>
      </div>
    </section>
  );
}
