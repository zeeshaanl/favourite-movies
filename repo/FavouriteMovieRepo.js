export default class FavouriteMovieRepo {
  constructor(databaseImplementation) {
      this.databaseImplementation = databaseImplementation;
  }

  saveMovie(movie) {
    this.databaseImplementation.saveMovie(movie);
  }

  subscribeToSavedMovies(callback) {
    this.databaseImplementation.subscribeToSavedMovies(callback);
  }
}