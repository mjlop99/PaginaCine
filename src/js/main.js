const API_BASE = "https://api.themoviedb.org/3/";
const IMG_URL_BASE = "https://image.tmdb.org/t/p/w300/";
let lenguagePage=sessionStorage.getItem('Language') || "en";
// data
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
        "language": lenguagePage
    }
})
function likedmovieslist() {
    const item = JSON.parse(localStorage.getItem('likedMovies'));
    let movies;
    if (item) {
        movies = item
    } else {
        movies = {}
    }
    return movies;
}
function likemovie(movie) {
    const likedMovies = likedmovieslist();
    console.log(likedMovies);
    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }
    localStorage.setItem('likedMovies', JSON.stringify(likedMovies))
    homePage();

}
async function getTredingMoviesPreview() {
    try {
        const { data } = await api('trending/movie/day?');
        const movies = data.results;
        trendingMoviesPreviewList //definido en nodes.js

        crearImagenss(movies, trendingMoviesPreviewList);
    } catch (error) {
        console.log(error);
    }

}
async function getTredingMovies() {
    const {
        scrollTop,
        clientHeight,
        scrollHeight } = document.documentElement;
    const Button = (scrollTop + clientHeight + 15 >= scrollHeight) && location.hash.startsWith("#trends")
    const pageisNotMax = page < maxpage;
    if (Button && pageisNotMax) {
        try {
            const { data } = await api('trending/movie/day?');
            maxpage = data.total_pages;
            const movies = data.results;
            crearImagenss(movies, genericSection);
        } catch (error) {
            console.log(error);
        }
    }


}
async function getPaginatedTredingMovies() {
    page++;
    try {
        const { data } = await api('trending/movie/day?', {
            params: {
                page,
            }
        });
        const movies = data.results;
        crearImagenss(movies, genericSection, { lazy: true, clean: false });
    } catch (error) {
        console.log(error);
    }
    page++;
}
async function getCategoriesPreview(categoryId) {

    const { data } = await api('genre/movie/list?');
    const categories = data.genres;

    CreateCategories(categories, categoriesPreviewList);

}
async function getMoviesBycategory(categoryId) {
    const { data } = await api('discover/movie', {
        params: {
            with_genres: categoryId
        }
    });
    const movies = data.results;
    maxpage = data.total_pages
    crearImagenss(movies, genericSection);
}
function getPaginatedMoviesByCategory(categoryId) {
    return async function () {

        const {
            scrollTop,
            clientHeight,
            scrollHeight } = document.documentElement;
        const Button = (scrollTop + clientHeight + 15 >= scrollHeight)
        const pageisNotMax = page < maxpage;
        if (Button && pageisNotMax) {
            page++;
            try {
                const { data } = await api('discover/movie', {
                    params: {
                        with_genres: categoryId,
                        page,
                    }
                });
                const movies = data.results;
                crearImagenss(movies, genericSection, { lazy: true, clean: false });
            } catch (error) {
                console.log(error);
            }
            page++;
        }

    }
}
async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params: {
            query,
        }
    });
    const movies = data.results;
    maxpage = data.total_pages;
    crearImagenss(movies, genericSection);
}
function getPaginatedMoviesBySearch(query) {
    return async function () {

        const {
            scrollTop,
            clientHeight,
            scrollHeight } = document.documentElement;
        const Button = (scrollTop + clientHeight + 15 >= scrollHeight)
        const pageisNotMax = page < maxpage;
        if (Button && pageisNotMax) {
            page++;
            try {
                const { data } = await api('search/movie', {
                    params: {
                        query,
                        page,
                    }
                });
                const movies = data.results;
                crearImagenss(movies, genericSection, { lazy: true, clean: false });
            } catch (error) {
                console.log(error);
            }
            page++;
        }

    }
}


const lazyloader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const urlImg = entry.target.getAttribute("data-img")
            entry.target.setAttribute("src", urlImg)

        }
    })
});


async function crearImagenss(
    movies,
    mainContainer, options = {
        lazy: false,
        clean: true,
    }) {

    try {
        if (options.clean) {
            mainContainer.innerHTML = "";
        }
        movies.forEach(movie => {
            if (movie.poster_path != null) {
                const movieContainer = document.createElement("div");
                movieContainer.classList.add("movie-container");

                const imgConatiner = document.createElement("img");
                imgConatiner.classList.add("movie-img");
                imgConatiner.setAttribute("alt", movie.tittle);
                imgConatiner.setAttribute(options.lazy ? "data-img" : "src", `${IMG_URL_BASE}${movie.poster_path
                    }`);
                imgConatiner.addEventListener("click", () => {
                    location.hash = `#movie=${movie.id}`
                })

                
                
                const moviebtn = document.createElement('button');

                    moviebtn.classList.add('movie-btn')
                    moviebtn.addEventListener("click", () => {
                        moviebtn.classList.toggle('movie-btn--liked');
                        likemovie(movie);
                    })

                    if (likedmovieslist()[movie.id]) {
                        moviebtn.classList.toggle('movie-btn--liked');
                    }
                

                if (options.lazy) {
                    lazyloader.observe(imgConatiner)
                }
                movieContainer.append(imgConatiner);
                movieContainer.append(moviebtn)
                mainContainer.append(movieContainer);
            }


        });
    } catch (error) {
        console.log(error);
    }


}
async function CreateCategories(categories, mainContainer) {
    mainContainer.innerHTML = "";

    categories.forEach(categorie => {

        const categorieContainer = document.createElement("div");
        categorieContainer.classList.add("category-container");

        const categorieTittle = document.createElement("h3");
        categorieTittle.classList.add("category-title");
        categorieTittle.setAttribute("id", `id${categorie.id}`);
        const categorieTittleText = document.createTextNode(categorie.name);

        categorieTittle.addEventListener("click", () => {
            location.hash = `#category=${categorie.id}-${categorie.name}`;
        });

        categorieTittle.append(categorieTittleText);
        categorieContainer.append(categorieTittle);
        mainContainer.append(categorieContainer);
    });
}
async function getMovieById(id) {
    try {
        const { data: movie } = await api(`movie/${id}`); //axios necesita recibir un objeto data y los renombbramos con ":" a movie

        movieDetailTitle.textContent = movie.title;
        movieDetailDescription.textContent = movie.overview;
        movieDetailScore.textContent = movie.vote_average;

        movieImgUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
        //headerSection.style.background ="linear-gradient(180deg,rgba(0,0,0,0.35) 19.27%,rgba(0,0,0,0) 29.17%)";
        headerSection.style.background = `linear-gradient(180deg,rgba(0,0,0,0.35) 19.27%,rgba(0,0,0,0) 29.17%),url(${movieImgUrl})`;
        CreateCategories(movie.genres, movieDetailCategoriesList);
        getReleatedMoviesById(id)

        // crearImagenss(movies, genericSection);
    } catch (error) {
        console.log(error);
    }
}
async function getReleatedMoviesById(id) {
    const { data } = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;
    crearImagenss(relatedMovies, relatedMoviesContainer);
}
function getLikedMovies() {
    const likedMovies = likedmovieslist();
    const moviesArray = Object.values(likedMovies);
  
    crearImagenss(moviesArray, likedMoviesListArticle, { lazyLoad: true, clean: true });
    
    console.log(likedMovies)
  }
function changeBtnLenguage() {
if (sessionStorage.getItem("Language")=="es-ES") {
        btnLangueje.innerHTML="English"
} else {
    btnLangueje.innerHTML="Español"
}
}
