/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCastVote = /* GraphQL */ `
  subscription OnCastVote {
    onCastVote {
      id
      name
      imageUrl
      canonicalUrl
      description
      votes
      createdAt
      updatedAt
    }
  }
`;
export const onCreateRecipe = /* GraphQL */ `
  subscription OnCreateRecipe {
    onCreateRecipe {
      id
      name
      imageUrl
      canonicalUrl
      description
      votes
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateRecipe = /* GraphQL */ `
  subscription OnUpdateRecipe {
    onUpdateRecipe {
      id
      name
      imageUrl
      canonicalUrl
      description
      votes
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteRecipe = /* GraphQL */ `
  subscription OnDeleteRecipe {
    onDeleteRecipe {
      id
      name
      imageUrl
      canonicalUrl
      description
      votes
      createdAt
      updatedAt
    }
  }
`;
export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame {
    onCreateGame {
      id
      complete
      recipes {
        id
        name
        imageUrl
        canonicalUrl
        description
        votes
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateGame = /* GraphQL */ `
  subscription OnUpdateGame {
    onUpdateGame {
      id
      complete
      recipes {
        id
        name
        imageUrl
        canonicalUrl
        description
        votes
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteGame = /* GraphQL */ `
  subscription OnDeleteGame {
    onDeleteGame {
      id
      complete
      recipes {
        id
        name
        imageUrl
        canonicalUrl
        description
        votes
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
