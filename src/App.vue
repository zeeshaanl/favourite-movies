<template>
  <div id="app">
    <header>
      <h1>Movies To Watch</h1>
    </header>
    <main>
      <section>
        <input v-model='currentMovieTitle' v-on:input='searchMoviesHandler' type='text' />
      </section>
      <div class='c-results'>
        <!--<h4 v-if='loading'>-->
        <!--Loading...-->
        <!--</h4>-->
        <div class='c-movie-tile' v-if='moviesToAdd && moviesToAdd.length > 0' v-for="movie in moviesToAdd" v-bind:key='movie.id'>
          <MovieBlock v-bind='{movie, saveMovie, isCurrentMovieSelected}' />
        </div>
      </div>

      <section>
        <h3>Saved Movies</h3>
        <div v-for='movie in savedMovies' v-bind:key='movie.id'>
          <div>
            {{movie.title}}
          </div>
        </div>
      </section>
      <h4 v-if='currentMovieTitle && errored'>
        Error loading movies
      </h4>
    </main>
  </div>
</template>

<script>
import MovieService from "../services/MovieService";
import MovieServiceImpl from "../axios/MovieServiceImpl";
import debounce from "lodash/debounce";
import MovieBlock from "./components/MovieBlock.vue";
import FavouriteMovieRepo from "../repo/FavouriteMovieRepo.js";
import FavouriteMovieRepoImpl from "../firebase/FavouriteMovieRepoImpl.js";

const movieApi = new MovieServiceImpl();
const movieService = new MovieService(movieApi);

export default {
  name: "app",
  components: { MovieBlock },
  props: {
    movieRepo: Object
  },
  created() {
    this.movieRepo.subscribeToSavedMovies(movies => {
      this.savedMovies = movies;
    })
  },
  data() {
    return {
      baseImageUrl: "https://image.tmdb.org/t/p/w200/",
      currentMovieTitle: "",
      loading: false,
      errored: false,
      savedMovies: {},
      moviesToAdd: null
    };
  },
  methods: {
    searchMoviesHandler() {
      if (!this.currentMovieTitle) {
        this.loading = false;
        this.moviesToAdd = [];
      } else {
        this.getMovieDetails();
      }
    },
    getMovieDetails: debounce(async function getMovieDetails() {
      try {
        this.loading = true;
        this.errored = false;
        const movieList = await movieService.getMovieDetails(
          this.currentMovieTitle
        );
        this.moviesToAdd = movieList;
        this.loading = false;
      } catch (error) {
        this.errored = true;
      }
    }, 300),
    async saveMovie(movie) {
      const dateOfSaving = new Date().valueOf();
      const newMovieEntry = { ...movie, timestamp: dateOfSaving };
      try {
        await this.movieRepo.saveMovie(newMovieEntry);
      } catch (error) {
        console.log(error, "error saving movie");
        this.errored = true;
      }
    },
    isCurrentMovieSelected(movieId) {
      return !!this.savedMovies[movieId];
    }
  }
};
</script>

<style lang='scss'>
.c-results {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 100%;
}

.c-movie-tile {
  display: inline-block;
  margin-right: 1%;
  width: 15%;
  @media (max-width: 767px) {
    width: 45%;
  }
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
