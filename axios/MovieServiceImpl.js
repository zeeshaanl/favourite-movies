import axios from 'axios';

export default class MovieServiceImpl {
    constructor() {
        axios.defaults.baseURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}`
    }

    getMovie = async (title) => {
        try {
            return await axios.get('', {
                params: {
                    query: title
                }
            });
        } catch (error) {
            throw error;
        }
    }
}