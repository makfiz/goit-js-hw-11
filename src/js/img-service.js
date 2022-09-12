
export default class ImgApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1
     }
    
    async fetchIMG() {
        const axios = require('axios').default;
        axios.defaults.baseURL = 'https://pixabay.com/api';
        const API_KEY = '29838677-bd4eb1e45df6d4e49f9d08181';
        const option = 'image_type=photo&orientation=horizontal&safesearch=true'
        try {
            const response = await axios.get(`/?key=${API_KEY}&${option}&q=${this.searchQuery}&page=${this.page}&per_page=40`)
            this.page += 1
            
            return response
        } catch(error) {
            console.log(error)
        }
    }

    get query() {
        return this.searchQuery;
    }

    set query(newSearchQuery) {
        this.searchQuery = newSearchQuery.replace(/ /ig, '+');
    }

     get getpage() {
        return this.page;
    }
    set getpage(newPage) {
       this.page = newPage;
    }
}