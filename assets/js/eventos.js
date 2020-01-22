jQuery.noConflict();

(function ($) {

    $(window).on("load", function () {
        funcoes.iniciarVideosYoutube();
        document.getElementById('close').onclick = function () {
            $('#ChatBot').css("display", "none");
        };
    });

    $(document).ready(function () {
        //------------------------------------------------------------------------------------------
        //GERAL: DEFAULT
        //------------------------------------------------------------------------------------------
        $('body').on('change', '#cboDataProva', function(){
            if ($('#cboDataProva option').is(':selected') && $('#cboHoraProva option').is(':selected')) {
                $('.btnAvancarMobile').prop('disabled', false).removeClass('disabled');
            }    
        })

        $('body').on('change', '#cboHoraProva', function(){
            if ($('#cboDataProva option').is(':selected') && $('#cboHoraProva option').is(':selected')) {
                $('.btnAvancarMobile').prop('disabled', false).removeClass('disabled');
            }    
        })        

        $('body').on('click', '.btnAvancarMobile', function(){
            if ($('#radioIngressoUm').is(':checked')) {
                if ($('#cboDataProva option').is(':selected') && $('#cboHoraProva option').is(':selected')) {
                    if (!$('.parte1Mobile').hasClass('hiddenTags')) {
                        $('.parte1Mobile').addClass('hiddenTags');
                        $('.parte2Mobile').removeClass('hiddenTags');
                        $('.title2mobile2').removeClass('hiddenTags');
                        $('.title2mobile').addClass('hiddenTags');
                        $('.title2mobile2').css({
                            'margin-top': '60px',
                            'text-align': 'left'
                        });
                        $('.containerBtnAvancar').append($(".avancarSubmit"));
                        $('.btnAvancarMobile').addClass('hiddenTags');
                    }else{
                        $('.parte1Mobile').removeClass('hiddenTags');
                        $('.parte2Mobile').addClass('hiddenTags');
                    }
                }
            }else if ($('#radioIngressoDois').is(':checked')) {
                if ($('#cboDataEntrega option').is(':selected') && $('#cboHoraEntrega option').is(':selected')) {
                    if (!$('.parte1Mobile').hasClass('hiddenTags')) {
                        $('.parte1Mobile').addClass('hiddenTags');
                        $('.parte2Mobile').removeClass('hiddenTags');
                        $('.title2mobile2').removeClass('hiddenTags');
                        $('.title2mobile').addClass('hiddenTags');
                        $('.title2mobile2').css({
                            'margin-top': '60px',
                            'text-align': 'left'
                        });
                    }else{
                        $('.parte1Mobile').removeClass('hiddenTags');
                        $('.parte2Mobile').addClass('hiddenTags');
                    }
                }
            }else if ($('#radioIngressoTres').is(':checked')) {
                if ($('#cboDataEntrega option').is(':selected') && $('#cboHoraEntrega option').is(':selected')) {
                    if (!$('.parte1Mobile').hasClass('hiddenTags')) {
                        $('.parte1Mobile').addClass('hiddenTags');
                        $('.parte2Mobile').removeClass('hiddenTags');
                        $('.title2mobile2').removeClass('hiddenTags');
                        $('.title2mobile').addClass('hiddenTags');
                        $('.title2mobile2').css({
                            'margin-top': '60px',
                            'text-align': 'left'
                        });
                    }else{
                        $('.parte1Mobile').removeClass('hiddenTags');
                        $('.parte2Mobile').addClass('hiddenTags');
                    }
                }

            }else if ($('#radioIngressoQuatro').is(':checked')) {
                if ($('#cboDataEntrega option').is(':selected') && $('#cboHoraEntrega option').is(':selected')) {
                    if (!$('.parte1Mobile').hasClass('hiddenTags')) {
                        $('.parte1Mobile').addClass('hiddenTags');
                        $('.parte2Mobile').removeClass('hiddenTags');
                        $('.title2mobile2').removeClass('hiddenTags');
                        $('.title2mobile').addClass('hiddenTags');
                        $('.title2mobile2').css({
                            'margin-top': '60px',
                            'text-align': 'left'
                        });
                        setTimeout(function(){
                            util.scrollTo('.title2mobile2')
                                .then(function () {
                                    $('#txtDataNascimento').focus();
                                });
                        }, 500);
                    }else{
                        $('.parte1Mobile').removeClass('hiddenTags');
                        $('.parte2Mobile').addClass('hiddenTags');
                    }
                }

            }
            
        });

        $('#formCadastro input').on('change', function(){
            alert($('input[name=radioFormaIngresso]:checked', '#formCadastro').val());
        });

        if($(window).width() <= 1200 && $(window).width() >= 769){
            $(".topoCaptacao").css('background-size', '150% 100%');
        }else{
            $(".topoCaptacao").css('background-size', 'cover');
        }

        $(window).resize(function(){
            if($(window).width() <= 1200 && $(window).width() >= 769){
                $(".topoCaptacao").css('background-size', '150% 100%');
            }else{
                $(".topoCaptacao").css('background-size', 'cover');
            }
        });


        $('.lazy').lazy();

        $('body').on('click', '.youtube-player', function (e) {
            var iframe = document.createElement("iframe");
            var embed = "https://www.youtube.com/embed/ID?controls=0&autoplay=1&enablejsapi=1&rel=0";
            iframe.setAttribute("src", embed.replace("ID", this.dataset.id));
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allowfullscreen", "1");
            iframe.setAttribute("width", "560");
            iframe.setAttribute("height", "315");
            iframe.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
            $(this).empty().append(iframe)
            command = {
                "event": "command",
                "func": "playVideo"
            };
            if (iframe != undefined) {
                iframe.contentWindow.postMessage(JSON.stringify(command), "*");
            }
        });

        //CHAT BOT
        /*
        setTimeout(function() {
            $("#textoChatBot").fadeOut('slow');
            $("#imgChatBot").css("opacity", '0.4');
        }, 15000);

        $("#ChatBotSub").hover(function(){
            $("#textoChatBot").fadeIn('slow');
            $("#imgChatBot").css("opacity", '1.0');
        }, function() {
            $("#textoChatBot").fadeOut('slow');
            $("#imgChatBot").css("opacity", '0.4');
        });
        */
        // var foo = document.getElementById("textoChatBot");
        // foo.style.visibility = "visible";

        setTimeout(function () {
            //$("#ChatBot").css("display", "block");
            //$("#ChatBot").fadeIn('slow');
            //$("#ChatBot").animate({right: '2px'});
            $("#ChatBot").fadeIn('slow');

            //$("#ChatBot").show("slide", {direction: 'right'}, 5000);
        }, 15000);

        //------------------------------------------------------------------------------------------
        $('a.lkTopico').removeClass("on");

        //custom select
        $('.searchable select').select2({
            placeholder: function () {
                $(this).data('placeholder');
            }
        });
        $('.notSearchable select').select2({
            minimumResultsForSearch: 'Infinity',
            placeholder: function () {
                $(this).data('placeholder');
            }
        });

        $('.fieldPais select').select2({
            minimumResultsForSearch: 'Infinity',
            dropdownParent: $('.fieldPais'),
            dropdownPosition: 'below'
        });
        $('.btOpcoes').on('click', function(e){
            e.preventDefault();
            $(this).toggleClass('act');
            $('.menuOpcoes').toggleClass('open');
        });

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

        //galeria do curso
        $('#galeriaCurso').slick({
            dots: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            fade: false
        });

        //carousel selos
        var rows_var = 2;

        $('.carousel').slick({
            dots: false, //bolinha embaixo do carrosel
            rows: rows_var, //quantidade de linhas
            infinite: true,
            speed: 2000, //velocidade ao passar slide
            slidesToShow: 3, //quantidade de itens na linha
            slidesToScroll: 3, //quantidade de itens que vai "puxar" ao passar de slide
            autoplay: true, //slide automatico
            autoplaySpeed: 8000, //velocidade do slide automatico
            arrows: true, //flechas nas laterais
            responsive: [
                {
                    breakpoint: 768, settings: { // responsivo
                        rows: 2,
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        infinite: true,
                        autoplay: true,
                        autoplaySpeed: 8000,
                        arrows: true,
                        speed: 1000,
                    }
                }
            ]
        });
        $('.carouselCurso').slick({
            dots: false, //bolinha embaixo do carrosel
            rows: rows_var, //quantidade de linhas
            infinite: true,
            speed: 1000, //velocidade ao passar slide
            slidesToShow: 3, //quantidade de itens na linha
            slidesToScroll: 3, //quantidade de itens que vai "puxar" ao passar de slide
            autoplay: false, //slide automatico
            autoplaySpeed: 8000, //velocidade do slide automatico
            arrows: true, //flechas nas laterais
            responsive: [
                {
                    breakpoint: 768, settings: { // responsivo
                        rows: 2,
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        infinite: true,
                        autoplay: false,
                        autoplaySpeed: 8000,
                        arrows: true,
                        speed: 1000,
                    }
                }
            ]
        });
        //------------------------------------------------------------------------------------------

        //slide vídeos
        $('#slideVideos').slick({
            dots: false,
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            fade: false
        });

        $('body').on("beforeChange", "#slideVideos, #galeriaCurso", function (event, slick) {
            var currentSlide, slideType, player, command;
            currentSlide = $(slick.$slider).find(".slick-current");
            slideType = currentSlide.attr("class").split(" ")[1];
            player = currentSlide.find("iframe").get(0);

            command = {
                "event": "command",
                "func": "pauseVideo"
            };
            if (player != undefined) {
                player.contentWindow.postMessage(JSON.stringify(command), "*");
            }
        });

        $('body').on('keypress, keyup', '#telmeligue', function () {
            funcoes.habilitarBtnLigue();
        });

        $('body').on('click', '#btn-ligue', function (e) {
            if (!util.validarCampo('#telmeligue', true)) {
                return false;
            }

            var telefone = $("#telmeligue").val();

            $("#me-ligue-resposta-container").removeClass("hidden");
            $("#me-ligue-container").addClass("hidden");
            servicos.crm.clickToCall(telefone, function () {
            });
        });

        $('body').on('keypress, keyup', '#nomechat', function () {
            funcoes.habilitarBtnConfirmarChat();
        });

        $('body').on('keypress, keyup', '#nomechat', function () {
            util.validarCampo('#nomechat'); //usado só para pintar de vermelho ignorando o retorno true ou false
            funcoes.habilitarBtnConfirmarChat();
        });

        $('body').on('keypress, keyup', '#emailchat', function () {
            util.validarCampo('#emailchat'); //usado só para pintar de vermelho ignorando o retorno true ou false
            funcoes.habilitarBtnConfirmarChat();
        });

        $('body').on('submit', '#formChat', function (e) {
            if (!util.validarCampos('#formChat', true)) {
                e.preventDefault();
                return false;
            }
            $('#formChat').addClass('hidden');
            $('#chat-container').removeClass('hidden');
        });

        $('body').on('click', '#btn-fechar-chat', function (e) {
            $('#formChat').removeClass('hidden');
            $('#chat-container').addClass('hidden');
            $('#chat-container').attr('src', '');
        });

        $('body').on('keypress, keyup', '#cpfBoleto', function () {
            util.validarCampo('#cpfBoleto'); //usado só para pintar de vermelho ignorando o retorno true ou false
            funcoes.habilitarBtnBoletoBuscarCandidato();
        });

        $('body').on('hidden.bs.modal', '#modalBoleto', function (e) {
            $('#listaCandidatosBoleto').html('');
            $('#cpfBoleto').val('');
            $('#btnBoletoBuscarCandidato').addClass('disabled').attr('disabled', true);
        });


        $('body').on('submit', '#formBoleto', function (e) {
            e.preventDefault();

            if (!util.validarCampos('#formBoleto')) {
                funcoes.habilitarBtnBoletoBuscarCandidato();
                return false;
            }

            var cpfBoleto = $('#cpfBoleto').val();
            funcoes.listarBoletoPorCpf(cpfBoleto)
                .then(function (candidatos) {

                    var html = "";
                    if (candidatos.length > 0) {
                        for (var i = 0; i < candidatos.length; i++) {

                            var retorno = candidatos[i].formasPagamento.map(util.labelFormaPagamento);

                            html += '<li class="cardBoleto">\
                                        <form name="formBoletoGerar" class="formBoletoGerar" id="formBoletoGerar_'+ candidatos[i].cdCandidato + '" method="post" action="#" target="_blank">\
                                            <input type="hidden" name="candidato" value="'+ candidatos[i].cdCandidato + '">\
                                            <input type="hidden" name="concurso" value="'+ candidatos[i].cdConcurso + '">\
                                            <input type="hidden" name="tipoPagamento" value="2">\
                                            <input type="hidden" name="formaPagamento" class="formaPagamentoModal" value="BOLETO">\
                                            <input type="hidden" name="captacao" value="1">\
                                            <div class="row">\
                                                <div class="col-xs-12">\
                                                    <p><strong>#' + (i + 1) + '</strong></p>\
                                                </div>\
                                            </div>\
                                            <div class="row">\
                                                <div class="col-xs-12">\
                                                    <p><strong>Candidato:</strong> ' + candidatos[i].cdCandidato + '</p>\
                                                </div>\
                                            </div>\
                                            <div class="row">\
                                                <div class="col-xs-12">\
                                                    <p><strong>Concurso:</strong> ' + candidatos[i].cdConcurso + '</p>\
                                                </div>\
                                            </div>\
                                            <div class="row">\
                                                <div class="col-xs-12">\
                                                    <p><strong>Curso:</strong> ' + candidatos[i].nmCurso + '</p>\
                                                </div>\
                                            </div>\
                                            <div class="row">\
                                                <div class="col-xs-12">\
                                                    <p><strong>Polo:</strong> ' + candidatos[i].nmPolo + '</p>\
                                                </div>\
                                            </div>\
                                            <hr>\
                                            <div class="row">\
                                                <div class="col-xs-12">\
                                                    <p><strong>1ª Mensalidade:</strong></p>\
                                                </div>\
                                            </div>\
                                            <div class="row">\
                                                <div class="col-xs-12">\
                                                    <div class="customSelect notSearchable wrapper-field"><select required class="wide formaPagtoModalBoleto" id="formaPagtoModal_'+ candidatos[i].cdCandidato + '" name="idFormaPagtoModalBoleto_' + candidatos[i].cdCandidato + '" data-placeholder="Condição de pagamento" data-validacao-msg="Condição de pagamento inválida" data-validacao-fn="CondicaoPagamentoModal">' + util.criarOptionsHtml(retorno, 'idFormaPagamento', 'vlParcela', true, true) + '</select></div>\
                                                </div>\
                                            </div>\
                                            <div class="row">\
                                                <div class="col-xs-12">\
                                                    <button type="button" disabled class="btBoleto btBoletoModal disabled" disabled onclick=\'window.dataLayer.push({"event":"clickEvent","eventCategory":"unicesumar:central-de-captacao","eventAction":"reimpressao-emissao-de-boleto:click","eventLabel":"gerar-boleto"});\'>Gerar Boleto</button>\
                                                </div>\
                                            </div>\
                                            <div class="row">\
                                                <div class="col-xs-12">\
                                                    <button type="button" disabled class="btCartao btCartaoModal disabled" disabled onclick=\'window.dataLayer.push({"event":"clickEvent","eventCategory":"unicesumar:central-de-captacao","eventAction":"reimpressao-pagar-cartao:click","eventLabel":"pagar-cartao"});\'>Pagar com Cartão</button>\
                                                </div>\
                                            </div>\
                                        </form>\
                                     </li>';
                        }
                    } else {
                        html += "Nenhum registro encontrado!";
                    }

                    $('#bodyBoleto').css({
                        height: '500px',
                        overflow: 'scroll'
                    });
                    $('#listaCandidatosBoleto').html(html);
                    util.iniciarSelect2();

                    var forms = $('#listaCandidatosBoleto').find('form');
                    $.each(forms, function (index, item) {
                        funcoes.habilitarBtnGerarBoletoModal('#' + item.id);
                    });
                });
        });

        $('body').on('change', '.formaPagtoModalBoleto', function (e) {
            var form = $(this).closest('form.formBoletoGerar');
            var formSeletor = '#' + form[0].id;
            util.validarCampo('#' + $(this)[0].id); //usado só para pintar de vermelho ignorando o retorno true ou false
            funcoes.habilitarBtnGerarBoletoModal(formSeletor);
        });


        $('body').on('click', '.btBoletoModal', function (e) {
            var form = $(this).closest('form.formBoletoGerar');
            funcoes.salvarBoletoModal(form, 'BOLETO');
        });

        $('body').on('click', '.btBoleto', function (e) {
            setTimeout(function(){ $("#cpfBoleto").focus(); }, 500);
        });

        $('body').on('click', '.btCartaoModal', function (e) {
            var form = $(this).closest('form.formBoletoGerar');
            funcoes.salvarBoletoModal(form, 'CARTAO');
        });

        $('body').on('click', '.modalPoliticaLink', function (e) {
            util.loadPage("#modalPoliticaBody", "./view/politica-privacidade.html");
        });

        $('body').on('click', '.modalFormStep2Link', function (e) {
            util.loadPage("#modalFormStep2Body", "./view/form-step-2.html");
        });


        //------------------------------------------------------------------------------------------
        //PADRÃO E NICHO
        //------------------------------------------------------------------------------------------

        $('body').on('click', '#btnInscrevaSe, #btnInscrevaSeMobile-header', function (e) {
            e.preventDefault();

            funcoes.salvarPreContato();

            if(util.isMobile()){
                        funcoes.carregarViewStep1Mobile();
            }
            setTimeout(function(){
                util.scrollTo('.fichaInscricao')
                    .then(function () {
                        $('#txtNome').focus();
                    });
            }, 500);
        });
        $('body').on('click', '#ingressoVestibular', function (e) {
            e.preventDefault();
            if(!util.isMobile()){$('#cboDataProva').focus();}
        });
        $('body').on('click', '#ingressoEnem', function (e) {
            e.preventDefault();
            if(!util.isMobile()){$('#cboDataEntrega').focus();}
        });
        $('body').on('click', '#ingressoTransferencia', function (e) {
            e.preventDefault();
            if(!util.isMobile()){$('#cboDataEntrega').focus();}
        });

        $('body').on('click', '#ingresso2graduacao', function (e) {
            e.preventDefault();
            if(!util.isMobile()){$('#cboDataEntrega').focus();}
        });

        $('body').on('click', 'a.lkTopico',function(e){
            e.preventDefault();
            if($(this).hasClass('on')){
                $(this).removeClass('on').next('.descricao').slideUp(500);
            } else {
                $('a.lkTopico').removeClass("on");
                $('ul#accordion').find('.descricao').slideUp(500);
                $('ul#accordion').find('.descricao1').slideUp(500);
                $(this).addClass('on').next('.descricao').slideDown(500);
            }
        });

        $('body').on('click', '#btnInscrevaSeMobile', function (e) {
            e.preventDefault();
            if(rota.tipo == 'CURSO'){
                util.scrollTo('#selecaoPolo')
                    .then(function () {
                        $('#cboEstadoSelecao').focus();
                    });
            }else{

                funcoes.salvarPreContato();

                util.scrollTo('.fichaInscricao')
                    .then(function () {
                        $('#txtNome').focus();
                    });
            }
        });

        $('body').on('click', '#btnTrocarArea', function (e) {
            e.preventDefault();
            util.scrollTo('#listaNichos');
        });

        $('body').on('change', '#cboPais', function () {
            util.resetCombo('#cboCurso');
            dados.idCurso = null;

            util.resetCombo('#cboEstado');
            dados.idEstado = null;

            util.resetCombo('#cboPolo');
            dados.polo.idPolo = null;

            $('#form-step-1-container, #form-step-1-container-mobile, #form-step-2-container, #info-curso-container').html('');

            if ($(this).val()) {
                dados.idPais = $(this).val();

                if (rota.tipo == 'PADRAO') {
                    funcoes.preencherCurso("#cboCurso");
                } else if (rota.tipo == 'NICHO') {
                    funcoes.preencherCursoPorNicho("#cboCurso");
                }
            }
        });

        $('body').on('change', '#cboCurso', function () {
            util.resetCombo('#cboEstado');
            //dados.idEstado = null;

            util.resetCombo('#cboPolo');
            //dados.polo.idPolo = null;

            $('#form-step-1-container, #form-step-1-container-mobile, #form-step-2-container, #info-curso-container').html('');

            if ($(this).val()) {
                dados.idCurso = $(this).val();
                funcoes.preencherEstadoPorPaisECurso("#cboEstado");
            }
        });

        $('body').on('change', '#cboEstado', function () {
            $('#form-step-1-container, #form-step-1-container-mobile, #form-step-2-container, #info-curso-container').html('');
            util.resetCombo('#cboPolo');
            //dados.polo.idPolo = null;

            if ($(this).val()) {
                dados.idEstado = $(this).val();
                funcoes.preencherPolo("#cboPolo");
            }
        });

        $('body').on('change', '#cboPolo', function () {

            if ($(this).val() && $('#cboCurso').val()) {
                dados.polo.idPolo = $(this).val();

                funcoes.salvarInteressado()
                    .then(function () {
                        funcoes.pegarDadosPoloPorId().then(function () {
                            funcoes.carregarViewDadosCurso();
                        });
                    });

            }
        });

        //------------------------------------------------------------------------------------------
        //CURSO
        //------------------------------------------------------------------------------------------

        $('body').on('change', '#cboPaisSelecao', function () {
            dados.idPais = $(this).val();
            util.resetCombo('#cboEstadoSelecao');
            util.resetCombo('#cboPoloSelecao');

            if (!util.validarCampo('#cboPaisSelecao')) {
                dados.idPais = null;
            }

            funcoes.preencherEstadoPorPaisECurso("#cboEstadoSelecao");
            funcoes.habilitarBtnTrocarPoloSelecao();
        });

        $('body').on('change', '#cboEstadoSelecao', function () {
            dados.idEstado = $(this).val();
            util.resetCombo('#cboPoloSelecao');

            if (!util.validarCampo('#cboEstadoSelecao')) {
                dados.idEstado = null;
            }

            funcoes.preencherPolo("#cboPoloSelecao");
            funcoes.habilitarBtnTrocarPoloSelecao();
        });

        $('body').on('change', '#cboPoloSelecao', function () {
            dados.polo.idPolo = $(this).val();

            if (!util.validarCampo('#cboPoloSelecao')) {
                dados.polo.idPolo = null;
            }

            funcoes.pegarDadosPoloPorId();
            funcoes.habilitarBtnTrocarPoloSelecao();
        });

        $('body').on('click', '#btTrocaPolo', function (e) {
            e.preventDefault();
            funcoes.carregarViewSelecaoPolo().then(function () {
                $("#valor-curso-container").effect("bounce", { direction: "up", times: 2, distance: 5 }, 500);
            });
        });

        $('body').on('submit', '#formPolo', function (e) {
            e.preventDefault();

            if (!util.validarCampos('#formPolo', true)) {
                return false;
            }

            funcoes.salvarInteressado()
                .then(function () {
                    funcoes.pegarDadosPoloPorId()
                        .then(function () {
                            funcoes.carregarViewValorCurso()
                                .then(function () {
                                    $("#valor-curso-container").effect("bounce", { direction: "up", times: 2, distance: 5 }, 500);
                                });
                        });
                });
            if(util.isMobile()){
                funcoes.carregarViewStep1Mobile();

                setTimeout(function(){
                    util.scrollTo('.fichaInscricao')
                        .then(function () {
                            $('#txtNome').focus();
                        });
                }, 500);
            }else{
                funcoes.carregarViewStep1();
            }
        });


        //------------------------------------------------------------------------------------------
        //STEP 1
        //------------------------------------------------------------------------------------------

        $('body').on('change', '#txtNome', function () {
            dados.nmCandidato = $(this).val().trim();

            if (!util.validarCampo('#txtNome')) {
                dados.nmCandidato = null;
            }

            $(this).val(dados.nmCandidato);

            funcoes.habilitarBtnConfirmarInscricao();
        });


        $('body').on('change', '#txtEmail', function () {
            dados.dsEmail = $(this).val().trim();

            if (!util.validarCampo('#txtEmail')) {
                dados.dsEmail = null;
            }

            funcoes.habilitarBtnConfirmarInscricao();
        });

        $('body').on('change', '#txtTelefone', function () {
            dados.nrTelefone = $(this).val().trim();

            if (!util.validarCampo('#txtTelefone')) {
                dados.nrTelefone = null;
            }

            funcoes.habilitarBtnConfirmarInscricao();
        });

        $('body').on('change', '#txtCpf', function () {
            dados.cdCpf = $(this).val().trim();

            if (!util.validarCampo('#txtCpf')) {
                dados.cdCpf = null;
            }

            funcoes.habilitarBtnConfirmarInscricao();
        });

        $('body').on('change', '#chkAceite', function () {
            dados.flAceitePoliticas = $(this).is(':checked');
            funcoes.habilitarBtnConfirmarInscricao();
        });

        $('body').on('change', '#txtNome, #txtEmail, #txtTelefone', function () {
            if (util.validarCampo('#txtNome', true) && (util.validarCampo('#txtEmail', true) || util.validarCampo('#txtTelefone', true))) {
                dados.nmCandidato = $('#txtNome').val().trim() || null;
                dados.dsEmail = $('#txtEmail').val().trim() || null;
                dados.nrTelefone = $('#txtTelefone').val().trim() || null;
                funcoes.salvarContato();
            }
        });

        //#TODO: Colocar Captcha

        $('body').on('submit', '#formInscricao', function (e) {
            e.preventDefault();

            if (!util.validarCampos('#formInscricao', true)) {
                return false;
            }

            if(util.isMobile()){
                $('#modalQueroMeInscrever').modal('toggle');
                $('#selecao-curso-container').addClass('hiddenTags');
                $('#info-curso-container').addClass('hiddenTags');
                $('#selecao-curso-container').addClass('hiddenTags');
                $('.site-footer').addClass('hiddenTags');
                funcoes.salvarInscrito();
            }else{
                funcoes.salvarInscrito();    
            }
        });

        //------------------------------------------------------------------------------------------
        //STEP 2
        //------------------------------------------------------------------------------------------

        $('body').on('change', '#txtDataNascimento', function () {

            dados.dtNascimento = null;

            if (util.validarCampo('#txtDataNascimento')) {
                dados.dtNascimento = util.formataDataBD($('#txtDataNascimento').val() || null);
            }

            funcoes.habilitarBtnConfirmarQualificacao();
        });

        $('body').on('change', '#cboGenero', function () {
            dados.sgGenero = $(this).val();

            if (!util.validarCampo('#cboGenero')) {
                dados.sgGenero = null;
            }

            funcoes.habilitarBtnConfirmarQualificacao();
        });

        $('body').on('change', '#txtCep', function () {
            dados.cdCep = $(this).val();
            $(this).val(dados.cdCep.trim());

            if (!util.validarCampo('#txtCep')) {
                dados.cdCep = null;
            }

            $(".endereco-container").removeClass("hidden");

            if (dados.idPais == 90) {

                $("#txtEndereco").val("").trigger("change");
                $("#txtBairro").val("").trigger("change");
                $('#cboEstadoEndereco').val("").trigger("change");

                funcoes.pegarDadosPorCep().then(function (retorno) {
                    if (retorno && retorno.sgEstado) {
                        if (retorno.idCidade) {
                            dados.idCidade = retorno.idCidade;
                        }
                        if (retorno.dsLogradouroCompleto) {
                            $("#txtEndereco").val(retorno.dsLogradouroCompleto.substring(0,49)).trigger("change");
                        }
                        if (retorno.nmBairro) {
                            $("#txtBairro").val(retorno.nmBairro.substring(0,49)).trigger("change");
                        }
                        if (retorno.idEstado) {
                            dados.idEstadoEndereco = retorno.idEstado;
                            $('#cboEstadoEndereco').val(retorno.idEstado).trigger("change");
                        } else if (retorno.sgEstado) {
                            $("#cboEstadoEndereco > option").each(function () {
                                if (retorno.sgEstado == this.text) {
                                    $('#cboEstadoEndereco').val(this.value).trigger("change");
                                }
                            });
                        }
                        $("#txtNumero").focus();
                    } else {
                        $("#txtEndereco").focus();
                    }
                });
            }

            funcoes.habilitarBtnConfirmarQualificacao();
        });

        $('body').on('change', '#txtEndereco', function () {
            dados.dsEndereco = $(this).val().trim();
            $(this).val(dados.dsEndereco.trim());

            if (!util.validarCampo('#txtEndereco')) {
                dados.dsEndereco = null;
            }

            funcoes.habilitarBtnConfirmarQualificacao();
        });

        $('body').on('change', '#txtNumero', function () {
            dados.dsNumero = $(this).val().trim();
            $(this).val(dados.dsNumero.trim());

            if (!util.validarCampo('#txtNumero')) {
                dados.dsNumero = null;
            }

            funcoes.habilitarBtnConfirmarQualificacao();
        });

        $('body').on('change', '#txtComplemento', function () {
            dados.dsComplemento = $(this).val().trim();
            $(this).val(dados.dsComplemento);
        });

        $('body').on('change', '#cboEstadoEndereco', function () {
            dados.idEstadoEndereco = $(this).val();
            util.resetCombo('#cboCidadeEndereco');

            if (!util.validarCampo('#cboEstadoEndereco')) {
                dados.idEstadoEndereco = null;
            }

            funcoes.preencherCidade("#cboCidadeEndereco");

            funcoes.habilitarBtnConfirmarQualificacao();
        });

        $('body').on('change', '#cboCidadeEndereco', function () {
            dados.idCidadeEndereco = $(this).val();

            if (!util.validarCampo('#cboCidadeEndereco')) {
                dados.idCidadeEndereco = null;
            }

            funcoes.habilitarBtnConfirmarQualificacao();
        });

        $('body').on('change', '#txtBairro', function () {
            dados.dsBairro = $(this).val().trim();
            $(this).val(dados.dsBairro.trim());

            if (!util.validarCampo('#txtBairro')) {
                dados.dsBairro = null;
            }

            funcoes.habilitarBtnConfirmarQualificacao();
        });

        $('body').on('change', '#txtCupom', function () {
            var cupom = $(this).val().trim();

            $('#msg-cupom-step2-container').addClass("hidden");
            $('#msgCupomStep2').removeClass("alert-success");
            $('#msgCupomStep2').removeClass("alert-danger");
            $('#msgCupomStep2').html("");
            $('.oportunidade-desconto-cupom').html("");

            if (cupom) {
                funcoes.pegarDadosCuponagemPorCupom(cupom).then(function (dados) {
                    if (dados.cdCupom) {
                        $('#msg-cupom-step2-container').removeClass("hidden");
                        $('#msgCupomStep2').addClass("alert-success");
                        $('#msgCupomStep2').html(dados.cuponagemAcao.dsJustificativa + "****");
                        $('.oportunidade-desconto-cupom').html("****" + dados.cuponagemAcao.dsRegulamento);
                    }
                }).catch(function () {
                    $('#msg-cupom-step2-container').removeClass("hidden");
                    $('#msgCupomStep2').addClass("alert-danger");
                    $('#msgCupomStep2').html("Cupom não encontrado!");
                });
            }
        });

        $('body').on('change', '#chkConfirmaInformacao', function () {
            dados.flConfirmaInformacao = $(this).is(':checked');
            funcoes.habilitarBtnConfirmarQualificacao();
            if($("#tpingresso").val()==""){
                $('.campos-obrigatorios-qualificacao').html("*Selecione a forma de ingresso.");
                setTimeout(function(){ util.scrollTo('#formCadastro'); }, 1000);

            }else{
                $('.campos-obrigatorios-qualificacao').html("*Verifique se todos os campos estão preenchidos.");
            }
        });

        $('body').on('click', '#ingressoVestibular', function () {
            dados.tipoIngresso = 'VESTIBULAR';
            $("#tpingresso").val('VESTIBULAR');
            $("#tpingresso").removeAttr('required');
            $('.agendamento-vestibular, .agendamento-enem, .agendamento-transferencia, .agendamento-2graduacao, .agendamento-vestibular-realizado').addClass('hidden');
            if (dados.candidato.flAproveitaVestibular) {
                $('.agendamento-vestibular-realizado').removeClass('hidden');
                $('#cboDataProva, #cboHoraProva').prop('required', false);
            } else {
                $('.agendamento-vestibular').removeClass('hidden');
                $('#cboDataProva, #cboHoraProva').prop('required', true);
            }
            
            $('#cboPrimeiraFaculdade, #cboPrimeiraHabilitacao').prop('required', false);
            funcoes.habilitarBtnConfirmarQualificacao();

            //util.scrollTo('#teste');

            if (util.isMobile()) {
                $(".documentoVestibular").append($("#documento"));
                $("#radioIngressoUm").prop('checked', true);
                $("#radioIngressoDois").prop('checked', false);
                $("#radioIngressoTres").prop('checked', false);
                $("#radioIngressoQuatro").prop('checked', false);
            }
        });

        $('body').on('click', '#ingressoEnem', function () {
            dados.tipoIngresso = 'ENEM';
            $("#tpingresso").val('ENEM');
            $("#tpingresso").removeAttr('required');
            $('.agendamento-vestibular, .agendamento-enem, .agendamento-transferencia, .agendamento-2graduacao, .agendamento-vestibular-realizado').addClass('hidden');
            $('.agendamento-enem').removeClass('hidden');

            

            $('#cboDataProva, #cboHoraProva, #cboPrimeiraFaculdade, #cboPrimeiraHabilitacao').prop('required', false);
            funcoes.habilitarBtnConfirmarQualificacao();

            //util.scrollTo('#teste');

            if (util.isMobile()) {
                $(".documentoEnem").append($("#documento"));
                $("#radioIngressoUm").prop('checked', false);
                $("#radioIngressoDois").prop('checked', true);
                $("#radioIngressoTres").prop('checked', false);
                $("#radioIngressoQuatro").prop('checked', false);
            }
        });

        $('body').on('click', '#ingressoTransferencia', function () {
            dados.tipoIngresso = 'TRANSFERENCIA';
            $("#tpingresso").val('TRANSFERENCIA');
            $("#tpingresso").removeAttr('required');

            $('.agendamento-vestibular, .agendamento-enem, .agendamento-transferencia, .agendamento-2graduacao, .agendamento-vestibular-realizado').addClass('hidden');
            $('.agendamento-transferencia').removeClass('hidden');

            

            $('#cboDataProva, #cboHoraProva, #cboPrimeiraFaculdade, #cboPrimeiraHabilitacao').prop('required', false);
            funcoes.habilitarBtnConfirmarQualificacao();
            //util.scrollTo('#teste');

            if (util.isMobile()) {
                $(".documentoTransferencia").append($("#documento"));
                $("#radioIngressoUm").prop('checked', false);
                $("#radioIngressoDois").prop('checked', false);
                $("#radioIngressoTres").prop('checked', true);
                $("#radioIngressoQuatro").prop('checked', false);
            }
        });

        $('body').on('click', '#ingresso2graduacao', function () {
            dados.tipoIngresso = '2GRADUACAO';
            $("#tpingresso").val('2GRADUACAO');
            $("#tpingresso").removeAttr('required');
            $('.agendamento-vestibular, .agendamento-enem, .agendamento-transferencia, .agendamento-2graduacao, .agendamento-vestibular-realizado').addClass('hidden');
            $('.agendamento-2graduacao').removeClass('hidden');
            $('#cboPrimeiraFaculdade').trigger("change");

            

            $('#cboDataProva, #cboHoraProva').prop('required', false);
            $('#cboPrimeiraFaculdade').prop('required', true);

            var habilitacao = $("#InfoCursoHabilitacao").text().toUpperCase();
            if (habilitacao == "LICENCIATURA") {
                $('#divPrimeiraFaculdade').removeClass('hidden');
                $('#cboPrimeiraFaculdade').prop('required', true);
            } else {
                $('#divPrimeiraFaculdade').addClass('hidden');
                $('#cboPrimeiraFaculdade').prop('required', false);
            }
            funcoes.habilitarBtnConfirmarQualificacao();
            //util.scrollTo('#teste');

            if (util.isMobile()) {
                $(".documento2Graduacao").append($("#documento"));
                $("#radioIngressoUm").prop('checked', false);
                $("#radioIngressoDois").prop('checked', false);
                $("#radioIngressoTres").prop('checked', false);
                $("#radioIngressoQuatro").prop('checked', true);
            }
        });

        $('body').on('change', '#cboDataProva', function () {
            dados.dtProva = $(this).val();
            util.resetCombo('#cboHoraProva');
            funcoes.preencherHoraProva("#cboHoraProva");
            funcoes.habilitarBtnConfirmarQualificacao();
        });

        $('body').on('change', '#cboHoraProva', function () {
            dados.hrProva = $(this).val();
            funcoes.habilitarBtnConfirmarQualificacao();
        });

        $('body').on('change', '#cboPrimeiraFaculdade', function () {

            if ($(this).val() == "LICENCIATURA" && dados.idCurso == 'EGRAD_LET') {
                $('#divPrimeiraHabilitacao').removeClass('hidden');
                $('#cboPrimeiraHabilitacao').prop('required', true);
            } else {
                $('#divPrimeiraHabilitacao').addClass('hidden');
                $('#cboPrimeiraHabilitacao').prop('required', false)
            }

            dados.idCursoPrimeiraHabilitacao = $(this).val();
            funcoes.habilitarBtnConfirmarQualificacao();
        });

        $('body').on('change', '#cboPrimeiraHabilitacao', function () {
            dados.cdHabilitacaoPrimeiraGraduacao = $(this).val();
            funcoes.habilitarBtnConfirmarQualificacao();
        });

        $('body').on('change', '#cboDataEntrega', function () {
            dados.dtEntrega = $(this).val();
            funcoes.preencherHoraEntrega("#cboHoraEntrega");
        });

        //#TODO: Corrigir nome dos campos no dados e fazer salvar o qualificado

        $('body').on('submit', '#formCadastro', function (e) {
            e.preventDefault();

            if (!util.validarCampos('#formCadastro', true)) {
                return false;
            }

            dados.dtNascimento = util.formataDataBD($('#txtDataNascimento').val() || null);
            dados.sgGenero = $('#cboGenero').val() || null;
            dados.cdCep = $('#txtCep').val() || null;
            dados.dsEndereco = $('#txtEndereco').val() || null;
            dados.dsNumero = $('#txtNumero').val() || null;
            dados.dsComplemento = $('#txtComplemento').val() || null;
            dados.idCidade = $('#cboCidadeEndereco').val() || null;
            dados.dsBairro = $('#txtBairro').val() || null;
            dados.cdCupom = $('#txtCupom').val() || null;

            dados.dtProva = null;
            dados.hrProva = null;
            dados.dtEntrega = null;
            dados.hrEntrega = null;
            dados.cdHabilitacaoPrimeiraGraduacao = null;
            dados.idCursoPrimeiraHabilitacao = null;

            switch (dados.tipoIngresso) {
                case "VESTIBULAR":
                    dados.dtProva = $('#cboDataProva').val() || null;
                    dados.hrProva = $('#cboHoraProva').val() || null;
                    break;
                case "ENEM":
                case "TRANSFERENCIA":
                    dados.dtEntrega = $('#cboDataEntrega').val() || null;
                    dados.hrEntrega = $('#cboHoraEntrega').val() || null;
                    break;
                case "2GRADUACAO":
                    dados.dtEntrega = $('#cboDataEntrega').val() || null;
                    dados.hrEntrega = $('#cboHoraEntrega').val() || null;
                    dados.cdHabilitacaoPrimeiraGraduacao = $('#cboPrimeiraFaculdade').val() || null;
                    if (dados.cdHabilitacaoPrimeiraGraduacao == "LICENCIATURA") {
                        dados.idCursoPrimeiraHabilitacao = $('#cboPrimeiraHabilitacao').val() || null;
                    }
                    break;

            }

            $('#msg-erro-step2-container').addClass('hidden');


            funcoes.salvarQualificado().catch(function (retorno) {
                $('#msg-erro-step2-container').removeClass('hidden');
                $('#msgErroStep2').html(retorno && retorno.dsErro || "Ops, algo deu errado!");
            });
        });

        //------------------------------------------------------------------------------------------
        //STEP 3 : AGRADECIMENTO
        //------------------------------------------------------------------------------------------

        $('body').on('click', '#btnBoleto', function (e) {
            dados.idFormaPagamento = $('#cboFormaPagamento').val() || null;
            funcoes.salvarBoleto("BOLETO");
        });

        $('body').on('click', '#btnCartao', function (e) {
            dados.idFormaPagamento = $('#cboFormaPagamento').val() || null;
            funcoes.salvarBoleto("CARTAO");
        });

        //------------------------------------------------------------------------------------------

        funcoes.inicializar();
    });
})(jQuery);