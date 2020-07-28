import Amplify, { API, graphqlOperation } from "aws-amplify";
import { useState, useEffect } from 'react';
import Layout from '@components/layout'
import Recipe from '@components/recipe'
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import * as subscriptions from "../graphql/subscriptions";
import config from '../aws-exports';
Amplify.configure(config);

const Index = ({ title, description, ...props }) => {

  const [recipes, setRecipes] = useState([]);


  // This will only run once on load
  async function getRecipes() {
    const response = await API.graphql(graphqlOperation(queries.listRecipes))
    setRecipes(response.data.listRecipes.items);
  };

  useEffect(() => { getRecipes() }, []);

  useEffect(() => {
    // doesn't seem right to be setting up the listener each time?
    const subscription = API.graphql(graphqlOperation(subscriptions.onCastVote)).subscribe({
      next: voteCasted => {
        const id = voteCasted.value.data.onCastVote.id;
        const votes = voteCasted.value.data.onCastVote.votes;
        setRecipes(recipes.map(recipe => {
          if (recipe.id !== id) {
            return recipe;
          }
          return { ...recipe, votes };
        }));
      }
    });
    return () => subscription.unsubscribe()
  }, [recipes]);

  const onVote = (e, id) => {
    e.preventDefault();
    API.graphql(graphqlOperation(mutations.castVote, { input: { id } }));
  }

  return (
    <Layout pageTitle={title} description={description}>
      {
        recipes.map(({ name, id, canonicalUrl, imageUrl, votes }) => (
          <Recipe
            name={name}
            id={id}
            canonicalUrl={canonicalUrl}
            imageUrl={imageUrl}
            votes={votes}
            onVote={onVote}
            key={id}
          />
        ))
      }
    </Layout>
  )
}

export default Index

export async function getStaticProps() {
  return {
    props: {
      title: "Choose your meal",
      description: "50% off",
    },
  }
}
