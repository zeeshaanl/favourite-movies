<template>
    <div v-bind:class="['c-movie', { 'c-movie--selected' : isCurrentMovieSelected(movie.id) }]" v-on:click='saveMovie(movie)'>
        <header class='c-movie__header'>{{movie.title}}</header>
        <main>
            <section class='c-movie__poster'>
                <img v-bind:src='baseImageUrl+movie.poster_path' />
            </section>
            <section class='c-movie__overview'>
                {{movie.overview}}
            </section>
        </main>
    </div>
</template>

<script>
    export default {
        props: {
            movie: Object,
            items: Array,
            saveMovie: Function,
            isCurrentMovieSelected: Function
        },
        data() {
            return {
                baseImageUrl: 'https://image.tmdb.org/t/p/w200/'
            }
        },
        name: "movie-block"
    }
</script>

<style lang='scss'>
    .c-movie {
        border: 1px solid lightgray;
        border-radius: 6px;
        position: relative;
        /*padding: 1rem;*/
        margin: 1rem 0;
        height: 500px;
    }

    .c-movie:hover, .c-movie--selected {
        cursor: pointer;
        background-color: lightpink;
        border-color: darkgrey;
    }

    .c-movie__header {
        font-weight: 600;
        font-size: 18px;
        padding: 0.5em;
    }

    .c-movie__overview {
        /*text-overflow: ellipsis;*/
        /*white-space: nowrap;*/
        overflow: hidden;
        width: 80%;
        height: 120px;
        text-align: left;
        margin: 0 auto;
    }

    .c-movie__poster img {
        max-width: 100%;
        height: auto;
    }
</style>