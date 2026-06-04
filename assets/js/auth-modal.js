const modalWrapper = document.querySelector(".modal-wrapper");
const modalContainer = document.querySelector(".modal-container");
const signupContent = document.querySelector(".signup-content");
const loginContent = document.querySelector(".login-content");
const authScrollContainer = document.querySelector("#recyclerview") || document.body;

let switchTimeout = null;
let pendingContent = null;

function openModal() {
  modalWrapper.classList.remove("d-none");
  modalWrapper.classList.add("d-flex");
  void modalWrapper.offsetWidth;
  modalWrapper.classList.add("modal-open");
}

function closeModal() {
  clearTimeout(switchTimeout);
  modalContainer.classList.remove("switching");
  if (pendingContent) {
    pendingContent.classList.add("active");
    pendingContent = null;
  }
  modalWrapper.classList.remove("modal-open");
  setTimeout(() => {
    modalWrapper.classList.remove("d-flex");
    modalWrapper.classList.add("d-none");
  }, 200);
}

function switchContent(fromContent, toContent) {
  modalContainer.classList.add("switching");
  void modalContainer.offsetWidth;
  fromContent.classList.remove("active");
  pendingContent = toContent;

  switchTimeout = setTimeout(() => {
    toContent.classList.add("active");
    pendingContent = null;
    switchTimeout = setTimeout(() => {
      modalContainer.classList.remove("switching");
      switchTimeout = null;
    }, 500);
  }, 500);
}

function showLogin() {
  if (loginContent.classList.contains("active") || modalContainer.classList.contains("switching")) return;

  if (modalWrapper.classList.contains("modal-open") && signupContent.classList.contains("active")) {
    switchContent(signupContent, loginContent);
  } else {
    loginContent.classList.add("active");
    signupContent.classList.remove("active");
  }
}

function showSignup() {
  if (signupContent.classList.contains("active") || modalContainer.classList.contains("switching")) return;

  if (modalWrapper.classList.contains("modal-open") && loginContent.classList.contains("active")) {
    switchContent(loginContent, signupContent);
  } else {
    signupContent.classList.add("active");
    loginContent.classList.remove("active");
  }
}

document.querySelectorAll(".auth-trigger").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
    openModal();
  });
});

document.querySelectorAll(".signup-trigger").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    showSignup();
    openModal();
  });
});

document.querySelectorAll(".modal-close-icon").forEach((el) => {
  el.addEventListener("click", closeModal);
});

document.querySelectorAll(".switch-to-signup").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    showSignup();
  });
});

document.querySelectorAll(".switch-to-login").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });
});

document.querySelectorAll(".login-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".login-tab").forEach((t) => t.classList.remove("login-tab-active"));
    tab.classList.add("login-tab-active");

    const target = tab.dataset.tab;
    if (target === "password") {
      document.querySelector(".login-tab-password").style.display = "";
      document.querySelector(".login-tab-phone").style.display = "none";
    } else {
      document.querySelector(".login-tab-password").style.display = "none";
      document.querySelector(".login-tab-phone").style.display = "";
    }
  });
});
