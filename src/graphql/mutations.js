/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const castVote = /* GraphQL */ `
  mutation CastVote($input: CastVoteInput!) {
    castVote(input: $input) {
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
export const createRecipe = /* GraphQL */ `
  mutation CreateRecipe(
    $input: CreateRecipeInput!
    $condition: ModelRecipeConditionInput
  ) {
    createRecipe(input: $input, condition: $condition) {
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
export const updateRecipe = /* GraphQL */ `
  mutation UpdateRecipe(
    $input: UpdateRecipeInput!
    $condition: ModelRecipeConditionInput
  ) {
    updateRecipe(input: $input, condition: $condition) {
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
export const deleteRecipe = /* GraphQL */ `
  mutation DeleteRecipe(
    $input: DeleteRecipeInput!
    $condition: ModelRecipeConditionInput
  ) {
    deleteRecipe(input: $input, condition: $condition) {
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
export const createRecipeGameEliminations = /* GraphQL */ `
  mutation CreateRecipeGameEliminations(
    $input: CreateRecipeGameEliminationsInput!
    $condition: ModelRecipeGameEliminationsConditionInput
  ) {
    createRecipeGameEliminations(input: $input, condition: $condition) {
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
export const updateRecipeGameEliminations = /* GraphQL */ `
  mutation UpdateRecipeGameEliminations(
    $input: UpdateRecipeGameEliminationsInput!
    $condition: ModelRecipeGameEliminationsConditionInput
  ) {
    updateRecipeGameEliminations(input: $input, condition: $condition) {
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
export const deleteRecipeGameEliminations = /* GraphQL */ `
  mutation DeleteRecipeGameEliminations(
    $input: DeleteRecipeGameEliminationsInput!
    $condition: ModelRecipeGameEliminationsConditionInput
  ) {
    deleteRecipeGameEliminations(input: $input, condition: $condition) {
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
export const createGame = /* GraphQL */ `
  mutation CreateGame(
    $input: CreateGameInput!
    $condition: ModelGameConditionInput
  ) {
    createGame(input: $input, condition: $condition) {
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
export const updateGame = /* GraphQL */ `
  mutation UpdateGame(
    $input: UpdateGameInput!
    $condition: ModelGameConditionInput
  ) {
    updateGame(input: $input, condition: $condition) {
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
export const deleteGame = /* GraphQL */ `
  mutation DeleteGame(
    $input: DeleteGameInput!
    $condition: ModelGameConditionInput
  ) {
    deleteGame(input: $input, condition: $condition) {
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
