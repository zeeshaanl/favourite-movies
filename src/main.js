import Vue from 'vue'
import App from './App.vue'
import FavouriteMovieRepoImpl from '../firebase/FavouriteMovieRepoImpl';
import FavouriteMovieRepo from '../repo/FavouriteMovieRepo';

Vue.config.productionTip = false;

const movieRepoImpl = new FavouriteMovieRepoImpl();
const movieRepo = new FavouriteMovieRepo(movieRepoImpl);

window.Vue = new Vue({
  render: createElement => {
    const context = {
      props: {
        movieRepo
      }
    };
    return createElement(App, context)
  }
}).$mount('#app');