(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const FilledStarIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAxCAYAAACcXioiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKXSURBVHgB7ZhBbtQwFIZ/zyAxu8IN0hNANqh0Q+YG9ASlJyhzgpmeADgBvQG9QbOCJXMDwgnIqoyEqPnjcWmVxElsPU9bKZ/kZuQ4rp/f+/OeA4yMjDxqFCKhvyHh7B+gUWKGhUp5jcATxGPJxb81v67wk39XiMAE8cj+/5riVH/HM0QgigEMn3e8JLcdXPzvOwYJEssDx40ehVNEQFzERrzAj9abU6TqFdYQJIYHls47f6yoBYlhQOa8E0HMogY0xNsYIC9maQ8c944QFrOYiDvFW2eG51KZWdIDy8Ejr/AeQnh7wIhwwzZl+8s2YbvGC/iXCmd8ds1nS85Vcq6qZip9PdNqAMOh2s3ENMUFattUnHKguQAaoYwhBbarLNm3Vq9pdI2GAfZN8hkPEc2q9hAf73ZNWgbtZpdDUM3wahhgLTzDQ0PjE0PovN7tFDFDaQWfN0tMWkLnhs63EI3IsNVDgvtgK+Yj7nzuGtL7GrUJ6hK7N6Jgm3PxRdeg3kRmJ5iz5dgdOXNC2rf4Cq9EthNdVGI9HJ6p/TNxTCM6xOoiqJjTX3kwUfgCWeZdYnURXI3SE1XlmUCGgovfRwBhHrhktp7hFyQJLLHDyukZXkKaTdicYQZo+cN56JyhB5o3kCdoTv/XaIz4vyFAB/4eeBrnE6Eh4ItFSAhlA8cVbCe2FQOfyeBJiAH9scpywNYy56aG3yA1fRJz1/CrhfriX/GQXpUDjow6qLL11IGfB1zxr82he6EOzK7nrser6tJmXPeJz1MHfgao1mSTsz/1KcJoxIqXfT530XI7gwd+BlzzH2rr3u31hIuZD6nb6xhvHOAIdZFPsAcPQsrpBNUuzXAh9XnQzrnipuxxRYuQDRkZGRm5H/4BIkyx5W7xkPAAAAAASUVORK5CYII=";
const apiUrl = "https://api.themoviedb.org/3";
const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYjQ2MjRmMjdjMWVmZTQ4NzE3MTI1OTdkNmFiNjg0ZiIsIm5iZiI6MTc3NDg3MDEzOC4zMzQsInN1YiI6IjY5Y2E1ZTdhOWI4YjFiZDdmMDI2Mzg0ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._9ls2F5VNo4k4c3UBqmC7_IooCgk1ITzrN3_x3LauTc";
const fetchPopularMovies = async (page) => {
  const response = await fetch(
    `${apiUrl}/movie/popular?language=ko-KR&page=${page}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  if (!response.ok) {
    throw new Error("영화를 불러오는 데 실패했습니다.");
  }
  const data = await response.json();
  return {
    movies: data.results,
    nowPage: data.page,
    totalPages: data.total_pages
  };
};
const fetchSearchedMovies = async (page, searchTitle) => {
  const response = await fetch(
    `${apiUrl}/search/movie?query=${encodeURIComponent(searchTitle)}&include_adult=false&language=ko-KR&page=${page}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  if (!response.ok) {
    throw new Error("영화 검색 중 에러가 발생했습니다.");
  }
  const data = await response.json();
  return {
    movies: data.results,
    nowPage: data.page,
    totalPages: data.total_pages
  };
};
const ERROR_MESSAGE = {
  MOVIE: {
    FAILED_SEARCH: "영화 검색에 실패하였습니다.",
    FAIELD_GET_POPULAR: "인기 영화 목록을 가져오는 데 실패했습니다.",
    FAILED_GET_MORE: "추가 영화 목록을 가져오는 데 실패했습니다."
  }
};
const EmptyStarIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAxCAYAAACcXioiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQ4SURBVHgB7VlNctMwFP7UwrRl0/YGzgloNwyURd0TQE5AeoK2J2hyAuAEaU9QOEHMgvCzSW9QcwLChqbDNOI9RVEk106sWGZY5JvR+FlRJD29fxlYYYX/F/I79uQXxKgRAjWANh3Ro0ct0l0ptSPxQj2DYg31oIvZ5qHpLmpAcAno07+ZdWBIq+zoN5ZCgoCoQwLnhhK4oBUS8y7xGoFRhwT49CP9eqSfPb3aEBtoiH16BkJQCdDmW7AMl9VFq0w6GUCqdKvGBENoFXpj0R2LvjSUwCsERDAGtPHGVldiqBHeWf0xxwcEQkgJOMZr+3xxpHQ+Mb//CWfMIRmIDSUtlZlhplLrOJED41orIQgDecabHaP6pPY+E2OOEQChJFBkvC4E3lv0CQIgNw4o8Y6UiCNicQdjanxqQrVtQ0s9xk0bGkU5j+zR+E38tFa/1pF6aD1/GXrqfteJfkySzYkfImfjV8CS4mXjfY7jeUNkn+YXSxvxBR3Amc3II+fnEd4CS+tmQlH2bOGoO2JwC8umFS3aI8MckiuBPol3lnilqs3EyfjxQORjak/yxTsPStq/tYraKikMvY2pak769/SOhyTl3ek8j+aswb68g5qgGb4uM1Z+oxgzzg9+rheyvQTQll9xFcpfLwNeW9nMGG2r+4M9xmWAQ760BrCejjDQacI/hVqT1nYMXtDeMnYmCv7chp0asC2soymelRN5VcjPpC5ryhtGpnOMjnjpSEIhN5CR7reJNZvTCPckiT5OUTNIbU9oVwPYm5fkOnM2z5hb0OSeBNlGXcatjbVtdaX03qTNF0p+YUWWc8Mw1cXjUJWVchS3VPS7+s5RurnoJqNUSalSgI3MAnw6m9ivyoSO/lmVuaRgd1pm7lLJHOfz4gBNuIlaFKQ8HKlDicw7G+sBWmUPxisbVcYtrVixhqeojtiiO0XGWgT/dFqoED+BpNSiOlJrPu+g6c+AdEJ6gupIDLVEwe91L5S9dSOVqnyvpB3EjUkiN7Hr4xj8JBD+9CcFv7D8/MgvzfZjwBXxp0XDPa7XZ3NJvysXXxuILTopGsSbppRgwOkHvfb4unFBQpgYytMOSuuwo/+ZosKM4aB0R+mALMiZJGW7lLLnRddMMdUo+y3BRwKxtZEHuYlSFY6o9ualrtymEOq3nr6GcSGcOWOUhA8Dh5ht7KMhSTLUOFdy8yVWC4F91eBcdPGYLv2n66iVNSf95xAlsZwE9Gmp1FcqPY+tjQxpVk7C1Ccl3VqYFOKpNR/39UyKbktAlpeAjw1I65Xv/c+RFTWnGVuUbhf4cX3ibbgXYYxUzSlVBeZlBz4M9FCsmym147Kfj9Tt9P2DOiOLUgz4qFCnsJ/Tao9vX1ya0vjGnDnTsl7IL5XoU5Sc3GlGyhNR2Vn106lSK6lu66YBLEVNn2RrBZevqoRdYYUVvPAXJrOCc9SFL6sAAAAASUVORK5CYII=";
const NotFoundPoster = "/javascript-movie-review/assets/notFoundImage-CsSMeXzn.png";
const extractThumbnailInfo = (movies) => {
  return movies.map((movie) => {
    const thumbnailInfo = {
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average
    };
    return thumbnailInfo;
  });
};
const makeMovieThumbnail = (movie) => {
  const fragment = document.createDocumentFragment();
  const list = document.createElement("li");
  const item = document.createElement("div");
  item.className = "item";
  const thumbnail = document.createElement("img");
  thumbnail.className = "thumbnail";
  thumbnail.src = `${"https://image.tmdb.org/t/p/w500"}${movie.poster_path}`;
  thumbnail.onerror = () => {
    thumbnail.src = NotFoundPoster;
  };
  thumbnail.alt = movie.title;
  const itemDesc = document.createElement("div");
  itemDesc.className = "item-desc";
  const rate = document.createElement("p");
  rate.className = "rate";
  const starImg = document.createElement("img");
  starImg.className = "star";
  starImg.src = EmptyStarIcon;
  const voteAverage = document.createElement("span");
  voteAverage.textContent = movie.vote_average.toString();
  const title = document.createElement("strong");
  title.textContent = movie.title;
  rate.appendChild(starImg);
  rate.appendChild(voteAverage);
  itemDesc.appendChild(rate);
  itemDesc.appendChild(title);
  item.appendChild(thumbnail);
  item.appendChild(itemDesc);
  list.appendChild(item);
  fragment.appendChild(list);
  return fragment;
};
const getElementOrThrow = (selector) => {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`${selector} 요소를 찾을 수 없습니다.`);
  }
  return element;
};
class LogoView {
  #dom;
  constructor() {
    this.#dom = {
      logo: getElementOrThrow(".logo")
    };
  }
  bindEvent(handler) {
    this.#dom.logo.addEventListener("click", handler);
  }
}
class MoreMovieView {
  #dom;
  constructor() {
    this.#dom = {
      button: getElementOrThrow(".more-button")
    };
  }
  hide() {
    this.#dom.button.style.display = "none";
  }
  show() {
    this.#dom.button.style.display = "";
  }
  disable() {
    this.#dom.button.disabled = true;
    this.#dom.button.style.cursor = "not-allowed";
  }
  able() {
    this.#dom.button.disabled = false;
    this.#dom.button.style.cursor = "pointer";
  }
  bindEvent(handler) {
    this.#dom.button.addEventListener("click", handler);
  }
}
class MovieListView {
  #dom;
  constructor() {
    this.#dom = {
      title: getElementOrThrow(".section-title"),
      container: getElementOrThrow(".section-container"),
      list: getElementOrThrow(".thumbnail-list"),
      notFound: getElementOrThrow(
        ".not-search-found-container"
      )
    };
  }
  addMovies(movieList) {
    const fragment = new DocumentFragment();
    movieList.forEach((movie) => {
      const thumbnail = makeMovieThumbnail(movie);
      fragment.appendChild(thumbnail);
    });
    this.#dom.list.appendChild(fragment);
  }
  remove() {
    this.#dom.list.replaceChildren();
  }
  addSkeletons() {
    const fragment = new DocumentFragment();
    const skeleton = document.createElement("div");
    skeleton.className = "movie-skeleton";
    for (let i = 0; i < 20; i++) {
      const newNode = skeleton.cloneNode(true);
      fragment.appendChild(newNode);
    }
    this.#dom.list.appendChild(fragment);
  }
  removeAllSkeletons() {
    const skeletonNodes = document.querySelectorAll(".movie-skeleton");
    skeletonNodes.forEach((node) => node.remove());
  }
  renderTitle(title) {
    this.#dom.title.textContent = title;
  }
  showNotFound() {
    this.#dom.notFound.style.display = "flex";
  }
  hideNotFound() {
    this.#dom.notFound.style.display = "none";
  }
}
class SearchView {
  #dom;
  constructor() {
    this.#dom = {
      form: getElementOrThrow(".search"),
      input: getElementOrThrow(".search-input")
    };
  }
  bindEvent(handler) {
    this.#dom.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await handler();
    });
  }
  getInputValue() {
    return this.#dom.input.value;
  }
}
class TopRatedView {
  #dom;
  constructor() {
    this.#dom = {
      container: getElementOrThrow(".background-container"),
      backgroundImg: getElementOrThrow(".background-img"),
      title: getElementOrThrow(".title"),
      rate: getElementOrThrow(".rate-value")
    };
  }
  render({ title, poster_path, vote_average }) {
    this.#dom.title.textContent = title;
    this.#dom.rate.textContent = vote_average.toString();
    this.#dom.backgroundImg.src = `${"https://image.tmdb.org/t/p/w500"}${poster_path}`;
  }
  hide() {
    this.#dom.container.style.display = "none";
  }
}
class App {
  #views;
  #state;
  constructor() {
    this.#views = {
      logo: new LogoView(),
      topRated: new TopRatedView(),
      search: new SearchView(),
      movieList: new MovieListView(),
      moreMovie: new MoreMovieView()
    };
    this.#state = {
      popularMoviePage: 1,
      searchMoviePage: 1,
      searchString: ""
    };
  }
  async init() {
    this.#bindAllEvents();
    addEventListener("load", () => {
      const buttonImage = document.createElement("img");
      buttonImage.src = FilledStarIcon;
    });
    await this.#renderPopularMovieAtFirst();
  }
  #bindAllEvents() {
    this.#views.moreMovie.bindEvent(this.#moreMovieEventHandler);
    this.#views.search.bindEvent(this.#searchEventHandler);
    this.#views.logo.bindEvent(this.#logoEventHandler);
  }
  async #renderPopularMovieAtFirst() {
    try {
      this.#views.movieList.addSkeletons();
      const { movies: popularMovies, totalPages: popularTotalPages } = await fetchPopularMovies(this.#state.popularMoviePage);
      this.#views.movieList.addMovies(extractThumbnailInfo(popularMovies));
      if (this.#state.popularMoviePage === popularTotalPages) {
        this.#views.moreMovie.hide();
      }
      this.#views.topRated.render(extractThumbnailInfo(popularMovies)[0]);
    } catch (error) {
      alert(ERROR_MESSAGE.MOVIE.FAIELD_GET_POPULAR);
    } finally {
      this.#views.movieList.removeAllSkeletons();
    }
  }
  #logoEventHandler = () => {
    location.reload();
  };
  #moreMovieEventHandler = async () => {
    this.#views.moreMovie.disable();
    const searchValue = this.#views.search.getInputValue();
    const requestMovies = searchValue.trim().length === 0 ? () => fetchPopularMovies(++this.#state.popularMoviePage) : () => fetchSearchedMovies(++this.#state.searchMoviePage, searchValue);
    try {
      this.#views.movieList.addSkeletons();
      const { movies, nowPage, totalPages } = await requestMovies();
      if (nowPage === totalPages) {
        this.#views.moreMovie.hide();
      }
      this.#views.movieList.addMovies(extractThumbnailInfo(movies));
    } catch (error) {
      alert(ERROR_MESSAGE.MOVIE.FAILED_GET_MORE);
    } finally {
      this.#views.movieList.removeAllSkeletons();
      this.#views.moreMovie.able();
    }
  };
  #searchEventHandler = async () => {
    const searchValue = this.#views.search.getInputValue();
    if (searchValue === this.#state.searchString) {
      return;
    }
    this.#views.topRated.hide();
    this.#views.movieList.hideNotFound();
    this.#state.searchMoviePage = 1;
    this.#views.movieList.renderTitle(`"${searchValue}"검색 결과`);
    try {
      this.#views.movieList.remove();
      this.#views.movieList.addSkeletons();
      const { movies, nowPage, totalPages } = await fetchSearchedMovies(
        this.#state.searchMoviePage,
        searchValue
      );
      this.#views.moreMovie.show();
      this.#views.movieList.addMovies(extractThumbnailInfo(movies));
      if (nowPage === totalPages) {
        this.#views.moreMovie.hide();
      }
      if (movies.length === 0) {
        this.#views.movieList.showNotFound();
        this.#views.moreMovie.hide();
      }
      this.#state.searchString = searchValue;
    } catch (error) {
      alert(ERROR_MESSAGE.MOVIE.FAILED_SEARCH);
    } finally {
      this.#views.movieList.removeAllSkeletons();
    }
  };
}
const app = new App();
await app.init();
