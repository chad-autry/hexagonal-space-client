
// Render editor
module.exports = class FetchService {
    constructor() {
        this.setAuthService = this.setAuthService.bind(this);
        this.postWithAuth = this.postWithAuth.bind(this);
    }

    setAuthService(authService) {
       this.authService = authService; 
    }

    postWithAuth(url, body, andThen, noAndThen) {
        //Since JS is single threaded, no need to worry the token can change after checking isAuthenticated
        if (this.authService.isAuthenticated()) {
            fetch(url, {
	        'method': 'post',
                'headers': new Headers({
	             'Content-Type': 'text/plain',
                     'Authorization': 'JWT ' + this.authService.getToken()
                }),
	        'body': new FormData(body)
            }).then(andThen).error(noAndThen);
        } else {
            //TODO Create an error response
            noAndThen();
        }
    }
};
