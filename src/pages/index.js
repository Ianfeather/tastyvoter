import styles from './index.module.css';
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { useState, useEffect } from 'react';
import Layout from '@components/layout';
import Recipe from '@components/recipe';
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

  const totalVotes = recipes.reduce((acc, next) => acc + next.votes, 0);

  return (
    <Layout pageTitle={title} description={description}>
      {
        recipes.map(({ name, id, canonicalUrl, imageUrl, votes }) => {
          const width = (votes / totalVotes) * 100;
          return (
            <div className={styles.recipe} key={id}>
              <img className={styles.image} src={imageUrl} alt={`Image of ${name}`}/>
              <h3 className={styles.name}>
                <a href={canonicalUrl}>{name}</a>
              </h3>
              <div className={styles.graph}>
                <div className={styles.value}>{votes}</div>
                <div className={styles.bar}>
                  <div className={styles.innerBar} style={{width: `${width}%`}}>
                  </div>
                </div>
              </div>
              <button className={styles.button} onClick={(e) => onVote(e, id)}>Vote!</button>
            </div>
          )
        })
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
