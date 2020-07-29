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
      games {
        items {
          id
          createdAt
          updatedAt
        }
        nextToken
      }
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
      games {
        items {
          id
          createdAt
          updatedAt
        }
        nextToken
      }
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
      games {
        items {
          id
          createdAt
          updatedAt
        }
        nextToken
      }
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
      games {
        items {
          id
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateRecipeGameEliminations = /* GraphQL */ `
  subscription OnCreateRecipeGameEliminations {
    onCreateRecipeGameEliminations {
      id
      game {
        id
        complete
        winner {
          id
          name
          imageUrl
          canonicalUrl
          description
          votes
          createdAt
          updatedAt
        }
        eliminated {
          nextToken
        }
        createdAt
        updatedAt
      }
      recipe {
        id
        name
        imageUrl
        canonicalUrl
        description
        votes
        games {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateRecipeGameEliminations = /* GraphQL */ `
  subscription OnUpdateRecipeGameEliminations {
    onUpdateRecipeGameEliminations {
      id
      game {
        id
        complete
        winner {
          id
          name
          imageUrl
          canonicalUrl
          description
          votes
          createdAt
          updatedAt
        }
        eliminated {
          nextToken
        }
        createdAt
        updatedAt
      }
      recipe {
        id
        name
        imageUrl
        canonicalUrl
        description
        votes
        games {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteRecipeGameEliminations = /* GraphQL */ `
  subscription OnDeleteRecipeGameEliminations {
    onDeleteRecipeGameEliminations {
      id
      game {
        id
        complete
        winner {
          id
          name
          imageUrl
          canonicalUrl
          description
          votes
          createdAt
          updatedAt
        }
        eliminated {
          nextToken
        }
        createdAt
        updatedAt
      }
      recipe {
        id
        name
        imageUrl
        canonicalUrl
        description
        votes
        games {
          nextToken
        }
        createdAt
        updatedAt
      }
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
      winner {
        id
        name
        imageUrl
        canonicalUrl
        description
        votes
        games {
          nextToken
        }
        createdAt
        updatedAt
      }
      eliminated {
        items {
          id
          createdAt
          updatedAt
        }
        nextToken
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
      winner {
        id
        name
        imageUrl
        canonicalUrl
        description
        votes
        games {
          nextToken
        }
        createdAt
        updatedAt
      }
      eliminated {
        items {
          id
          createdAt
          updatedAt
        }
        nextToken
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
      winner {
        id
        name
        imageUrl
        canonicalUrl
        description
        votes
        games {
          nextToken
        }
        createdAt
        updatedAt
      }
      eliminated {
        items {
          id
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
