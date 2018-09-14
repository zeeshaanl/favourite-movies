export default class MovieService {
    constructor(api) {
        this.api = api;
    }

    /**
     *
     * @param {string} title
     */
    getMovieDetails = async (title) => {
        try {
            const movieResponse = await this.api.getMovie(title);
            return movieResponse.data && movieResponse.data.results ? movieResponse.data.results : new Error('No results');
        } catch (error) {
            throw error;
        }
    }
}