// Render editor
const FetchService = class FetchService {
  constructor() {
    this.setAuthService = this.setAuthService.bind(this);
    this.postWithAuth = this.postWithAuth.bind(this);
    this.requestListener = {};
    this.handleErrors = response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    };

    this.defaultNoAndThen = err => {
      // eslint-disable-next-line no-console
      console.error(err);
    };
  }

  setAuthService(authService) {
    this.authService = authService;
  }

  listen(url, callback) {
    this.requestListener[url] = callback;
  }

  postWithAuth(
    url,
    contentType,
    body,
    andThen,
    noAndThen = this.defaultNoAndThen
  ) {
    if (this.requestListener[url]) {
      this.requestListener[url](true);
    }

    try {
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
          .then(this.handleErrors)
          .then(andThen)
          .catch(noAndThen)
          .finally(() => {
            if (this.requestListener[url]) {
              this.requestListener[url](false);
            }
          });
      } else {
        //TODO Create an error response
        noAndThen();
        if (this.requestListener[url]) {
          this.requestListener[url](false);
        }
      }
    } catch (e) {
      if (this.requestListener[url]) {
        this.requestListener[url](false);
      }
    }
  }

  getJson(
    url,
    contentType,
    andThen,
    noAndThen = this.defaultNoAndThen,
    params
  ) {
    if (this.requestListener[url]) {
      this.requestListener[url](true);
    }
    try {
      //Since JS is single threaded, no need to worry the token can change after checking isAuthenticated
      let query = "";
      if (params) {
        query = Object.keys(params)
          .map(
            k =>
              encodeURIComponent(k) +
              "=" +
              encodeURIComponent(JSON.stringify(params[k]))
          )
          .join("&");
        if (query) {
          query = "?" + query;
        }
      }
      let urlWithQuery = url + query;
      fetch(urlWithQuery, {
        method: "get",
        headers: new Headers({
          "Content-Type": contentType
        })
      })
        .then(this.handleErrors)
        .then(response => {
          return response.json();
        })

        .then(andThen)
        .catch(noAndThen)
        .finally(() => {
          if (this.requestListener[url]) {
            this.requestListener[url](false);
          }
        });
    } catch (e) {
      if (this.requestListener[url]) {
        this.requestListener[url](false);
      }
    }
  }

  getJsonWithAuth(
    url,
    contentType,
    andThen,
    noAndThen = this.defaultNoAndThen,
    params
  ) {
    if (this.requestListener[url]) {
      this.requestListener[url](true);
    }
    try {
      //Since JS is single threaded, no need to worry the token can change after checking isAuthenticated
      if (this.authService.isAuthenticated()) {
        let query = "";
        if (params) {
          query = Object.keys(params)
            .map(
              k =>
                encodeURIComponent(k) +
                "=" +
                encodeURIComponent(JSON.stringify(params[k]))
            )
            .join("&");
          if (query) {
            query = "?" + query;
          }
        }
        let urlWithQuery = url + query;
        fetch(urlWithQuery, {
          method: "get",
          headers: new Headers({
            "Content-Type": contentType,
            Authorization: this.authService.getToken()
          })
        })
          .then(this.handleErrors)
          .then(response => {
            return response.json();
          })
          .then(andThen)
          .catch(noAndThen)
          .finally(() => {
            if (this.requestListener[url]) {
              this.requestListener[url](false);
            }
          });
      } else {
        //TODO Create an error response
        noAndThen();
        if (this.requestListener[url]) {
          this.requestListener[url](false);
        }
      }
    } catch (e) {
      if (this.requestListener[url]) {
        this.requestListener[url](false);
      }
    }
  }

  putWithAuth(
    url,
    contentType,
    andThen,
    noAndThen = this.defaultNoAndThen,
    params
  ) {
    if (this.requestListener[url]) {
      this.requestListener[url](true);
    }
    try {
      //Since JS is single threaded, no need to worry the token can change after checking isAuthenticated
      if (this.authService.isAuthenticated()) {
        let query = "";
        if (params) {
          Object.keys(params)
            .map(
              k =>
                encodeURIComponent(k) +
                "=" +
                encodeURIComponent(JSON.stringify(params[k]))
            )
            .join("&");
          if (query) {
            query = "?" + query;
          }
        }
        let urlWithQuery = url + query;
        fetch(urlWithQuery, {
          method: "put",
          headers: new Headers({
            "Content-Type": contentType,
            Authorization: this.authService.getToken()
          })
        })
          .then(this.handleErrors)
          .then(response => {
            return response.json();
          })
          .then(andThen)
          .catch(noAndThen)
          .finally(() => {
            if (this.requestListener[url]) {
              this.requestListener[url](false);
            }
          });
      } else {
        //TODO Create an error response
        noAndThen();
        if (this.requestListener[url]) {
          this.requestListener[url](false);
        }
      }
    } catch (e) {
      if (this.requestListener[url]) {
        this.requestListener[url](false);
      }
    }
  }
};

export default FetchService;
