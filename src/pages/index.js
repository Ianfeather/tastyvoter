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
  let [game, setGame] = useState({ id:1, complete: true, winner: {"id":"7fbaa316-9084-43f0-be01-4d90854562aa","name":"Chicken Tikka Biryani","imageUrl":"https://img.buzzfeed.com/video-api-prod/assets/e0852050640d4474aaf3542d61f2568a/FB.jpg","canonicalUrl":"https://tasty.co/recipe/chicken-tikka-biryani","description":"","votes":11,"games":{"items":[{"id":"d2eb8f13-4f18-490c-830a-6b45a9cae9a2","createdAt":"2020-07-29T23:34:32.088Z","updatedAt":"2020-07-29T23:34:32.088Z"},{"id":"b6a1617b-f3a7-49f5-9c17-1081f043c654","createdAt":"2020-07-29T23:34:31.999Z","updatedAt":"2020-07-29T23:34:31.999Z"},{"id":"3dfbd118-c2f3-4622-9161-26afe31654de","createdAt":"2020-07-29T23:34:31.827Z","updatedAt":"2020-07-29T23:34:31.827Z"},{"id":"d1904084-e7c0-4df7-ad9d-e515ad522fd7","createdAt":"2020-07-29T22:05:07.907Z","updatedAt":"2020-07-29T22:05:07.907Z"},{"id":"19417351-ff76-413e-ad83-1419fa43becc","createdAt":"2020-07-29T23:34:32.695Z","updatedAt":"2020-07-29T23:34:32.695Z"},{"id":"39da8460-82ab-47aa-bb89-69fc56598b98","createdAt":"2020-07-29T22:02:17.163Z","updatedAt":"2020-07-29T22:02:17.163Z"},{"id":"89e19706-384f-4b38-ac18-c286787ab5e9","createdAt":"2020-07-29T23:28:30.229Z","updatedAt":"2020-07-29T23:28:30.229Z"},{"id":"62387132-8db1-44b7-abf9-06f8b11071fd","createdAt":"2020-07-29T21:59:17.510Z","updatedAt":"2020-07-29T21:59:17.510Z"},{"id":"cb9269d9-c9b3-491c-a3a2-2e2ea5934b95","createdAt":"2020-07-29T23:34:32.382Z","updatedAt":"2020-07-29T23:34:32.382Z"},{"id":"cbf0ca0e-ff18-4a3e-830b-8b416251629c","createdAt":"2020-07-29T23:28:29.688Z","updatedAt":"2020-07-29T23:28:29.688Z"},{"id":"61a1cef9-adb3-4cd0-b269-bff52b885d73","createdAt":"2020-07-29T22:32:22.713Z","updatedAt":"2020-07-29T22:32:22.713Z"},{"id":"958ae91a-4f93-45aa-bd47-f41db4cd638c","createdAt":"2020-07-29T22:08:56.762Z","updatedAt":"2020-07-29T22:08:56.762Z"},{"id":"d2ebe843-82bf-4d0d-9971-aafc0d2e0c22","createdAt":"2020-07-29T23:34:32.232Z","updatedAt":"2020-07-29T23:34:32.232Z"},{"id":"8a7dc3aa-b70c-4b62-9506-2ace92c80592","createdAt":"2020-07-29T23:28:29.247Z","updatedAt":"2020-07-29T23:28:29.247Z"},{"id":"20903ff2-80ff-48a0-a6a0-5a40d96b9893","createdAt":"2020-07-29T23:28:30.174Z","updatedAt":"2020-07-29T23:28:30.174Z"},{"id":"f5383ee4-3a25-4456-a871-ec60fec58d4d","createdAt":"2020-07-29T22:09:59.979Z","updatedAt":"2020-07-29T22:09:59.979Z"},{"id":"55fec767-559b-49ec-9bfd-1442a868fd7b","createdAt":"2020-07-29T23:28:29.770Z","updatedAt":"2020-07-29T23:28:29.770Z"},{"id":"fd2d684c-eff9-4f57-af76-13718393ab0c","createdAt":"2020-07-29T22:04:19.519Z","updatedAt":"2020-07-29T22:04:19.519Z"},{"id":"e4ff04c3-834f-447e-988d-abe1ae1717ff","createdAt":"2020-07-29T22:00:59.544Z","updatedAt":"2020-07-29T22:00:59.544Z"}],"nextToken":null},"createdAt":"2020-07-28T09:34:08.859Z","updatedAt":"2020-07-30T08:35:20.318Z"}});

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
    if (!isAdmin) { return }
    const winner = recipes.reduce((acc, next) => next.votes > acc.votes ? next : acc);
    API.graphql(graphqlOperation(mutations.updateGame, { input: { id: game.id, complete: true, gameWinnerId: winner.id }}));
    setGame({ ...game, complete: true, winner: recipes.find(({id}) => id === winner.id)});
    clearRecipeVotes();
  }, [clearRecipeVotes, game, isAdmin, recipes]);

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

  // const state = {
  //   pregame: !game,
  //   intro: game && introTimer > 0,
  //   voting: game && introTimer === 0 && votingTimer > 0,
  //   complete: game && introTimer === 0 && votingTimer === 0
  // };

  const state = {
    pregame: false,
    intro: false,
    voting: true,
    complete: false
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
          const disabled = eliminatedRecipes.some(_id => _id === id);
          const buttonDisabled = disabled || game.complete;
          const positionClassName = styles[`position${index}`];
          let isWinner = false;
          let completeClassName = '';
          if (game && game.complete) {
            isWinner = game && game.winner.id === id;
            completeClassName = isWinner ? styles.winner : styles.loser;
          }
          return (
            <div className={`${styles.recipeContainer} ${completeClassName} ${positionClassName}`}>
              <div className={`${styles.recipe} ${disabled ? styles.disabled : ''}`} key={id}>
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
              { isWinner && (
                <div className={styles.winnerLabel}>Winner!</div>
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
