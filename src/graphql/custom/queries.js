export const initialState = /* GraphQL */ `
  query initialState {
    listGames(filter: { complete: { eq: false }}) {
      items {
        id
        complete
        createdAt
        winner {
          id
        }
      }
    },
    listRecipes {
      items {
        id
        name
        imageUrl
        canonicalUrl
        votes
      }
    }
  }
`;
