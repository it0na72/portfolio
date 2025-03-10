(function ($) {
  var $window = $(window),
    $body = $("body"),
    $wrapper = $("#wrapper"),
    $header = $("#header"),
    $footer = $("#footer"),
    $main = $("#main"),
    $main_articles = $main.children("article");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: ["361px", "480px"],
    xxsmall: [null, "360px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Fix: Flexbox min-height bug on IE.
  if (browser.name == "ie") {
    var flexboxFixTimeoutId;

    $window
      .on("resize.flexbox-fix", function () {
        clearTimeout(flexboxFixTimeoutId);

        flexboxFixTimeoutId = setTimeout(function () {
          if ($wrapper.prop("scrollHeight") > $window.height())
            $wrapper.css("height", "auto");
          else $wrapper.css("height", "100vh");
        }, 250);
      })
      .triggerHandler("resize.flexbox-fix");
  }

  // Nav.
  var $nav = $header.children("nav"),
    $nav_li = $nav.find("li");

  // Add "middle" alignment classes if we're dealing with an even number of items.
  if ($nav_li.length % 2 == 0) {
    $nav.addClass("use-middle");
    $nav_li.eq($nav_li.length / 2).addClass("is-middle");
  }

  // Main.
  var delay = 325,
    locked = false;

  // Methods.
  $main._show = function (id, initial) {
    var $article = $main_articles.filter("#" + id);

    // No such article? Bail.
    if ($article.length == 0) return;

    // Handle lock.

    // Already locked? Speed through "show" steps w/o delays.
    if (locked || (typeof initial != "undefined" && initial === true)) {
      // Mark as switching.
      $body.addClass("is-switching");

      // Mark as visible.
      $body.addClass("is-article-visible");

      // Deactivate all articles (just in case one's already active).
      $main_articles.removeClass("active");

      // Hide header, footer.
      $header.hide();
      $footer.hide();

      // Show main, article.
      $main.show();
      $article.show();

      // Activate article.
      $article.addClass("active");

      // Unlock.
      locked = false;

      // Unmark as switching.
      setTimeout(
        function () {
          $body.removeClass("is-switching");
        },
        initial ? 1000 : 0
      );

      return;
    }

    // Lock.
    locked = true;

    // Article already visible? Just swap articles.
    if ($body.hasClass("is-article-visible")) {
      // Deactivate current article.
      var $currentArticle = $main_articles.filter(".active");

      $currentArticle.removeClass("active");

      // Show article.
      setTimeout(function () {
        // Hide current article.
        $currentArticle.hide();

        // Show article.
        $article.show();

        // Activate article.
        setTimeout(function () {
          $article.addClass("active");

          // Window stuff.
          $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

          // Unlock.
          setTimeout(function () {
            locked = false;
          }, delay);
        }, 25);
      }, delay);
    }

    // Otherwise, handle as normal.
    else {
      // Mark as visible.
      $body.addClass("is-article-visible");

      // Show article.
      setTimeout(function () {
        // Hide header, footer.
        $header.hide();
        $footer.hide();

        // Show main, article.
        $main.show();
        $article.show();

        // Activate article.
        setTimeout(function () {
          $article.addClass("active");

          // Window stuff.
          $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

          // Unlock.
          setTimeout(function () {
            locked = false;
          }, delay);
        }, 25);
      }, delay);
    }
  };

  $main._hide = function (addState) {
    var $article = $main_articles.filter(".active");

    // Article not visible? Bail.
    if (!$body.hasClass("is-article-visible")) return;

    // Add state?
    if (typeof addState != "undefined" && addState === true)
      history.pushState(null, null, "#");

    // Handle lock.

    // Already locked? Speed through "hide" steps w/o delays.
    if (locked) {
      // Mark as switching.
      $body.addClass("is-switching");

      // Deactivate article.
      $article.removeClass("active");

      // Hide article, main.
      $article.hide();
      $main.hide();

      // Show footer, header.
      $footer.show();
      $header.show();

      // Unmark as visible.
      $body.removeClass("is-article-visible");

      // Unlock.
      locked = false;

      // Unmark as switching.
      $body.removeClass("is-switching");

      // Window stuff.
      $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

      return;
    }

    // Lock.
    locked = true;

    // Deactivate article.
    $article.removeClass("active");

    // Hide article.
    setTimeout(function () {
      // Hide article, main.
      $article.hide();
      $main.hide();

      // Show footer, header.
      $footer.show();
      $header.show();

      // Unmark as visible.
      setTimeout(function () {
        $body.removeClass("is-article-visible");

        // Window stuff.
        $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

        // Unlock.
        setTimeout(function () {
          locked = false;
        }, delay);
      }, 25);
    }, delay);
  };

  // Articles.
  $main_articles.each(function () {
    var $this = $(this);

    // Close.
    $('<div class="close">Close</div>')
      .appendTo($this)
      .on("click", function () {
        location.hash = "";
      });

    // Prevent clicks from inside article from bubbling.
    $this.on("click", function (event) {
      event.stopPropagation();
    });
  });

  // Events.
  $body.on("click", function (event) {
    // Article visible? Hide.
    if ($body.hasClass("is-article-visible")) $main._hide(true);
  });

  $window.on("keyup", function (event) {
    switch (event.keyCode) {
      case 27:
        // Article visible? Hide.
        if ($body.hasClass("is-article-visible")) $main._hide(true);

        break;

      default:
        break;
    }
  });

  // language object with translations
  const translations = {
    pt: {
      greeting: "Comékie? Sou o Gio<span class='wave'>👋</span>",
      description: "Tradutor de Japonês e Editor de Vídeo",
      japaneseTranslation: "翻訳家と編集者",
      youtube: "YOUTUBE",
      classes: "AULAS",
      emailMessage: "Alguma dúvida? Manda-me um email",
      developed: "Criado por Giovani Oliveira",
    },
    en: {
      greeting: "Hey! I'm Gio<span class='wave'>👋</span>",
      description: "Japanese Translator and Video Editor",
      japaneseTranslation: "翻訳家と編集者",
      youtube: "YOUTUBE",
      classes: "LESSONS",
      emailMessage: "Any questions? Send me an email",
      developed: "Developed by Giovani Oliveira",
    },
    jp: {
      greeting: "どーも！ジオです<span class='wave'>👋</span>",
      description: "晴耕雨読を望む言語学と読書好きなポルトガル人",
      japaneseTranslation: "翻訳家と編集者",
      youtube: "Youtube",
      classes: "レッスン",
      emailMessage: "お問い合わせはメールでお願いします",
      developed: "開発者: ジオバニ・オリベイラ",
    },
  };

  // function to change language
  function changeLanguage() {
    let currentLang = localStorage.getItem("lang") || "pt";

    // cycle through languages
    let newLang =
      currentLang === "pt" ? "en" : currentLang === "en" ? "jp" : "pt";
    localStorage.setItem("lang", newLang);

    updateLanguage(newLang);
    updateLanguageButton(newLang);
  }

  function updateLanguageButton(lang) {
    const languageButton = document.getElementById("btn");
    const languageIcon = document.getElementById("language-icon");

    const languageTexts = {
      en: "English",
      jp: "日本語",
      pt: "Português",
    };

    // Update icon class
    if (lang === "pt") {
      languageIcon.className = "fa fa-font"; // Portuguese icon
    } else if (lang === "en") {
      languageIcon.className = "fa fa-globe"; // English icon
    } else {
      languageIcon.className = "fa fa-torii-gate"; // Japanese icon
    }

    languageButton.innerHTML = `<i id="language-icon" class="${languageIcon.className}"></i> ${languageTexts[lang]}`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    let storedLang = localStorage.getItem("lang") || "en";
    updateLanguageButton(storedLang);
  });

  function updateLanguage(lang) {
    document.getElementById("greeting").innerHTML =
      translations[lang]["greeting"];

    // restart typewriter effect
    typeWriterEffect("description", translations[lang]["description"]);
    typeWriterEffect(
      "japaneseTranslation",
      translations[lang]["japaneseTranslation"]
    );

    // typewriter effect function with proper reset
    function typeWriterEffect(elementId, text) {
      let element = document.getElementById(elementId);
      element.textContent = ""; // clear existing text
      let i = 0;

      // ensure any previous typing is stopped
      if (element.typewriterTimeout) {
        clearTimeout(element.typewriterTimeout);
      }

      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          element.typewriterTimeout = setTimeout(type, 0); // adjust speed here
        }
      }

      type();
    }

    document.getElementById("youtube").textContent =
      translations[lang]["youtube"];
    document.getElementById("lessons").textContent =
      translations[lang]["classes"];
    document.getElementById("emailMessage").textContent =
      translations[lang]["emailMessage"];
    document.getElementById("developed").textContent =
      translations[lang]["developed"];
  }

  window.changeLanguage = changeLanguage;

  // typewriter Effect Function
  function typeWriterEffect(elementId, text) {
    let element = document.getElementById(elementId);
    element.textContent = ""; // clear existing text
    let i = 0;

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, 0); // adjust speed here
      }
    }

    type();
  }

  // load stored language on page load (WITH typewriter effect)
  document.addEventListener("DOMContentLoaded", () => {
    let storedLang = localStorage.getItem("lang") || "pt";
    updateLanguage(storedLang, true); // enable typewriter effect on first load
  });

  // language switch function (NO typewriter effect when switching)
  function changeLanguage() {
    let currentLang = localStorage.getItem("lang") || "pt";
    let newLang =
      currentLang === "pt" ? "en" : currentLang === "en" ? "jp" : "pt";

    localStorage.setItem("lang", newLang);
    updateLanguage(newLang, false); // no typewriter effect when switching languages
    updateLanguageButton(newLang);
  }

  $window.on("hashchange", function (event) {
    // Empty hash?
    if (location.hash == "" || location.hash == "#") {
      // Prevent default.
      event.preventDefault();
      event.stopPropagation();

      // Hide.
      $main._hide();
    }

    // otherwise, check for a matching article.
    else if ($main_articles.filter(location.hash).length > 0) {
      // prevent default.
      event.preventDefault();
      event.stopPropagation();

      // show article.
      $main._show(location.hash.substr(1));
    }
  });

  // scroll restoration.
  // this prevents the page from scrolling back to the top on a hashchange.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  else {
    var oldScrollPos = 0,
      scrollPos = 0,
      $htmlbody = $("html,body");

    $window
      .on("scroll", function () {
        oldScrollPos = scrollPos;
        scrollPos = $htmlbody.scrollTop();
      })
      .on("hashchange", function () {
        $window.scrollTop(oldScrollPos);
      });
  }

  // hide main, articles.
  $main.hide();
  $main_articles.hide();

  // initial article.
  if (location.hash != "" && location.hash != "#")
    $window.on("load", function () {
      $main._show(location.hash.substr(1), true);
    });
})(jQuery);
