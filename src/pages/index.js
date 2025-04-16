import "./index.css";

import {
  disableButton,
  enableValidation,
  settings,
} from "../scripts/validation.js";

import { setButtonText } from "../utils/helper.js";
import { deleteButtonText } from "../utils/helper.js";

import Api from "../utils/Api.js";

import { resetValidation } from "../scripts/validation.js";

import logo from "../images/Logo.svg";
import avatar from "../images/avatar.jpg";

const logoImage = document.getElementById("spots-logo");
logoImage.src = logo;

const avatarImage = document.getElementById("user-avatar");
avatarImage.src = avatar;

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",

    name: "Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "7bc7cf24-3d44-4e17-9c6c-7ed738e2f181",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });

    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    avatarImage.src = userInfo.avatar;
  })

  .catch(console.error);

//console.log(initialCards);

// Profile

const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__new-post-button");
const avatarModalButton = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__title");

// Modal

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const profileCloseButton = editModal.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

// Cards

const cardModal = document.querySelector("#add-card-modal");
const addCardFormElement = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-button");
const cardModalCloseButton = cardModal.querySelector(".modal__close-button");
const cardModalLinkInput = cardModal.querySelector("#add-card-link-input");
const cardModalCaptionInput = cardModal.querySelector(
  "#add-card-caption-input"
);

// Preview Modal

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseTypePreview = previewModal.querySelector(
  ".modal__close-button_type_preview"
);

// Avatar Modal

const avatarModal = document.querySelector("#avatar-modal");
const addAvatarFormElement = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-button");
const avatarModalCloseButton = avatarModal.querySelector(
  ".modal__close-button"
);
const avatarModalLinkInput = avatarModal.querySelector(
  "#add-avatar-link-input"
);

const avatarInput = document.querySelector("#profile-avatar-input");

// Delete Modal

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseButton = deleteModal.querySelector(
  ".modal__close-button"
);
const deleteModalCancelButton = deleteModal.querySelector(
  ".modal__submit-button-cancel-card"
);

// Card Elements

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard;
let selectedCardId;

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.link;
  console.log(cardImageEl);

  function handleLike(evt, id) {
    const isLiked = evt.target.classList.contains("card__like-button_liked");
    api
      .changeLikes(id, isLiked)
      .then(() => {
        evt.target.classList.toggle("card__like-button_liked");
      })
      .catch(console.error);
  }

  cardLikeButton.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.link;
    previewModalCaptionEl.textContent = data.name;
    console.log;
  });

  cardDeleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscClose);
}

function handleEscClose(event) {
  if (event.key === "Escape") {
    const modal = document.querySelector(".modal_opened");
    if (modal) {
      closeModal(modal);
    }
  }
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

//implement loading text for all other form submissions

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  setButtonText(submitButton, true);
  api
    .createCard({
      name: cardModalCaptionInput.value,
      link: cardModalLinkInput.value,
    })
    .then((data) => {
      const cardElement = getCardElement(data); // Use data from server response
      cardsList.prepend(cardElement);
      evt.target.reset();
      disableButton(cardSubmitBtn, settings);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  console.log(avatarInput.value);
  const submitButton = evt.submitter;
  setButtonText(submitButton, true);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      console.log(data.avatar);
      avatarImage.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  console.log("Selected Card ID before delete:", selectedCardId);
  const submitButton = evt.submitter;
  deleteButtonText(submitButton, true);
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      deleteButtonText(submitButton, false);
    });
}

function handleDeleteCard(cardElement, cardId) {
  console.log("Card ID in handleDeleteCard:", cardId);
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

profileCloseButton.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseButton.addEventListener("click", () => {
  closeModal(cardModal);
});

previewModalCloseTypePreview.addEventListener("click", () => {
  closeModal(previewModal);
});

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

deleteModalCloseButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

const modals = document.querySelectorAll(".modal");

modals.forEach((modal) => {
  modal.addEventListener("click", function (event) {
    if (event.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

editFormElement.addEventListener("submit", handleEditFormSubmit);

addCardFormElement.addEventListener("submit", handleCardFormSubmit);

addAvatarFormElement.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

// initialCards.forEach((item) => {
//   console.log(item);
//   const cardElement = getCardElement(item);
//   cardsList.prepend(cardElement);
// });

enableValidation(settings);
