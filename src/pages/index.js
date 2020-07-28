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
  const [isAdmin, setIsAdmin] = useState(false);
  const [introTimer, setIntroTimer] = useState(5);
  const [votingTimer, setVotingTimer] = useState(60);

  async function getRecipes() {
    const response = await API.graphql(graphqlOperation(queries.listRecipes))
    setRecipes(response.data.listRecipes.items);
  };

  useEffect(() => {
    setIsAdmin(window.location.search.match(/admin=true/))
    getRecipes();
  }, []);

  // Start the intro Timer
  useEffect(() => {
    if (introTimer > 0) {
      let countdown = setTimeout(() => {
        setIntroTimer(introTimer - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    }
  }, [introTimer]);

  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(subscriptions.onCastVote)).subscribe({
      next: voteCasted => {
        const { id, votes } = voteCasted.value.data.onCastVote;
        setRecipes(recipes.map(recipe => recipe.id !== id ? recipe : { ...recipe, votes }));
      }
    });
    return () => subscription.unsubscribe()
  }, [recipes]);

  const onVote = (e, id) => {
    e.preventDefault();
    API.graphql(graphqlOperation(mutations.castVote, { input: { id } }));
  }

  const onReset = (e) => {
    e.preventDefault();
    setIntroTimer(5);
    // would be nice to do these in one operation but aws docs aren't very scannable
    recipes.forEach(({id}) => {
      API.graphql(graphqlOperation(mutations.updateRecipe, { input: { id, votes: 0 } }));
    });
  }

  const totalVotes = recipes.reduce((acc, next) => acc + next.votes, 0);

  return (
    <Layout pageTitle={title} description={description}>
      {
        introTimer > 0 && (
          <div className={styles.introTimerContainer}>
            <div className={styles.introTimer}>{introTimer}</div>
          </div>
        )
      }
      {
        introTimer === 0 && recipes.map(({ name, id, canonicalUrl, imageUrl, votes }) => {
          const percentOfVote = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
          return (
            <div className={styles.recipe} key={id}>
              <img className={styles.image} src={imageUrl} alt={`Image of ${name}`}/>
              <h3 className={styles.name}>
                <a href={canonicalUrl}>{name}</a>
              </h3>
              <div className={styles.graph}>
                <div className={styles.value}>{Math.round(percentOfVote)}%</div>
                <div className={styles.bar}>
                  <div className={styles.innerBar} style={{width: `${percentOfVote}%`}}>
                  </div>
                </div>
              </div>
              <button className={styles.button} onClick={(e) => onVote(e, id)}>Vote!</button>
            </div>
          )
        })
      }
      {
        isAdmin && (
          <div className={styles.admin}>
            <button onClick={onReset}>Reset</button>
          </div>
        )
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
