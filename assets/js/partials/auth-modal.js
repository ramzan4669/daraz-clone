export const authModalHtml = `    <div
      class="modal-wrapper d-none justify-content-center align-items-center position-fixed top-0 w-100 h-100"
    >
      <div
        class="modal-container d-flex flex-column position-relative"
        style="justify-content: space-between"
      >
        <div class="modal-close-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 36 36"
            width="100%"
            height="100%"
          >
            <path d="M28 8 8 28M8 8l20 20"></path>
          </svg>
        </div>

        <!-- Login Content -->
        <div class="modal-content login-content active">
          <div>
            <div class="login-tabs-wrapper">
              <div class="login-tab login-tab-active" data-tab="password">
                Password
              </div>
              <div class="login-tab" data-tab="phone">Phone Number</div>
            </div>
            <!-- Password Tab Content -->
            <div class="login-tab-content login-tab-password">
              <div class="login-form-wrapper">
                <input
                  type="text"
                  placeholder="Please enter your Phone or Email"
                  class="login-input"
                />
                <div class="login-password-wrapper">
                  <input
                    type="password"
                    class="login-input login-password-input"
                    placeholder="Please enter your password"
                  />
                  <div class="login-password-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 36 36"
                      width="100%"
                      height="100%"
                      style="display: block"
                    >
                      <path
                        d="M32.711 11c-3.166 4.841-8.573 8.03-14.71 8.03-6.139 0-11.546-3.189-14.712-8.03M9.79 17.5l-3 5m8.5-3-1 5.5m12.5-7.5 3 5m-8.5-3 1 5.5"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div class="login-forgot-link">Forgot password?</div>
                <button class="login-btn">LOGIN</button>
              </div>
              <div class="login-hint">
                Don't have an account?&nbsp;<a
                  class="signup-link switch-to-signup"
                  href="#"
                  >Sign up</a
                >
              </div>
            </div>
            <!-- Phone Number Tab Content -->
            <div class="login-tab-content login-tab-phone" style="display: none">
              <div class="login-phone-form-wrapper">
                <div class="login-phone-row">
                  <div class="login-phone-prefix">
                    <span class="signup-phone-flag">&#127477;&#127472;</span>
                    <span class="signup-phone-code">+92</span>
                  </div>
                  <input
                    type="text"
                    class="login-phone-input"
                    placeholder="Please enter your phone number"
                  />
                </div>
                <button class="login-whatsapp-btn">
                  <img
                    src="https://lzd-img-global.slatic.net/g/tps/imgextra/i2/O1CN01a3DUz31SqzLbTfmQ2_!!6000000002299-2-tps-54-54.png"
                    alt=""
                  />
                  <span>Send code via Whatsapp</span>
                </button>
              </div>
              <div class="login-hint">
                Don't have an account?&nbsp;
                <a class="signup-link switch-to-signup" href="#">Sign up</a>
              </div>
            </div>
          </div>
          <div class="login-bottom-section">
            <p class="or-text">Or, login with</p>
            <div class="signup-social-section">
              <button class="signup-social-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path
                    fill="#4280EF"
                    d="M42.462 24.212a23.57 23.57 0 0 0-.329-3.817h-17.77v7.264h10.178a8.562 8.562 0 0 1-3.775 5.705l6.073 4.72c3.57-3.325 5.623-8.168 5.623-13.872"
                  ></path>
                  <path
                    fill="#34A353"
                    d="M24.365 42.597c5.09 0 9.357-1.683 12.476-4.556l-6.074-4.678c-1.682 1.149-3.857 1.806-6.402 1.806-4.924 0-9.07-3.324-10.588-7.757L7.54 32.214a18.818 18.818 0 0 0 16.825 10.383"
                  ></path>
                  <path
                    fill="#F6B704"
                    d="M13.777 27.371c-.78-2.339-.78-4.883 0-7.223l-6.238-4.842c-2.667 5.335-2.667 11.614 0 16.908z"
                  ></path>
                  <path
                    fill="#E54335"
                    d="M24.365 12.393a10.277 10.277 0 0 1 7.223 2.832l5.376-5.418c-3.406-3.2-7.92-4.924-12.599-4.883A18.818 18.818 0 0 0 7.54 15.307l6.237 4.842c1.519-4.473 5.664-7.756 10.588-7.756"
                  ></path>
                </svg>
                <span>Google</span>
              </button>
              <button class="signup-social-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path
                    fill="#1877F2"
                    d="M47.385 24.143C47.385 11.149 36.915.615 24 .615 11.085.615.615 11.15.615 24.143c0 11.743 8.552 21.477 19.731 23.242V30.944H14.41v-6.801h5.937V18.96c0-5.897 3.491-9.154 8.833-9.154 2.559 0 5.235.46 5.235.46v5.79h-2.95c-2.904 0 -3.81 1.813-3.81 3.674v4.413h6.485l-1.036 6.8h-5.45v16.442c11.18-1.765 19.732-11.498 19.732-23.242"
                  ></path>
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Signup Content -->
        <div class="modal-content signup-content">
          <div>
            <div class="signup-title">Sign up</div>
            <div class="signup-form-wrapper">
              <div class="signup-phone-wrapper">
                <div class="signup-phone-prefix">
                  <span class="signup-phone-flag">&#127477;&#127472;</span
                  ><span class="signup-phone-code">+92</span>
                </div>
                <input
                  type="text"
                  class="signup-phone-input"
                  placeholder="Please enter your phone number"
                />
              </div>
              <div class="signup-terms">
                <label class="signup-terms-label">
                  <input type="checkbox" class="signup-terms-checkbox" />
                  <span class="signup-terms-text"
                    >By creating and/or using your account, you agree to our
                    <a href="#">Terms of Use</a>&nbsp; and&nbsp;<a href="#"
                      >Privacy Policy</a
                    >.</span
                  >
                </label>
              </div>
              <button class="signup-whatsapp-btn">
                <img
                  src="https://lzd-img-global.slatic.net/g/tps/imgextra/i2/O1CN01a3DUz31SqzLbTfmQ2_!!6000000002299-2-tps-54-54.png"
                  alt=""
                />
                <span>Send code via Whatsapp</span>
              </button>
            </div>
            <div class="signup-hint">
              Already have an account?&nbsp;<a
                class="signup-login-link switch-to-login"
                href="#"
                >Log in Now</a
              >
            </div>
          </div>
          <div class="signup-bottom-section">
            <p class="or-text">Or, sign up with</p>
            <div class="signup-social-section">
              <button class="signup-social-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path
                    fill="#4280EF"
                    d="M42.462 24.212a23.57 23.57 0 0 0-.329-3.817h-17.77v7.264h10.178a8.562 8.562 0 0 1-3.775 5.705l6.073 4.72c3.57-3.325 5.623-8.168 5.623-13.872"
                  ></path>
                  <path
                    fill="#34A353"
                    d="M24.365 42.597c5.09 0 9.357-1.683 12.476-4.556l-6.074-4.678c-1.682 1.149-3.857 1.806-6.402 1.806-4.924 0-9.07-3.324-10.588-7.757L7.54 32.214a18.818 18.818 0 0 0 16.825 10.383"
                  ></path>
                  <path
                    fill="#F6B704"
                    d="M13.777 27.371c-.78-2.339-.78-4.883 0-7.223l-6.238-4.842c-2.667 5.335-2.667 11.614 0 16.908z"
                  ></path>
                  <path
                    fill="#E54335"
                    d="M24.365 12.393a10.277 10.277 0 0 1 7.223 2.832l5.376-5.418c-3.406-3.2-7.92-4.924-12.599-4.883A18.818 18.818 0 0 0 7.54 15.307l6.237 4.842c1.519-4.473 5.664-7.756 10.588-7.756"
                  ></path>
                </svg>
                <span>Google</span>
              </button>
              <button class="signup-social-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path
                    fill="#1877F2"
                    d="M47.385 24.143C47.385 11.149 36.915.615 24 .615 11.085.615.615 11.15.615 24.143c0 11.743 8.552 21.477 19.731 23.242V30.944H14.41v-6.801h5.937V18.96c0-5.897 3.491-9.154 8.833-9.154 2.559 0 5.235.46 5.235.46v5.79h-2.95c-2.904 0 -3.81 1.813-3.81 3.674v4.413h6.485l-1.036 6.8h-5.45v16.442c11.18-1.765 19.732-11.498 19.732-23.242"
                  ></path>
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
`;
