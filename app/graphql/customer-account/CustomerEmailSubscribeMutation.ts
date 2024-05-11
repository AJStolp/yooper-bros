// NOTE: Mutation to subscribe a customer to email marketing
export const SUBSCRIBE_TO_EMAIL_MARKETING_MUTATION = `#graphql
  mutation customerEmailMarketingSubscribe {
    customerEmailMarketingSubscribe {
      emailAddress {
        email
      }
      userErrors {
        code
        field
        message
      }
    }
  }
` as const;
