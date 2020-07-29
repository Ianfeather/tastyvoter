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

  let [recipes, setRecipes] = useState([]);
  let [isAdmin, setIsAdmin] = useState(false);
  let [introTimer, setIntroTimer] = useState(5);
  let [votingTimer, setVotingTimer] = useState(10);
  let [winningRecipe, setWinningRecipe] = useState({});

  async function getRecipes() {
    const response = await API.graphql(graphqlOperation(queries.listRecipes))
    setRecipes(response.data.listRecipes.items);
  };

  async function clearRecipeVotes() {
    // would be nice to do these in one operation but aws docs aren't very scannable
    const newRecipes = await Promise.all(recipes.map(async ({id}) => {
      const { data } = await API.graphql(graphqlOperation(mutations.updateRecipe, { input: { id, votes: 0 } }));
      return data.updateRecipe;
    }));
    setRecipes(newRecipes);
  }

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

  // Start the Voting Timer
  useEffect(() => {
    if (introTimer === 0 && votingTimer > 0) {
      let countdown = setTimeout(() => {
        setVotingTimer(votingTimer - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    }
    if (votingTimer === 0) {
      setWinningRecipe(recipes.reduce((acc, next) => next.votes > acc.votes ? next : acc))
      clearRecipeVotes();
    }
  }, [introTimer, votingTimer]);

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

  const onReset = async (e) => {
    e.preventDefault();
    setIntroTimer(5);
    setVotingTimer(10);
    clearRecipeVotes();
  }

  const totalVotes = recipes.reduce((acc, next) => acc + next.votes, 0);

  const state = {
    intro: introTimer > 0,
    voting: introTimer === 0 && votingTimer > 0,
    complete: introTimer === 0 && votingTimer === 0
  };

  return (
    <Layout pageTitle={title} description={description}>
      <div className={styles.headerContainer}>
        <header className="header">What are we eating?!</header>
        {
          state.voting && (
            <div className={styles.votingTimer}>
              {votingTimer}
            </div>
          )
        }
      </div>
      {
        state.intro && (
          <div className={styles.introTimerContainer}>
            <div className={styles.introTimer}>{introTimer}</div>
          </div>
        )
      }
      {
        state.voting && recipes.map(({ name, id, canonicalUrl, imageUrl, votes }) => {
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
        state.complete && (
          <div className={styles.winningContainer}>
            <div className={styles.winningRecipe}>
              <div className={styles.name}>
                And the winner is...
                <h3><a href={winningRecipe.canonicalUrl}>{winningRecipe.name}!</a></h3>
              </div>
              <img className={styles.winningImage} src={winningRecipe.imageUrl} alt={`Image of ${winningRecipe.name}`}/>

            </div>

            <div className={styles.rightColumn}>
              <div className={styles.walmartMoneyPlease}>
                <h3 className={styles.walmartTitle}>Get the winning ingredients 50% off thanks to our dear friends at walmart!</h3>
                <button className={styles.walmartButton}>Buy now!</button>
                <div className={styles.walmartDisclaimer}>(Walmart please, if you're listening, it's a great idea)</div>
              </div>

              <div className={styles.video}>
                <img className={styles.videoImage} src="https://user-images.githubusercontent.com/814861/88680590-93453d80-d0e8-11ea-862d-70e3730f5f3a.png" alt="video still of cooking the recipe"/>
              </div>
            </div>
          </div>

        )
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
