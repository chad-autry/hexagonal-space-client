
// Render editor
module.exports = class FetchService {
    constructor() {
        this.setAuthService = this.setAuthService.bind(this);
    }

    setAuthService(authService) {
       this.authService = authService; 
    }

};
