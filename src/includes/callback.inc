<section class="callback-section">
          <h2 class="callback-main-title" data-translate="callback-main-title">
            Наши специалисты
          </h2>
          <div class="callback-section-container">
            <div class="callback-card-container">
              <div class="team-card">
                <picture>
                  <source
                    srcset="./src/img/colleagues/dir.webp"
                    type="image/webp"
                  />
                  <img
                    src="./src/img/colleagues/dir.jpg"
                    alt="dir_filipov_pp"
                    class="team-card-img"
                    loading="lazy"
                  />
                </picture>
                <h3 class="team-card-title" data-translate="card-dir-title">
                  Филипов Павел
                </h3>
                <p
                  class="team-card-position"
                  data-translate="card-dir-position"
                >
                  директор автосервиса
                </p>
                <p class="team-card-content" data-translate="card-dir-content">
                  «Место, где строгии контроль встречается с заботои о клиенте.»
                </p>
              </div>
              <div class="team-card">
                <picture>
                  <source
                    srcset="./src/img/colleagues/colleagues-1.webp"
                    type="image/webp"
                  />
                  <img
                    src="./src/img/colleagues/colleagues-1.jpg"
                    alt="Dmitrienko_Anton"
                    class="team-card-img"
                    loading="lazy"
                  />
                </picture>
                <h3 class="team-card-title" data-translate="card-ant-title">
                  Дмитренко Антон
                </h3>
                <p
                  class="team-card-position"
                  data-translate="card-ant-position"
                >
                  старшии менеджер
                </p>
                <p class="team-card-content" data-translate="card-ant-content">
                  «Одна команда — один стандарт качества.»
                </p>
              </div>
            </div>
            <div class="callback-container">
              <p class="callbaack-main-title">
                <span data-translate="callbaack-main-title"
                  >ПОЛУЧИТЕ РЕКОМЕНДАЦИЮ ПО РЕШЕНИЮ ПРОБЛЕММЫ</span
                >
                <span
                  class="span-cb-title"
                  data-translate="callbaack-span-title"
                  >БЕСПЛАТНО!</span
                >
              </p>
              <form id="callbackForm">
                <input
                  type="text"
                  id="nameInput"
                  name="name"
                  data-translate-placeholder="name-placeholder"
                  placeholder="Ваше имя"
                />
                <input
                  type="tel"
                  id="phoneInput"
                  name="phone"
                  placeholder="+38 (050) 111 22 33"
                  maxlength="19"
                  required
                />
                <input
                  type="text"
                  id="carInput"
                  name="car"
                  placeholder="Марка и модель авто"
                />
                <input
                  type="text"
                  id="vinInput"
                  name="vin"
                  data-translate-placeholder="vin-placeholder"
                  placeholder="VIN-код (17 символов)"
                  maxlength="17"
                  spellcheck="false"
                  autocomplete="off"
                />
                <button
                  type="submit"
                  class="callback-submit-btn"
                  data-translate="callbaack-text-header"
                >
                  ПОЛУЧИТЬ РЕКОМЕНДАЦИЮ
                </button>
              </form>
              <p class="cb-last-text" data-translate="cb-last-text">
                Вы можете указать марку и модель авто и оставить Ваши контакты -
                мы вам перезвоним
              </p>
              <p id="responseMessage" class="response-message"></p>
            </div>
          </div>
        </section>
