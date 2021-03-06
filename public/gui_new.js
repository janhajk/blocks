/*global $*/
var APP;
(APP = new(APP = function() {
      this.ASSETS_PATH = "./assets/", this.SERVER_PATH = this.ASSETS_PATH + "demo/server/", this.is_touch_device = function() {
            return !!("ontouchstart" in window) || !!("onmsgesturechange" in window)
      }
})).UI = {
            scrollTop: 0
      }, $(window).on("load", function() {
            setTimeout(function() {
                  $(".preloader-backdrop").fadeOut(200), $("body").addClass("has-animation")
            }, 0)
      }),
      $(window).on("load resize scroll", function() {
            $(this).width() < 992 && $("body").addClass("sidebar-mini")
      }),
      $(function() {
            function e(o) {
                  27 == o.which && ($("body").removeClass("fullscreen-mode"),
                        $(".ibox-fullscreen").removeClass("ibox-fullscreen"), $(window).off("keydown", e))
            }
            $(".metismenu").metisMenu(), $('[data-toggle="tooltip"]').tooltip(), $('[data-toggle="popover"]').popover(),
                  $(".scroller").each(function() {
                        $(this).slimScroll({
                              height: $(this).attr("data-height"),
                              color: $(this).attr("data-color"),
                              railOpacity: "0.9"
                        })
                  }),
                  $(".theme-config-toggle").on("click", function() {
                        $(this).parents(".theme-config").toggleClass("opened")
                  }),
                  $(".js-sidebar-toggler").click(function() {
                        $("body").toggleClass("sidebar-mini")
                  }),
                  $("#_fixedlayout").change(function() {
                        $(this).is(":checked") ? ($("body").addClass("fixed-layout"),
                              $("#sidebar-collapse").slimScroll({
                                    height: "100%",
                                    railOpacity: "0.9"
                              })) : ($("#sidebar-collapse").slimScroll({
                              destroy: !0
                        }).css({
                              overflow: "visible",
                              height: "auto"
                        }), $("body").removeClass("fixed-layout"))
                  }),
                  $("#_fixedNavbar").change(function() {
                        $(this).is(":checked") ? $("body").addClass("fixed-navbar") : $("body").removeClass("fixed-navbar")
                  }),
                  $("[name='layout-style']").change(function() {
                        +$(this).val() ? $("body").addClass("boxed-layout") : $("body").removeClass("boxed-layout")
                  }),
                  $(".color-skin-box input:radio").change(function() {
                        var e = $(this).val();
                        "default" != e ? $("#theme-style").length ? $("#theme-style").attr("href", "assets/css/themes/" + e + ".css") : $("head").append("<link href='assets/css/themes/" + e + ".css' rel='stylesheet' id='theme-style' >") : $("#theme-style").remove()
                  }),
                  $(window).scroll(function() {
                        $(this).scrollTop() > APP.UI.scrollTop ? $(".to-top").fadeIn() : $(".to-top").fadeOut()
                  }),
                  $(".to-top").click(function(e) {
                        $("html, body").animate({
                              scrollTop: 0
                        }, 500)
                  }),
                  $(".ibox-collapse").click(function() {
                        $(this).closest("div.ibox").toggleClass("collapsed-mode").children(".ibox-body").slideToggle(200)
                  }),
                  $(".ibox-remove").click(function() {
                        $(this).closest("div.ibox").remove()
                  }),
                  $(".fullscreen-link").click(function() {
                        $("body").hasClass("fullscreen-mode") ? ($("body").removeClass("fullscreen-mode"), $(this).closest("div.ibox").removeClass("ibox-fullscreen"),
                              $(window).off("keydown", e)) : ($("body").addClass("fullscreen-mode"), $(this).closest("div.ibox").addClass("ibox-fullscreen"),
                              $(window).on("keydown", e))
                  }), $.fn.backdrop = function() {
                        return $(this).toggleClass("shined"), $("body").toggleClass("has-backdrop"), $(this)
                  }, $(".backdrop").click(function() {
                        $("body").removeClass("has-backdrop"), $(".shined").removeClass("shined")
                  })
      }),
      $(function() {
            $.fn.timepicker && ($.fn.timepicker.defaults = $.extend(!0, {}, $.fn.timepicker.defaults, {
                  icons: {
                        up: "fa fa-angle-up",
                        down: "fa fa-angle-down"
                  }
            }))
      });
