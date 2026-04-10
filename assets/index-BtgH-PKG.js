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
const apiUrl$1 = "https://api.themoviedb.org/3";
const accessToken$1 = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWJkNzQ4MWJiMzE0Mjg0OWMzYjY3MjYxYzU4NzIzOCIsIm5iZiI6MTc0NzcxOTQ0OS41MDEsInN1YiI6IjY4MmMxNTE5ZjZjZjIwNzZmM2UyNTExYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6oFSMOPSVI3bY8aHLin9MmLuM4wNHFPREt_eB5mwAy8";
const fetchPopularMovies = async (page) => {
  const response = await fetch(
    `${apiUrl$1}/movie/popular?language=ko-KR&page=${page}&region=ko-KR`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${accessToken$1}`
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
    `${apiUrl$1}/search/movie?query=${encodeURIComponent(searchTitle)}&include_adult=false&language=ko-KR&page=${page}&region=KR`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${accessToken$1}`
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
      id: movie.id,
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
  list.className = "thumbnail-container";
  list.dataset.movieId = movie.id.toString();
  const item = document.createElement("button");
  item.className = "item";
  const thumbnail = document.createElement("img");
  thumbnail.className = "thumbnail";
  thumbnail.src = `${"https://image.tmdb.org/t/p/original"}${movie.poster_path}`;
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
  voteAverage.textContent = movie.vote_average.toFixed(1).toString();
  const title = document.createElement("strong");
  title.className = "thumbnail-title";
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
const getYearFromDate = (dateString) => {
  const date = new Date(dateString);
  return date.getFullYear();
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
  bindEvent(handler) {
    this.#dom.list.addEventListener("click", (e) => {
      let item = e.target.closest(".thumbnail-container");
      if (!item) return;
      const movieId = item.getAttribute("data-movie-id");
      if (!movieId) {
        throw new Error("영화 id를 찾을 수 없습니다.");
      }
      handler(Number(movieId));
    });
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
  addTopMargin() {
    this.#dom.container.classList.add("search-mode");
  }
  removeTopMargin() {
    this.#dom.container.classList.remove("search-mode");
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
      rate: getElementOrThrow(".rate-value"),
      button: getElementOrThrow(".detail")
    };
  }
  bindEvent(handler) {
    this.#dom.button.addEventListener("click", async () => {
      const movieId = this.#dom.title.getAttribute("data-movie-id");
      if (!movieId) {
        throw new Error("영화 id를 찾을 수 없습니다.");
      }
      await handler(Number(movieId));
    });
  }
  render({ id, title, poster_path, vote_average }) {
    this.#dom.title.dataset.movieId = id.toString();
    this.#dom.title.textContent = title;
    this.#dom.rate.textContent = vote_average.toFixed(1).toString();
    this.#dom.backgroundImg.src = `${"https://image.tmdb.org/t/p/original"}${poster_path}`;
  }
  hide() {
    this.#dom.container.style.display = "none";
  }
}
class MovieDetailView {
  #dom;
  constructor() {
    this.#dom = {
      modal: getElementOrThrow(".modal"),
      closeButton: getElementOrThrow(".close-modal"),
      posterImage: getElementOrThrow(".modal-poster-image"),
      title: getElementOrThrow(".modal-movie-title"),
      category: getElementOrThrow(".category"),
      rateValue: getElementOrThrow(".detail-rate-value"),
      overview: getElementOrThrow(".overview")
    };
  }
  bindCloseEvent() {
    this.#dom.closeButton.addEventListener("click", () => {
      this.#dom.modal.close();
    });
    this.#dom.modal.addEventListener("close", () => {
      document.body.classList.remove("modal-open");
    });
    this.#dom.modal.addEventListener("click", (e) => {
      const dialogDimensions = this.#dom.modal.getBoundingClientRect();
      if (e.clientX < dialogDimensions.left || e.clientX > dialogDimensions.right || e.clientY < dialogDimensions.top || e.clientY > dialogDimensions.bottom) {
        this.hide();
      }
    });
  }
  show() {
    this.#dom.modal.showModal();
    document.body.classList.add("modal-open");
  }
  hide() {
    this.#dom.modal.close();
  }
  getMovieId() {
    const movieId = this.#dom.title.getAttribute("data-movie-id");
    if (!movieId) {
      return void 0;
    }
    return movieId.toString();
  }
  renderData({
    id,
    poster_path,
    title,
    release_date,
    genres,
    vote_average,
    overview
  }) {
    this.#dom.posterImage.src = `${"https://image.tmdb.org/t/p/original"}${poster_path}`;
    this.#dom.posterImage.onerror = () => {
      this.#dom.posterImage.src = NotFoundPoster;
    };
    this.#dom.title.textContent = title;
    this.#dom.title.dataset.movieId = id.toString();
    const year = getYearFromDate(release_date);
    this.#dom.category.textContent = `${year} · ${genres.map((genre) => genre.name).join(", ")}`;
    this.#dom.rateValue.textContent = vote_average.toFixed(1).toString();
    this.#dom.overview.textContent = overview.trim().length === 0 ? "줄거리가 존재하지 않습니다." : overview;
  }
}
const apiUrl = "https://api.themoviedb.org/3";
const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWJkNzQ4MWJiMzE0Mjg0OWMzYjY3MjYxYzU4NzIzOCIsIm5iZiI6MTc0NzcxOTQ0OS41MDEsInN1YiI6IjY4MmMxNTE5ZjZjZjIwNzZmM2UyNTExYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6oFSMOPSVI3bY8aHLin9MmLuM4wNHFPREt_eB5mwAy8";
const fetchMovieDetail = async (movieId) => {
  const response = await fetch(
    `${apiUrl}/movie/${movieId}?language=ko-KR&region=ko-KR`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  if (!response.ok) {
    throw new Error("영화 상세 정보를 불러오는 데 실패했습니다.");
  }
  const data = await response.json();
  const {
    id,
    poster_path,
    title,
    release_date,
    genres,
    vote_average,
    overview
  } = data;
  return {
    id,
    poster_path,
    title,
    release_date,
    genres,
    vote_average,
    overview
  };
};
const RATING = {
  MIN_SCORE: 0,
  MAX_SCORE: 10,
  INITIAL: {
    MESSAGE: "별점 없음",
    SCORE: 0
  },
  TERRIBLE: {
    MESSAGE: "최악이에요",
    SCORE: 2
  },
  POOR: {
    MESSAGE: "별로예요",
    SCORE: 4
  },
  AVERAGE: {
    MESSAGE: "보통이에요",
    SCORE: 6
  },
  GOOD: {
    MESSAGE: "재미있어요",
    SCORE: 8
  },
  EXCELLENT: {
    MESSAGE: "명작이에요",
    SCORE: 10
  }
};
class RatingView {
  #dom;
  constructor() {
    this.#dom = {
      container: getElementOrThrow(".review-star-container"),
      stars: document.querySelectorAll(".review-star"),
      text: getElementOrThrow(".review-text"),
      score: getElementOrThrow(".review-score")
    };
  }
  setRating(ratingValue) {
    this.#dom.container.dataset.ratingValue = ratingValue;
  }
  renderByRatingValue(savedRatingValue) {
    this.#dom.stars.forEach((star) => {
      if (Number(star.getAttribute("data-score")) <= savedRatingValue) {
        star.src = FilledStarIcon;
      } else {
        star.src = EmptyStarIcon;
      }
    });
    this.#renderText(savedRatingValue);
  }
  #renderText(savedRatingValue) {
    if (savedRatingValue <= RATING.INITIAL.SCORE) {
      this.#dom.text.textContent = RATING.INITIAL.MESSAGE;
      this.#dom.score.textContent = `(${RATING.MIN_SCORE}/${RATING.MAX_SCORE})`;
    }
    if (savedRatingValue === RATING.TERRIBLE.SCORE) {
      this.#dom.text.textContent = RATING.TERRIBLE.MESSAGE;
      this.#dom.score.textContent = `(${RATING.TERRIBLE.SCORE}/${RATING.MAX_SCORE})`;
    }
    if (savedRatingValue === RATING.POOR.SCORE) {
      this.#dom.text.textContent = RATING.POOR.MESSAGE;
      this.#dom.score.textContent = `(${RATING.POOR.SCORE}/${RATING.MAX_SCORE})`;
    }
    if (savedRatingValue === RATING.AVERAGE.SCORE) {
      this.#dom.text.textContent = RATING.AVERAGE.MESSAGE;
      this.#dom.score.textContent = `(${RATING.AVERAGE.SCORE}/${RATING.MAX_SCORE})`;
    }
    if (savedRatingValue === RATING.GOOD.SCORE) {
      this.#dom.text.textContent = RATING.GOOD.MESSAGE;
      this.#dom.score.textContent = `(${RATING.GOOD.SCORE}/${RATING.MAX_SCORE})`;
    }
    if (savedRatingValue === RATING.EXCELLENT.SCORE) {
      this.#dom.text.textContent = RATING.EXCELLENT.MESSAGE;
      this.#dom.score.textContent = `(${RATING.EXCELLENT.SCORE}/${RATING.MAX_SCORE})`;
    }
  }
  bindEvent(handler) {
    this.#dom.container.addEventListener("click", (e) => {
      let star = e.target.closest(".review-star");
      if (!star) return;
      const ratingValue = star.getAttribute("data-score");
      if (!ratingValue) {
        throw new Error("올바른 별점이 설정되지 않았습니다.");
      }
      handler(ratingValue);
    });
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
      movieDetail: new MovieDetailView(),
      rating: new RatingView()
    };
    this.#state = {
      popularMoviePage: 1,
      searchMoviePage: 1,
      totalSearchMoviePage: 1,
      totalPopularMoviePage: 1,
      searchString: ""
    };
  }
  async init() {
    this.#bindAllEvents();
    this.#views.movieList.removeTopMargin();
    addEventListener("load", () => {
      const buttonImage = document.createElement("img");
      buttonImage.src = FilledStarIcon;
    });
    await this.#renderPopularMovieAtFirst();
  }
  #bindAllEvents() {
    this.#bindWindowEvent();
    this.#views.search.bindEvent(this.#searchEventHandler);
    this.#views.logo.bindEvent(this.#logoEventHandler);
    this.#views.movieList.bindEvent(this.#movieDetailEventHandler);
    this.#views.movieDetail.bindCloseEvent();
    this.#views.topRated.bindEvent(this.#movieDetailEventHandler);
    this.#views.rating.bindEvent(this.#ratingEventHandler);
  }
  async #renderPopularMovieAtFirst() {
    try {
      this.#views.movieList.addSkeletons();
      const {
        movies: popularMovies,
        nowPage,
        totalPages: popularTotalPages
      } = await fetchPopularMovies(this.#state.popularMoviePage);
      this.#state.popularMoviePage = nowPage;
      this.#state.totalPopularMoviePage = popularTotalPages;
      this.#views.movieList.addMovies(extractThumbnailInfo(popularMovies));
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
  #bindWindowEvent = () => {
    window.addEventListener("scroll", async () => {
      const isSearchPage = this.#state.searchString.length !== 0;
      if (isSearchPage && this.#state.searchMoviePage === this.#state.totalSearchMoviePage) {
        return;
      }
      if (!isSearchPage && this.#state.popularMoviePage === this.#state.totalPopularMoviePage) {
        return;
      }
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        const searchValue = this.#state.searchString;
        const requestMovies = isSearchPage ? () => fetchSearchedMovies(++this.#state.searchMoviePage, searchValue) : () => fetchPopularMovies(++this.#state.popularMoviePage);
        setTimeout(async () => {
          try {
            this.#views.movieList.addSkeletons();
            const { movies, nowPage, totalPages } = await requestMovies();
            if (isSearchPage) {
              this.#state.totalSearchMoviePage = totalPages;
              this.#state.searchMoviePage = nowPage;
            } else {
              this.#state.totalPopularMoviePage = totalPages;
              this.#state.popularMoviePage = nowPage;
            }
            this.#views.movieList.addMovies(extractThumbnailInfo(movies));
          } catch (error) {
            alert(ERROR_MESSAGE.MOVIE.FAILED_GET_MORE);
          } finally {
            this.#views.movieList.removeAllSkeletons();
          }
        }, 200);
      }
    });
  };
  #searchEventHandler = async () => {
    const searchValue = this.#views.search.getInputValue();
    if (searchValue === this.#state.searchString) {
      return;
    }
    this.#views.movieList.addTopMargin();
    this.#state.searchString = searchValue;
    this.#views.topRated.hide();
    this.#views.movieList.hideNotFound();
    this.#state.searchMoviePage = 1;
    window.scrollTo({ top: 0, behavior: "instant" });
    this.#views.movieList.renderTitle(`"${searchValue}"검색 결과`);
    try {
      this.#views.movieList.remove();
      this.#views.movieList.addSkeletons();
      const { movies, nowPage, totalPages } = await fetchSearchedMovies(
        this.#state.searchMoviePage,
        searchValue
      );
      this.#state.totalSearchMoviePage = totalPages;
      this.#state.searchMoviePage = nowPage;
      this.#views.movieList.addMovies(extractThumbnailInfo(movies));
      if (movies.length === 0) {
        this.#views.movieList.showNotFound();
      }
    } catch (error) {
      alert(ERROR_MESSAGE.MOVIE.FAILED_SEARCH);
    } finally {
      this.#views.movieList.removeAllSkeletons();
    }
  };
  #movieDetailEventHandler = async (movieId) => {
    const movieDetail = { ...await fetchMovieDetail(movieId) };
    this.#views.movieDetail.show();
    const savedRatingValue = Number(localStorage.getItem(`rating-${movieId}`));
    this.#views.rating.renderByRatingValue(savedRatingValue);
    this.#views.movieDetail.renderData(movieDetail);
  };
  #ratingEventHandler = (ratingValue) => {
    this.#views.rating.setRating(ratingValue);
    const movieId = this.#views.movieDetail.getMovieId();
    localStorage.setItem(`rating-${movieId}`, ratingValue);
    this.#views.rating.renderByRatingValue(Number(ratingValue));
  };
}
const app = new App();
await app.init();
