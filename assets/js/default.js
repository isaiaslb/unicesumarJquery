jQuery.noConflict();

(function ($) {
	$(function () {
		$(document).ready(function () {

			//custom select
			$('.searchable select').select2({
                placeholder: function () {
                    $(this).data('placeholder');
                },
                'language': 'pt-BR'
            });
            $('.notSearchable select').select2({
                minimumResultsForSearch: 'Infinity',
                placeholder: function () {
                    $(this).data('placeholder');
                },
                'language': 'pt-BR'
            });

			$('.fieldPais select').select2({
				minimumResultsForSearch: 'Infinity',
				dropdownParent: $('.fieldPais'),
				dropdownPosition: 'below',
                'language': 'pt-BR'
			});

			//custom select
			//$('.customSelect select').niceSelect();

			//floating form labels
			$('.ffl-wrapper').floatingFormLabels(); //label dos formulários

			//tooltip
			$('.tip').tooltip(); // usa no curso

			//scroll coluna
			var stickyValores = new hcSticky('#valores', {
				stickTo: '.infoCurso',
				top: 80,
				responsive: {
					767: {
						disable: true
					}
				}
			});

			var stickyPolo = new hcSticky('#selecaoPolo', {
				stickTo: '.infoCurso',
				top: 80,
				responsive: {
					767: {
						disable: true
					}
				}
			});

			//scroll inscrição para o formulário a partir do menu lateral
			/*$("a.scrollInscricao").click(function (e) {
				e.preventDefault();
				if ($(window).width() > 767) {
					$("html, body").animate({ scrollTop: $('.fichaInscricao').offset().top - 70 }, 800);
				} else {
					$("html, body").animate({ scrollTop: $('.fichaInscricao').offset().top }, 800);
				}
			});*/

			//slide vídeos
			$('#slideVideos').slick({
				dots: false,
				infinite: false,
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: true,
				fade: false,
				responsive: [
					{
						breakpoint: 480,
						settings: {
							arrows: true,
						}
					}
				]
			});

			/*//bind our event here, it gets the current slide and pauses the video before each slide changes.
			$("#slideVideos").on("beforeChange", function (event, slick) {
				var currentSlide, slideType, player, command;

				//find the current slide element and decide which player API we need to use.
				currentSlide = $(slick.$slider).find(".slick-current");

				//determine which type of slide this, via a class on the slide container. This reads the second class, you could change this to get a data attribute or something similar if you don't want to use classes.
				slideType = currentSlide.attr("class").split(" ")[1];

				//get the iframe inside this slide.
				player = currentSlide.find("iframe").get(0);

				command = {
					"event": "command",
					"func": "pauseVideo"
				};

				//check if the player exists.
				if (player != undefined) {
					//post our command to the iframe.
					player.contentWindow.postMessage(JSON.stringify(command), "*");
				}
			});*/

			$('#galeriaCurso').slick({
				dots: false,
				infinite: false,
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: true,
				fade: false,
				responsive: [
					{
						breakpoint: 768,
						settings: {
							arrows: true,
						}
					}
				]
			});

		});
	});
})(jQuery);