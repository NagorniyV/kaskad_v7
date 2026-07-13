<!-- Модальное окно -->
      <div id="callbackModal" class="modal">
        <div class="modal-content">
          <span class="modal-close">&times;</span>
          <p data-translate="modal-title">
            Оставьте ваши дані, и ми перезвоним с готовым решением.
          </p>
          <form class="modal-callbackForm" id="modalForm" data-lead-type="razborka">
            <div class="form-group">
              <label for="modalName" data-translate="name">Ім’я</label>
              <input type="text" id="modalName" name="name" />
            </div>

            <div class="form-group">
              <label for="modalPhone" data-translate="phone">Телефон*</label>
              <input
                type="tel"
                id="modalPhone"
                name="phone"
                placeholder="+38 (050) 111 22 33"
                maxlength="19"
                required
              />
            </div>

            <div class="form-group">
              <label for="modalCar">Марка / модель автомобиля</label>
              <input type="text" id="modalCar" name="carModel" />
            </div>

            <div class="form-group">
              <label for="modalPart" data-translate="part-label">Номер / название запчасти</label>
              <input
                type="text"
                id="modalPart"
                name="part"
                data-translate-placeholder="part-placeholder"
                placeholder="Номер / название запчасти"
              />
            </div>

            <div class="form-group">
              <label for="modalVin" data-translate="vin"
                >VIN-код автомобиля</label
              >
              <input
                type="text"
                id="modalVin"
                name="vin"
                placeholder="VIN-код (17 символов)"
                maxlength="17"
                spellcheck="false"
                autocomplete="off"
              />
            </div>

            <button
              type="submit"
              class="submit-btn"
              data-translate="submit-btn"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
      <div class="social-fixed">
        <button
          type="button"
          class="callback-fixed-btn"
          id="fixedCallbackBtn"
          aria-label="Получить консультацию"
          data-translate-aria="callback-fixed-btn-text"
        >
          <span class="callback-fixed-btn__icon">
            <img src="./src/img/callback-btn-img.png" alt="" />
          </span>
          <span
            class="callback-fixed-btn__text"
            data-translate="callback-fixed-btn-text"
            >Получить консультацию</span
          >
        </button>
        <a
          href="https://t.me/kkua1210"
          target="_blank"
          class="social-btn telegram"
          rel="noopener noreferrer"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0,0,256,256"
            style="fill: #ffffff"
          >
            <g
              fill="#ffffff"
              fill-rule="nonzero"
              stroke="none"
              stroke-width="1"
              stroke-linecap="butt"
              stroke-linejoin="miter"
              stroke-miterlimit="10"
              stroke-dasharray=""
              stroke-dashoffset="0"
              font-family="none"
              font-weight="none"
              font-size="none"
              text-anchor="none"
              style="mix-blend-mode: normal"
            >
              <g transform="scale(5.12,5.12)">
                <path
                  d="M46.137,6.552c-0.75,-0.636 -1.928,-0.727 -3.146,-0.238h-0.002c-1.281,0.514 -36.261,15.518 -37.685,16.131c-0.259,0.09 -2.521,0.934 -2.288,2.814c0.208,1.695 2.026,2.397 2.248,2.478l8.893,3.045c0.59,1.964 2.765,9.21 3.246,10.758c0.3,0.965 0.789,2.233 1.646,2.494c0.752,0.29 1.5,0.025 1.984,-0.355l5.437,-5.043l8.777,6.845l0.209,0.125c0.596,0.264 1.167,0.396 1.712,0.396c0.421,0 0.825,-0.079 1.211,-0.237c1.315,-0.54 1.841,-1.793 1.896,-1.935l6.556,-34.077c0.4,-1.82 -0.156,-2.746 -0.694,-3.201zM22,32l-3,8l-3,-10l23,-17z"
                ></path>
              </g>
            </g>
          </svg>
          <i class="fab fa-telegram social-icon"></i>
        </a>
        <a href="viber://chat?number=+380668375666" class="social-btn viber"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0,0,256,256"
            style="fill: #ffffff"
          >
            <g
              fill="#ffffff"
              fill-rule="nonzero"
              stroke="none"
              stroke-width="1"
              stroke-linecap="butt"
              stroke-linejoin="miter"
              stroke-miterlimit="10"
              stroke-dasharray=""
              stroke-dashoffset="0"
              font-family="none"
              font-weight="none"
              font-size="none"
              text-anchor="none"
              style="mix-blend-mode: normal"
            >
              <g transform="scale(8,8)">
                <path
                  d="M15.69922,4c-1.9,0 -6.59961,0.19961 -9.09961,2.59961c-1.8,1.7 -2.49961,4.30039 -2.59961,7.40039c-0.2,4.9 0.89922,7.99961 2.69922,9.59961c0.4,0.3 1.40078,1.10117 3.30078,1.70117v2.5c0,0 -0.00039,0.99922 0.59961,1.19922c0.1,0 0.20078,0.09961 0.30078,0.09961c0.6,0 1.09883,-0.70039 1.79883,-1.40039c0.6,-0.7 1.10039,-1.19922 1.40039,-1.69922h1.40039h0.80078c1.9,0 6.59961,-0.19961 9.09961,-2.59961c1.8,-1.8 2.5,-4.40117 2.5,-7.70117c0.1,-0.5 0.09961,-1.09922 0.09961,-1.69922c-0.1,-3.7 -1.19922,-6.19961 -2.69922,-7.59961c-0.6,-0.5 -3.20078,-2.40039 -8.80078,-2.40039zM15.5,5.90039h0.69922h0.10156h0.09961c5.3,0 7.3,1.70039 7.5,1.90039c1.2,1 1.9,3.19961 2,6.09961v0.40039c0.1,0.6 0.09961,1.09844 0.09961,1.39844c-0.1,3 -0.70039,5.00078 -1.90039,6.30078c-2.1,1.9 -6.49922,2 -7.69922,2h-0.70117h-0.09961h-0.09961h-1l-1.59961,1.80078l-1,1.09961l-0.20117,0.29883c-0.2,0.2 -0.49922,0.60117 -0.69922,0.70117v-0.20117v-4.29883c-2,-0.5 -2.8,-1.20039 -3,-1.40039c-1.4,-1.2 -2.2,-4.1 -2,-8v-1c0.2,-2.4 0.80078,-3.99961 1.80078,-5.09961c2.1,-1.9 6.49922,-2 7.69922,-2zM15.40039,8.09961c-0.5,0 -0.5,0.70117 0,0.70117c3.7,0 6.90039,2.49922 6.90039,7.19922c0,0.5 0.69922,0.5 0.69922,0c0,-5.1 -3.39961,-8.00039 -7.59961,-7.90039zM11.4375,9.02539c-0.2125,-0.025 -0.43672,0.02383 -0.63672,0.17383c-1,0.5 -2.00117,1.50156 -1.70117,2.60156c0,0 0.20078,0.89883 1.30078,2.79883c0.6,0.9 1.09961,1.70078 1.59961,2.30078c0.5,0.7 1.29961,1.49961 2.09961,2.09961c1.6,1.3 4.10117,2.60039 5.20117,2.90039c1,0.3 2.09961,-0.70117 2.59961,-1.70117c0.2,-0.4 0.09922,-0.89922 -0.30078,-1.19922c-0.6,-0.6 -1.59883,-1.29922 -2.29883,-1.69922c-0.5,-0.3 -1.10078,-0.10078 -1.30078,0.19922l-0.5,0.59961c-0.2,0.3 -0.69922,0.30078 -0.69922,0.30078c-3.3,-0.9 -4.20117,-4.30078 -4.20117,-4.30078c0,0 0.00078,-0.39922 0.30078,-0.69922l0.59961,-0.5c0.3,-0.2 0.49922,-0.80078 0.19922,-1.30078c-0.2,-0.3 -0.49883,-0.89922 -0.79883,-1.19922c-0.3,-0.4 -0.90039,-1.09961 -0.90039,-1.09961c-0.15,-0.15 -0.35,-0.25039 -0.5625,-0.27539zM16.09961,10.09961c-0.5,-0.1 -0.59961,0.70117 -0.09961,0.70117c2.8,0.2 4.40078,2.1 4.30078,4.5c-0.1,0.5 0.69922,0.5 0.69922,0c0.1,-2.8 -1.70039,-5.10117 -4.90039,-5.20117zM16.40039,12c-0.5,-0.1 -0.5,0.69922 0,0.69922c1.2,0 1.79883,0.70039 1.79883,1.90039c0.1,0.5 0.80078,0.5 0.80078,0c-0.1,-1.6 -0.99961,-2.59961 -2.59961,-2.59961z"
                ></path>
              </g>
            </g>
          </svg>
          <i class="fab fa-viber social-icon"></i>
        </a>
        <a href="tel:+380668375666" class="social-btn phone"
          ><svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.62 10.79a15.091 15.091 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.48 2.53.74 3.88.74a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.26 2.67.74 3.88a1 1 0 01-.21 1.11l-2.2 2.2z"
              fill="white"
            />
          </svg>

          <i class="fas fa-phone social-icon"></i>
        </a>
      </div>
      <a href="#header" class="to-home" id="back-to-top" aria-label="Наверх">
        <span class="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </span>
        <span class="text" data-translate="up-btn">Подняться в начало</span>
      </a>
