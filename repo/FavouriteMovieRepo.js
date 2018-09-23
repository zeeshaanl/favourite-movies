export default class FavouriteMovieRepo {
  constructor(databaseImplementation) {
      this.databaseImplementation = databaseImplementation;
  }

  saveMovie(movie) {
    this.databaseImplementation.saveMovie(movie);
  }

  removeMovie(movieId) {
    this.databaseImplementation.removeMovie(movieId);
  }

  subscribeToSavedMovies(callback) {
    this.databaseImplementation.subscribeToSavedMovies(callback);
  }
}