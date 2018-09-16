import * as firebase from "firebase";
import config from './config';

export default class FavouriteMovieRepoImpl {
  constructor() {
    firebase.initializeApp(config);

  }

  async saveMovie(movie) {
    console.log('in saveMovie in firebaseimple');

    const updates = {};
    updates[`/favouriteMovies/${movie.id}`] = movie;
    try {
      return await firebase.database().ref().update(updates);
    } catch (error) {
      throw error;
    }
  }

  async subscribeToSavedMovies(callback) {
    try {
      await firebase.database().ref(`/`).on('value', (snapshot) => {
        if (snapshot.hasChild('favouriteMovies')) {
          const movies = snapshot.child('favouriteMovies').val();
          callback(movies);
        }
      })
    } catch (error) {
      throw error;
    }
  }
}