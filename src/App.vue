<template>
  <div id="app">
    <header>
      <h1>Movies To Watch</h1>
    </header>
    <main>
      <section>
        <input v-model="currentMovieTitle" type="text" @input="searchMoviesHandler">
      </section>
      <div v-if="moviesToAdd && moviesToAdd.length > 0" class="c-results">
        <div v-for="movie in moviesToAdd" :key="movie.id" class="c-movie-tile">
          <MovieBlock v-bind="{movie, saveMovie, isCurrentMovieSelected}" />
        </div>
      </div>

      <section>
        <h3>Saved Movies</h3>
        <div v-for="movie in orderedSavedMovies" :key="movie.id">
          <div>
            {{ movie.title }}
            <span class="remove-movie" @click="removeMovie(movie.id)"> x</span>
          </div>
        </div>
      </section>
      <h4 v-if="currentMovieTitle && errored">
        Error loading movies
      </h4>
    </main>
  </div>
</template>

<script>
import MovieService from "../services/MovieService";
import MovieServiceImpl from "../axios/MovieServiceImpl";
import debounce from "lodash/debounce";
import orderBy from "lodash/orderBy";

import MovieBlock from "./components/MovieBlock.vue";
import FavouriteMovieRepo from "../repo/FavouriteMovieRepo.js";
import FavouriteMovieRepoImpl from "../firebase/FavouriteMovieRepoImpl.js";

const movieApi = new MovieServiceImpl();
const movieService = new MovieService(movieApi);

export default {
  name: "App",
  components: { MovieBlock },
  props: {
    movieRepo: Object
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
  computed: {
    orderedSavedMovies: function () {
      return orderBy(this.savedMovies, 'timestamp');
    }
  },
  created() {
    this.movieRepo.subscribeToSavedMovies(movies => {
      this.savedMovies = movies;
    })
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
        console.log(movieList);

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
    async removeMovie(movieId) {
      try {
        await this.movieRepo.removeMovie(movieId);
      } catch (error) {
        console.log(error, "error removing movie");
        this.errored = true;
      }
    },
    isCurrentMovieSelected(movieId) {
      return !!this.savedMovies[movieId];
    }
  },
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

.remove-movie {
  font-weight: 500;
  cursor: pointer;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
