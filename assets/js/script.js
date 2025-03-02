document.addEventListener("DOMContentLoaded", function () {

  // Маска для телефона 

  [].forEach.call(document.querySelectorAll('input[type=tel]'), function (input) {
    let keyCode;

    function mask(event) {
      // Сохраняем код нажатой клавиши
      event.keyCode && (keyCode = event.keyCode);
      let pos = this.selectionStart;

      // Если курсор в начале, предотвращаем ввод
      if (pos < 3) event.preventDefault();

      let matrix = "+7 (___)-___-__-__",
        i = 0,
        def = matrix.replace(/\D/g, ""), // Удаляем все нецифровые символы из маски
        val = this.value.replace(/\D/g, ""), // Удаляем все нецифровые символы из введенного значения
        new_value = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
        });

      // Определяем позицию первого символа подчеркивания
      i = new_value.indexOf("_");
      if (i != -1) {
        i < 5 && (i = 3); // Если позиция меньше 5, устанавливаем ее на 3
        new_value = new_value.slice(0, i); // Обрезаем строку до этой позиции
      }

      // Регулярное выражение
      let reg = matrix.substr(0, this.value.length).replace(/_+/g, function (a) {
        return "\\d{1," + a.length + "}";
      }).replace(/[+()]/g, "\\$&");

      reg = new RegExp("^" + reg + "$");

      // Проверяем, соответствует ли введенное значение маске
      if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
        this.value = new_value; // Если не соответствует, обновляем значение
      }

      // Если поле теряет фокус и длина значения меньше 18, очищаем поле
      if (event.type == "blur" && this.value.length < 18) {
        this.value = "";
      }
    }

    // Добавляем обработчики событий
    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false);
  });





  // Валидация почты

  const emailInput = document.querySelector('input[name="email"]');

  // Функция для проверки электронной почты
  const validateEmail = () => {
    const email = emailInput.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Проверяет, что строка соответствует общему формату электронной почты

    const parentInputItem = emailInput.closest('.input-item');

    if (!emailPattern.test(email)) {
      parentInputItem?.classList.add('error');
    } else {
      parentInputItem?.classList.remove('error');
    }
  };

  emailInput?.addEventListener('blur', validateEmail);





  // Cелект

  if (document.querySelector(".select")) {
    let selectElements = document.querySelectorAll(".select");

    selectElements.forEach(selectElement => {
      let options = selectElement.querySelectorAll("option");
      let optionsLength = options.length;

      // Скрываем оригинальный select
      selectElement.style.display = "none";

      // Создаем новый контейнер для кастомного select
      let customSelectContainer = document.createElement("div");
      customSelectContainer.className = "select";
      selectElement.parentNode.appendChild(customSelectContainer);
      customSelectContainer.appendChild(selectElement);

      // Создаем элемент для отображения выбранного значения
      let selectedValueDisplay = document.createElement("div");
      selectedValueDisplay.className = "new-select";
      selectedValueDisplay.textContent = selectElement.querySelector("option:disabled").textContent;
      customSelectContainer.appendChild(selectedValueDisplay);

      // Создаем контейнер для списка опций
      let optionsList = document.createElement("div");
      optionsList.className = "new-select__list";
      optionsList.style.height = "0px";
      optionsList.style.transition = "height 300ms, border 300ms";
      optionsList.style.border = "none";
      customSelectContainer.appendChild(optionsList);

      // Добавляем опции в кастомный список
      for (let i = 1; i < optionsLength; i++) {
        let optionItem = document.createElement("div");
        optionItem.className = "new-select__item";

        let optionText = document.createElement("span");
        optionText.textContent = options[i].textContent;
        optionItem.appendChild(optionText);
        optionItem.dataset.value = options[i].value;

        optionsList.appendChild(optionItem);
      }

      // Получаем все элементы опций
      let optionItems = optionsList.querySelectorAll(".new-select__item");

      // Обработчик клика для отображения/скрытия списка опций
      selectedValueDisplay.addEventListener("click", () => {
        if (selectedValueDisplay.classList.contains("on")) {
          selectedValueDisplay.classList.remove("on");
          optionsList.style.height = "0px"; // Скрываем список
          optionsList.style.border = "none";
        } else {
          selectedValueDisplay.classList.add("on");
          optionsList.style.height = `${optionsList.scrollHeight}px`; // Показываем список
          optionsList.style.border = "1px solid var(--accent)";

          // Обработчик клика для выбора опции
          optionItems.forEach(optionItem => {
            optionItem.addEventListener("click", () => {
              let selectedValue = optionItem.dataset.value;
              selectElement.value = selectedValue;
              selectElement.querySelector(`option[value="${selectedValue}"]`).setAttribute("selected", "selected");
              selectedValueDisplay.textContent = optionItem.querySelector("span").textContent;
              optionsList.style.height = "0px"; // Скрываем список
              optionsList.style.border = "none";
              selectedValueDisplay.classList.remove("on");
              selectedValueDisplay.classList.remove("error");
              selectedValueDisplay.classList.add("new-select_checked");
            });
          });
        }
      });

      // Закрытие выпадающего списка при клике вне его
      document.addEventListener("click", event => {
        if (!event.target.closest(".select")) {
          optionsList.style.height = "0px";
          selectedValueDisplay.classList.remove("on");
        }
      });
    });
  }





  //Отправка формы

  const form = document.getElementById('feedback-form');
  const consentCheckbox = form.querySelector('input[name="consent"]');
  const consentLabel = form.querySelector('.form__consent');
  const selectedValueDisplay = document.querySelector('.new-select');
  const popupSuccess = document.querySelector('[data-popup-id="popup-success"]');

  // Обработчик события для изменения состояния чекбокса
  consentCheckbox.addEventListener('change', () => {
    if (consentCheckbox.checked) {
      consentLabel.classList.remove('error');
    } else {
      consentLabel.classList.add('error');
    }
  });

  // Закрытие popup
  if (document.querySelector(".popup")) {
    document.addEventListener("click", function (e) {
      let target = e.target;
      if (
        target.classList.contains("popup-close") ||
        target.classList.contains("popup__inner")
      ) {
        document.querySelectorAll(".popup").forEach((popup) => {
          popup.classList.remove("opened");
        });
        document.body.classList.remove("modal-open");
      }
    });
  }

  form.addEventListener('submit', (event) => {
    let hasError = false;

    // Проверяем, отмечен ли чекбокс
    if (!consentCheckbox.checked) {
      event.preventDefault();
      consentLabel.classList.add('error');
      hasError = true;
    } else {
      consentLabel.classList.remove('error');
    }

    // Проверяем, есть ли класс new-select_checked
    if (!selectedValueDisplay.classList.contains('new-select_checked')) {
      event.preventDefault();
      selectedValueDisplay.classList.add('error');
      hasError = true;
    } else {
      selectedValueDisplay.classList.remove('error');
    }

    if (!hasError) {
      event.preventDefault();
      popupSuccess.classList.add("opened");
      document.body.classList.add("modal-open");


      // Я не использовала сторонние серверы для отправки формы ( без сервера), просто показываю попап, но ниже пример базовой отправки 
      
      // const formData = new FormData(form);

      // fetch(url, {
      //   method: 'POST',
      //   body: formData,
      // })
      //   .then(response => {
      //     if (!response.ok) {
      //       throw new Error('Ошибка сети');
      //     }
      //     return response.text(); // или response.json(), если сервер возвращает JSON
      //   })
      //   .then(data => {
      //     // Если все проверки пройдены, открываем попап
      //     popupSuccess.classList.add("opened");
      //     document.body.classList.add("modal-open");
      //   })
      //   .catch(error => {
      //     console.error('Ошибка:', error);
      //     popupError.classList.add("opened");
      //     document.body.classList.add("modal-open");
      //   });
    }
  });
});
