class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "7bc7cf24-3d44-4e17-9c6c-7ed738e2f181",
      },
    }).then((res) => res.json());
    // ...
  }

  // other methods for working with the API
}

export default Api;
