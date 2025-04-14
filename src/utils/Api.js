class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getAppInfo() {
    //return Promise.all([this.getUserInfo()]);
    return Promise.all([this.getInitialCards()]);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      //return
      Promise.reject(`Error: ${res.status}`);
    });
  }

  // getUserInfo() {
  //   return fetch(`${this._baseUrl}/users/me`, {
  //     headers: this._headers,
  //   }).then((res) => {
  //     if (res.ok) {
  //       return res.json();
  //     }
  //
  //     Promise.reject(`Error: ${res.status}`);
  //   });
  // }

  // create another method, called something like getUserInfo (can look like the above, just different baseurl)

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }

      Promise.reject(`Error: ${res.status}`);
    });
  }

  editAvatarInfo(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }

      Promise.reject(`Error: ${res.status}`);
    });
  }

  // editDeleteInfo() {
  //   return fetch(`${this._baseUrl}/cards/cardsId/`, {
  //     method: "DELETE",
  //     headers: this._headers,
  //     body: JSON.stringify({
  //       avatar,
  //     }),
  //   }).then((res) => {
  //     if (res.ok) {
  //       return res.json();
  //     }

  //     Promise.reject(`Error: ${res.status}`);
  //   });
  // }
}

export default Api;
