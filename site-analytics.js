(function () {
  "use strict";

  var config = window.BULKPORT_ANALYTICS || {};

  if (config.provider !== "ga4") {
    return;
  }

  var measurementId = (config.ga4MeasurementId || "").trim();

  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) {
    return;
  }

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  window.gtag = window.gtag || gtag;

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", measurementId, {
    send_page_view: true
  });

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");

    if (!link) {
      return;
    }

    var href = link.getAttribute("href") || "";

    if (!href || href.charAt(0) === "#") {
      return;
    }

    var url;

    try {
      url = new URL(href, window.location.href);
    } catch (error) {
      return;
    }

    if (url.origin === window.location.origin) {
      return;
    }

    gtag("event", "click", {
      event_category: "outbound",
      event_label: url.href,
      transport_type: "beacon"
    });
  }, { passive: true });

  document.addEventListener("submit", function (event) {
    var form = event.target;

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    gtag("event", "generate_lead", {
      form_id: form.id || "",
      form_action: form.getAttribute("action") || "",
      transport_type: "beacon"
    });
  });
})();
