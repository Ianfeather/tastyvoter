import styles from './index.module.css';
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/layout';
import * as customQueries from "../graphql/custom/queries";
import * as mutations from "../graphql/mutations";
import * as subscriptions from "../graphql/subscriptions";
import config from '../aws-exports';
Amplify.configure(config);

const INTRO_TIMER_DURATION = 5;
const VOTING_TIMER_DURATION = 20;

const Index = () => {
  let [recipes, setRecipes] = useState([]);
  let [eliminatedRecipes, setEliminatedRecipes] = useState([]);
  let [game, setGame] = useState(null);

  let [isAdmin, setIsAdmin] = useState(false);
  let [introTimer, setIntroTimer] = useState(INTRO_TIMER_DURATION);
  let [votingTimer, setVotingTimer] = useState(VOTING_TIMER_DURATION);

  /*
   * Functions called from useEffect hooks
   */

  async function getInitialState() {
    const { data } = await API.graphql(graphqlOperation(customQueries.initialState));
    const recipes = data.listRecipes.items;
    setRecipes(recipes);
    const games = data.listGames.items;
    if (!games.length) { return; }

    const offsetSeconds = Math.round((Date.now() - new Date(games[0].createdAt)) / 1000);
    if (offsetSeconds > INTRO_TIMER_DURATION + VOTING_TIMER_DURATION) {
      return;
    }

    if (offsetSeconds < 5) {
      setIntroTimer(INTRO_TIMER_DURATION - offsetSeconds);
    } else {
      setIntroTimer(0);
      setVotingTimer(VOTING_TIMER_DURATION + INTRO_TIMER_DURATION - offsetSeconds);
    }
    setGame(game);
  }

  const clearRecipeVotes = useCallback(async () => {
    if (!isAdmin) { return }
    // would be nice to do these in one operation but aws docs aren't very scannable
    const newRecipes = await Promise.all(recipes.map(async ({id}) => {
      const { data } = await API.graphql(graphqlOperation(mutations.updateRecipe, { input: { id, votes: 0 } }));
      return data.updateRecipe;
    }));
    setRecipes(newRecipes);
  }, [isAdmin, recipes]);

  const markGameAsComplete = useCallback(async () => {
    const winner = recipes.reduce((acc, next) => next.votes > acc.votes ? next : acc);
    setGame({ ...game, complete: true, winner: recipes.find(({id}) => id === winner.id)});
    if (!isAdmin) { return }
    API.graphql(graphqlOperation(mutations.updateGame, { input: { id: game.id, complete: true, gameWinnerId: winner.id }}));
  }, [game, isAdmin, recipes]);

  const eliminateRecipe = useCallback(async (recipe) => {
    if (!isAdmin) { return }
    API.graphql(graphqlOperation(mutations.createRecipeGameEliminations, {input: {
      recipeGameEliminationsGameId: game.id,
      recipeGameEliminationsRecipeId: recipe.id
    }}));
  }, [game, isAdmin]);

  async function createGame() {
    if (!isAdmin) { return }
    API.graphql(graphqlOperation(mutations.createGame, { input: { complete: false }}));
  }


  /*
   * All useEffect hooks
   */

  // On Load, check for admin privileges and get initial state
  useEffect(() => {
    setIsAdmin(window.location.search.match(/admin=true/))
    getInitialState();
  }, []);

  // The game intro countdown
  useEffect(() => {
    if (game && introTimer > 0) {
      let timer = setTimeout(() => setIntroTimer(introTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [game, introTimer]);

  // The in-game timer
  useEffect(() => {
    if (game && introTimer === 0 && votingTimer > 0) {
      let timer = setTimeout(() => setVotingTimer(votingTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [game, introTimer, votingTimer]);

  // Game Logic that depends on the timer
  useEffect(() => {
    if (votingTimer === Math.round(VOTING_TIMER_DURATION / 2)) {
      const sortedRecipesByVote = [...recipes].sort((a, b) => a.votes - b.votes);
      eliminateRecipe(sortedRecipesByVote[0]);
    }

    if (votingTimer === Math.round((VOTING_TIMER_DURATION / 4) * 1)) {
      const sortedRecipesByVote = [...recipes].sort((a, b) => a.votes - b.votes);
      eliminateRecipe(sortedRecipesByVote[1]);
    }

    if (votingTimer === 0 && !game.complete) {
      markGameAsComplete();
    }
  }, [votingTimer, eliminateRecipe, markGameAsComplete, recipes, game]);

  /*
   * Set up the subscriptions to remote data changes
   */

  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(subscriptions.onCreateGame)).subscribe({
      next: ({ value }) => {
        setIntroTimer(INTRO_TIMER_DURATION);
        setVotingTimer(VOTING_TIMER_DURATION);
        setEliminatedRecipes([]);
        setGame(value.data.onCreateGame);
      }
    });
    return () => subscription.unsubscribe()
  }, []);

  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(subscriptions.onUpdateGame)).subscribe({
      next: ({ value }) => {
        const game = {
          ...value.data.onUpdateGame,
          complete: true,
          winner: recipes.find(({id}) => id === value.data.onUpdateGame.winner.id)
        };
        setGame(game);
      }
    });
    return () => subscription.unsubscribe()
  }, [recipes]);

  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(subscriptions.onCastVote)).subscribe({
      next: ({ value }) => {
        const { id, votes } = value.data.onCastVote;
        setRecipes(recipes.map(recipe => recipe.id !== id ? recipe : { ...recipe, votes }));
      }
    });
    return () => subscription.unsubscribe()
  }, [recipes]);

  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(subscriptions.onCreateRecipeGameEliminations)).subscribe({
      next: ({ value }) => {
        const recipes = [ ...eliminatedRecipes, value.data.onCreateRecipeGameEliminations.recipe.id];
        setEliminatedRecipes(recipes)
      }
    });
    return () => subscription.unsubscribe()
  }, [eliminatedRecipes])

  /*
   * Event Listeners
   */

  const onVote = (e, id) => {
    e.preventDefault();
    setRecipes(recipes.map(recipe => recipe.id !== id ? recipe : { ...recipe, votes: recipe.votes + 1 }));
    API.graphql(graphqlOperation(mutations.castVote, { input: { id } }));
  }

  const onStart = (e) => {
    e.preventDefault();
    clearRecipeVotes();
    createGame();
  }

  /*
   * Some computed state
   */
  const totalVotes = recipes.reduce((acc, next) => acc + next.votes, 0);
  const state = {
    pregame: !game,
    intro: game && introTimer > 0,
    voting: game && introTimer === 0
  };

  return (
    <Layout>
      <div className={styles.headerContainer}>
        {
          state.voting && (
            <>
              <div className={styles.explainer}>
                <p className={styles.title}>What are we cooking?! Cast your vote.</p>
                <p className={styles.subtitle}>Ingredients for the winning recipe will be 50% off at Walmart!</p>
              </div>
              {
                game && game.complete ?
                  <div className={`${styles.votingTimer} ${styles.outOfTime}`}>
                    Out of time!
                  </div> :
                  <div className={styles.votingTimer}>
                    <div className={styles.circle} />
                    {votingTimer}
                  </div>
              }
            </>
          )
        }
      </div>
      {
        state.pregame && (
          <div className={`${styles.introContainer}`}>

          </div>
        )
      }
      {
        state.intro && (
          <div className={`${styles.introContainer} ${styles.introTimerContainer}`}>
            <div className={styles.introTimerBg}>
              <h2 className={styles.introTimer}>{introTimer}</h2>
            </div>
          </div>
        )
      }
      {
        state.voting && recipes.map(({ name, id, canonicalUrl, imageUrl, votes }, index) => {
          const percentOfVote = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
          const isEliminated = eliminatedRecipes.some(_id => _id === id);
          const buttonDisabled = isEliminated || game.complete;
          const positionClassName = styles[`position${index}`];
          let isWinner = false;
          let completeClassName = '';
          if (game && game.complete) {
            isWinner = game && game.winner.id === id;
            completeClassName = isWinner ? styles.winner : styles.loser;
          }
          return (
            <div className={`${styles.recipeContainer} ${completeClassName} ${positionClassName}`} key={id}>
              <div className={`${styles.recipe} ${isEliminated && !isWinner ? styles.disabled : ''}`}>
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
                <button disabled={buttonDisabled} className={`${styles.button} ${ votes > 0 ? styles.voted : ''}`} onClick={(e) => onVote(e, id)}>{ votes > 0 ? 'Vote again!' : 'Vote!'}</button>
                {
                  isWinner && (
                    <div className={styles.walmartMoneyPlease}>
                      <h3 className={styles.walmartTitle}>Get the winning ingredients 50% off thanks to our dear friends at walmart!</h3>
                      <button className={styles.walmartButton}>Buy now!</button>
                      <div className={styles.walmartDisclaimer}>(Walmart please, if you&apos;re listening, it&apos;s a great idea)</div>
                    </div>
                  )
                }
              </div>
              { isEliminated && !isWinner (
                <div className={`${styles.label} ${styles.labelEliminated}`}>Not today :(</div>
              )}
              { isWinner && (
                <div className={styles.label}>Winner!</div>
              )}
            </div>
          )
        })
      }
      {
        isAdmin && (
          <div className={styles.admin}>
            <button onClick={onStart}>Start Game</button>
          </div>
        )
      }
    </Layout>
  )
}

export default Index
