var state;

// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
//                                              FORM HANDLING
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------

const setImports = (serveFrom, elType, attr) => {
  const isDev = serveFrom === "dev";
  $(elType).each((i, el) => {
    let val = $(el).attr(attr);
    if (val && val.indexOf("...") >= 0) {
      $(el).attr(attr, isDev ? val.split("...")[1] : "/impact" + val.split("...")[1])
    }
  })
}

const scrollToBottomResultCard = () => {
  const cardOffset = $("#result-card").offset().top + $("#result-card").outerHeight() - $(window).height() + 50;
  $("html, body").animate({
    scrollTop: cardOffset
  }, 1000, "easeInOutExpo");
  return
}


const twoDigits = n => Number(Number(n).toFixed(2));

const isBottomVisible = _bottomOffset => {
  const bottomOffset = _bottomOffset || 0;
  return $("#result-card").offset().top + $("#result-card").outerHeight() + bottomOffset < ($(window).scrollTop() + $(window).height())
}

const submitCompute = (_values) => {
  $("#result-card").hide();
  $("#details-content").height(0);
  $("#details-banner .arrow-icon").removeClass("open")
  $(".spinner-border").show()
  // const values = _values ? _values : checkForm();
  const values = getValues();
  if (!values) return;

  setDetails(values);
  state.current = values

  setTimeout(() => {
    $(".spinner-border").hide()
    $("#result-card").fadeIn();
    $("#compute-carbon-emitted-title").height(
      $("#compute-carbon-offset-title").height()
    )

    console.log($(window).scrollTop() + $(window).height());

    if ($(window).width() < 769 || !isBottomVisible()) {
      scrollToBottomResultCard()
    }
  }, getRandomInt(500, 1200)
  )
}


const setRegions = provider => {
  if (provider === "custom") {
    $("#compute-region-div").fadeOut(() => {
      $(".custom-hidable").fadeIn()
    })
  } else {
    if (!$("#compute-region-div").is(":visible")) {
      $(".custom-hidable").fadeOut(() => {
        $("#compute-region-div").fadeIn();
      })
    }
    $("#compute-region").html('');
    let regs = [];
    for (const region in state.providers[provider]) {
      if (state.providers[provider].hasOwnProperty(region) && region !== "__min") {
        let { regionName } = state.providers[provider][region];
        if (!regionName) {
          regionName = region;
        }
        regs.push({ region, regionName })
      }
    }
    regs.sort((a, b) => (
      a.regionName > b.regionName) ? 1 : ((b.regionName > a.regionName) ? -1 : 0)
    );
    for (const reg of regs) {
      const { regionName, region } = reg;
      $("#compute-region").append(`<option value="${region}">${regionName}</option>`)
    }
  }
}


(async function ($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 70)
        }, 1000, "easeInOutExpo");
        let w = window.location.pathname;
        if (w[w.length - 1] !== "/") w += "/"
        window.history.pushState('', '', w + this.hash);
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function () {
    $('.navbar-collapse').collapse('hide');
  });

  // lazy load resources as images and iframes
  const observer = lozad();
  observer.observe();

  // Collapse Navbar
  var navbarCollapse = function () {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);



  state = await getData();
  $("#compute-loader").fadeOut(() => {
    $("#compute-container").fadeIn()
  })

  setInputs();
  setImports(serveFrom, "a", "href");
  setImports(serveFrom, "img", "src");

  $(".details-summary").each((i, el) => {

    if (i % 2 == 0 || $(window).width() < 770) {
      const arrowTemplate = `
      <a class="arrow-icon arrow-learn-even" title="Learn more">
      <span class="left-bar"></span>
      <span class="right-bar"></span>
      </a>
      `
      $(el).append($(arrowTemplate))
    } else {
      const arrowTemplate = `
      <a class="arrow-icon arrow-learn-odd" title="Learn more">
      <span class="left-bar"></span>
      <span class="right-bar"></span>
      </a>
      `
      $(el).css("justify-content", "flex-end");
      $(el).prepend($(arrowTemplate))
    }
  });

  growDivOnArrowClickLearn(`.details-summary`, `.summary-content`);
  growDivOnArrowClick("#details-banner", "#details-content");

  $("#copy-template-btn").click(() => {
    selectAndCopyText("template-code");
    $("#copy-template-feedback").fadeIn(() => {
      setTimeout(
        () => {
          $("#copy-template-feedback").fadeOut()
        }, 1000);
    })
  })


})(jQuery); // End of use strict
