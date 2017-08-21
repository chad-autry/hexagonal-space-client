// Render editor
const FetchService = class FetchService {
  constructor() {
    this.setAuthService = this.setAuthService.bind(this);
    this.postWithAuth = this.postWithAuth.bind(this);
  }

  setAuthService(authService) {
    this.authService = authService;
  }

  postWithAuth(url, contentType, body, andThen, noAndThen) {
    //Since JS is single threaded, no need to worry the token can change after checking isAuthenticated
    if (this.authService.isAuthenticated()) {
      fetch(url, {
        method: "post",
        headers: new Headers({
          "Content-Type": contentType,
          Authorization: this.authService.getToken()
        }),
        body: body
      })
        .then(andThen)
        .catch(noAndThen);
    } else {
      //TODO Create an error response
      noAndThen();
    }
  }

  getJson(url, contentType, andThen, noAndThen, params) {
    //Since JS is single threaded, no need to worry the token can change after checking isAuthenticated
      let query = Object.keys(params)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
        .join("&");
      if (query) {
        query = "?" + query;
      }
      let urlWithQuery = url + query;
      fetch(urlWithQuery, {
        method: "get",
        headers: new Headers({
          "Content-Type": contentType
        })
      })
        .then(response => {
          return response.json();
        })
        .then(andThen)
        .catch(noAndThen);
  }

  getJsonWithAuth(url, contentType, andThen, noAndThen, params) {
    //Since JS is single threaded, no need to worry the token can change after checking isAuthenticated
    if (this.authService.isAuthenticated()) {
      let query = Object.keys(params)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
        .join("&");
      if (query) {
        query = "?" + query;
      }
      let urlWithQuery = url + query;
      fetch(urlWithQuery, {
        method: "get",
        headers: new Headers({
          "Content-Type": contentType,
          Authorization: this.authService.getToken()
        })
      })
        .then(response => {
          return response.json();
        })
        .then(andThen)
        .catch(noAndThen);
    } else {
      //TODO Create an error response
      noAndThen();
    }
  }

  putWithAuth(url, contentType, andThen, noAndThen, params) {
    //Since JS is single threaded, no need to worry the token can change after checking isAuthenticated
    if (this.authService.isAuthenticated()) {
      let query = Object.keys(params)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
        .join("&");
      if (query) {
        query = "?" + query;
      }
      let urlWithQuery = url + query;
      fetch(urlWithQuery, {
        method: "put",
        headers: new Headers({
          "Content-Type": contentType,
          Authorization: this.authService.getToken()
        })
      })
        .then(response => {
          return response.json();
        })
        .then(andThen)
        .catch(noAndThen);
    } else {
      //TODO Create an error response
      noAndThen();
    }
  }
};

export default FetchService;
