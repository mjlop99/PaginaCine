searchFormBtn.addEventListener("click",()=>{
    location.hash=`#search=${searchFormInput.value}`
})
trendingBtn.addEventListener("click",()=>{
    location.hash="#trends="
})
arrowBtn.addEventListener("click",()=>{
    location.hash=window.history.back();
})

btnLangueje.addEventListener("click",()=>{
    if (btnLangueje.innerHTML=="Español") {
        lenguagePage="es-ES";
    }else{
        lenguagePage="en";
    }

    sessionStorage.setItem("Language",lenguagePage)
    this.location.reload()

})
let infinitScroll;
let maxpage;
let page = 1;

window.addEventListener("DOMContentLoaded", () => navigation(), false)
window.addEventListener("hashchange", () => navigation(), false)
window.addEventListener("scroll",infinitScroll,{pasive:false})

function navigation() {
    if (infinitScroll) {
    window.removeEventListener("scroll",infinitScroll,{pasive:false})
    infinitScroll=undefined
    }
    if (location.hash.startsWith("#trends")) {
        trendsPage()
    } else if (location.hash.startsWith("#search=")) {
        searchPage()
    } else if (location.hash.startsWith("#movie=")) {
        movieDetailPage()
    } else if (location.hash.startsWith("#category=")) {
        categoriesPage()
    } else {
        homePage()
    }
    if (infinitScroll) {
        window.addEventListener("scroll",infinitScroll,{pasive:false})
    }
    window.scrollTo(0,0);
}
function homePage() {
    
    headerSection.classList.remove("header-container--long");
    headerSection.style.background="";
    trendingPreviewSection.classList.remove("inactive")
    likedMoviesSection.classList.remove("inactive")
    arrowBtn.classList.add("inactive")
    headerTitle.classList.remove("inactive")
    headerCategoryTitle.classList.add("inactive")
    searchForm.classList.remove("inactive")
    
    trendingMoviesPreviewList.classList.remove("inactive")
    categoriesPreviewSection.classList.remove("inactive")
    genericSection.classList.add("inactive")
    movieDetailSection.classList.add("inactive")
    getTredingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
    changeBtnLenguage()
}
    function categoriesPage() {
    console.log("CATEGORIES!!!");

    headerSection.classList.remove("header-container--long");
    headerSection.style.background="";

    arrowBtn.classList.remove("inactive")
    arrowBtn.classList.remove("header-arrow--white")
    headerTitle.classList.add("inactive")
    searchForm.classList.add("inactive")
    
    trendingPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add("inactive")
    trendingMoviesPreviewList.classList.add("inactive")
    categoriesPreviewSection.classList.add("inactive")
    genericSection.classList.remove("inactive")
    movieDetailSection.classList.add("inactive")

    const [url,info]=location.hash.split("=");
    const [categoriId,categoriName]=info.split("-");

    headerCategoryTitle.classList.remove("inactive")
    headerCategoryTitle.innerHTML=categoriName;

    getMoviesBycategory(categoriId);
    infinitScroll=getPaginatedMoviesByCategory(categoriId)
}
function movieDetailPage() {
    headerSection.classList.add("header-container--long");
    headerSection.style.background="";

    arrowBtn.classList.remove("inactive")
    arrowBtn.classList.add("header-arrow--white")
    headerTitle.classList.add("inactive")
    headerCategoryTitle.classList.add("inactive")
    searchForm.classList.add("inactive")
    
    trendingMoviesPreviewList.classList.add("inactive")
    likedMoviesSection.classList.add("inactive")
    categoriesPreviewSection.classList.add("inactive")
    genericSection.classList.add("inactive")
    movieDetailSection.classList.remove("inactive")


    // const [#search,buscado]
    const [_,movieId]=location.hash.split("=");
    getMovieById(movieId);


}
function searchPage() {
    headerSection.classList.remove("header-container--long");
    headerSection.style.background="";
    trendingPreviewSection.classList.add("inactive")

    arrowBtn.classList.remove("inactive")
    arrowBtn.classList.remove("header-arrow--white")
    headerTitle.classList.add("inactive")
    headerCategoryTitle.classList.add("inactive")
    searchForm.classList.remove("inactive")
    
    trendingMoviesPreviewList.classList.add("inactive")
    likedMoviesSection.classList.add("inactive")
    categoriesPreviewSection.classList.add("inactive")
    genericSection.classList.remove("inactive")
    movieDetailSection.classList.add("inactive")

    // const [#search,buscado]
    const [categoriId,query]=location.hash.split("=");
    getMoviesBySearch(query);
    infinitScroll=getPaginatedMoviesBySearch(query)
}
function trendsPage() {
    headerSection.classList.remove("header-container--long");
    headerSection.style.background="";
    trendingPreviewSection.classList.add("inactive")

    arrowBtn.classList.remove("inactive")
    arrowBtn.classList.remove("header-arrow--white")
    headerTitle.classList.add("inactive")
    headerCategoryTitle.classList.remove("inactive")
    searchForm.classList.add("inactive")
    
    trendingMoviesPreviewList.classList.add("inactive")
    likedMoviesSection.classList.add("inactive")
    categoriesPreviewSection.classList.add("inactive")
    genericSection.classList.remove("inactive")
    movieDetailSection.classList.add("inactive")

    headerCategoryTitle.innerHTML="Tendencias"
    getTredingMovies();
    infinitScroll=getPaginatedTredingMovies;
}