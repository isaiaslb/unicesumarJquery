funcoes = (function ($) {
    return {
        inicializar: function () {
            rota = util.getDadosUrl();

            dados.utm.dsUtmCampaign = util.getURLParametro("utm_campaign");
            dados.utm.dsUtmMedium = util.getURLParametro("utm_medium");
            dados.utm.dsUtmSource = util.getURLParametro("utm_source");
            dados.utm.dsUtmContent = util.getURLParametro("utm_content");
            dados.utm.dsUtmTerm = util.getURLParametro("utm_term");
            dados.utm.dsBoleto = util.getURLParametro("boleto");
            dados.utm.cdGoogleId = util.getCookie("_ga");

            util.aplicarMascaras('#me-ligue-container');
            util.aplicarMascaras('#formBoleto');

            if(dados.utm.dsBoleto){
                $('#modalBoleto').modal('show');
                setTimeout(function(){ $('#cpfBoleto').focus(); }, 500);
            }

            funcoes.criarAccessToken()
                .then(function () {
                    funcoes.criarUserToken().then(function () {

                        //MODAL DO BOLETO
                        if (rota.rotas.length == 2 && rota.rotas[0] == "pagamento" && rota.rotas[1]) {
                            var cpf = util.base64Decode(util.strReverse(rota.rotas[1]) + "=");
                            if (util.validarCpf(cpf)) {
                                $('#cpfBoleto').val(util.formataCpf(cpf)).trigger("change");
                                $('#cpfBoleto').trigger("keyup");
                                $('#formBoleto').submit();
                            }
                            $('#modalBoleto').modal('show');
                        }

                        window.dataLayer.push({
                            'event': 'tokenLoaded',
                            'userToken': dados.userToken
                        });

                        switch (rota.tipo) {
                            case "CURSO":
                                funcoes.preencherMatrizCurricular('#InfoCursoCurriculo, #InfoCursoCurriculoAccordion');

                                if (util.getURLParametro("polo")) {
                                    dados.polo.idPolo = util.getURLParametro("polo");

                                    funcoes.pegarDadosPoloPorId().then(function () {

                                        dados.idPais = dados.polo.cidade.estado.pais.idPais
                                        dados.idEstado = dados.polo.cidade.estado.idEstado;

                                        funcoes.salvarInteressado()
                                            .then(function () {
                                                funcoes.carregarViewValorCurso()
                                                    .then(function () {
                                                        $("#valor-curso-container").effect("bounce", { direction: "up", times: 2, distance: 5 }, 500);
                                                        window.dataLayer.push({ 'ecommerce': undefined });
                                                        window.dataLayer.push({
                                                            'event': 'inscricao-central-de-captacao',
                                                            'step': 'curso',
                                                            'ecommerce': {
                                                                'detail': {
                                                                    'actionField': { 'list': rota.tipo }, //se é: home, nicho ou curso
                                                                    'products': [{
                                                                        'name': jQuery('#InfoCursoNome').text().toUpperCase(), //nome do curso em MAIÚSCULO
                                                                        'id': dados.idCurso,
                                                                        'price': analytics.vlDemaisMensalidades, //formato: #####.##
                                                                        'category': 'central-de-captacao',
                                                                        'dimension7': jQuery('#InfoCursoHabilitacao').text().toUpperCase(), //se é: bacharel, tecnologo, licenciatura, etc
                                                                        'dimension8': jQuery('#InfoCursoTempo').text().toUpperCase(),
                                                                        'dimension9': dados.polo && dados.polo.cidade && dados.polo.cidade.estado ? dados.polo.cidade.estado.sgUF : '', //estado que o usuário escolheu
                                                                        'dimension10': dados.idPolo, //polo que o usuário escolheu
                                                                        'dimension11': analytics.vlPrimeiraMensalidade //formato: #####.##
                                                                    }]
                                                                }
                                                            }
                                                        });
                                                    });
                                                    if(util.isMobile()){
                                                        funcoes.carregarViewStep1Mobile();
                                                    }else{
                                                        funcoes.carregarViewStep1();
                                                    }
                                            });
                                    });

                                } else {
                                    funcoes.carregarViewSelecaoPolo();
                                }
                                break;
                            case "NICHO":
                                $('#btnTrocarArea').removeClass('hidden');
                                funcoes.preencherCursoPorNicho("#cboCurso");
                                funcoes.preencherPais("#cboPais");
                                break;
                            default:
                                funcoes.preencherCurso("#cboCurso");
                                funcoes.preencherPais("#cboPais");
                        }
                    });
                });
        },

        //--------------------------------------------------------------------------------
        //FUNÇÕES PARA CRIAR OS TOKENS
        //--------------------------------------------------------------------------------

        iniciarVideosYoutube: function () {

            util.webpIsSupported(function (webpSuport) {

                var getUrlVideo = function (id) {
                    if (webpSuport) {
                        var url = 'https://img.youtube.com/vi_webp/ID/' + (util.isMobile() ? "0.webp" : "sddefault.webp");
                    } else {
                        var url = 'https://img.youtube.com/vi/ID/' + (util.isMobile() ? "0.jpg" : "sddefault.jpg");
                    }
                    return url.replace("ID", id);
                }

                $(".youtube-player").each(function () {
                    var id = $(this).attr("data-id");
                    $(this).append('<div><img class="img-youtube lazy" src=' + getUrlVideo(id) + '><div class="play"></div></div>');
                }).promise().done(function () {
                    $('.lazy').lazy();
                });
            });
        },

        criarAccessToken: function () {
            return new Promise(function (resolve, reject) {
                servicos.token.criarAccessToken(dados, function (retorno) {
                    dados.accessToken = retorno.access_token;
                    resolve(true);
                });
            });
        },
        criarUserToken: function () {
            return new Promise(function (resolve, reject) {
                servicos.token.criarUserToken(dados, function (retorno) {
                    dados.userToken = retorno.cdToken;
                    //ga('send', 'event', 'status', 'prospecto');
                    resolve(true);
                });
            });
        },

        //--------------------------------------------------------------------------------
        //FUNÇÕES PARA PREENCHER OS COMBOS NAS PÁGINAS
        //--------------------------------------------------------------------------------

        preencherPais: function (seletor) {
            servicos.pais.listarPais(dados, function (retorno) {
                util.criarOptions(seletor, retorno.content, 'idPais', 'nmPais')
                    .then(function () {
                        $(seletor).val(dados.idPais).trigger("change");
                    });
            });
        },
        preencherCurso: function (seletor) {
            servicos.curso.listarPorPais(dados, function (retorno) {
                util.criarOptions(seletor, retorno, 'idCurso', 'nmCurso', true);
            });
        },
        preencherCursoPorNicho: function (seletor) {
            servicos.curso.listarPorPaisNicho(dados, function (retorno) {
                util.criarOptions(seletor, retorno, 'idCurso', 'nmCurso', true);
            });
        },
        preencherEstadoPorPaisECurso: function (seletor) {
            servicos.estado.listarEstadoPorPaisECurso(dados, function (retorno) {
                util.criarOptions(seletor, retorno, 'idEstado', 'nmEstado', true);

                if(dados.idEstado){
                    $(seletor).val(dados.idEstado).trigger("change");
                }

            });
        },
        preencherEstadoPorPais: function (seletor) {
            servicos.estado.listarEstadoPorPais(dados, function (retorno) {
                util.criarOptions(seletor, retorno, 'idEstado', 'nmEstado', true);
            });
        },
        preencherCidade: function (seletor) {
            servicos.cidade.listarCidadePorEstado(dados, function (retorno) {
                util.criarOptions(seletor, retorno, 'idCidade', 'nmCidade', true);
                if (dados.idCidade) {
                    $(seletor).val(dados.idCidade).trigger("change");
                }
            });
        },
        preencherPolo: function (seletor) {
            servicos.polo.listarPoloPorPaisCursoEstado(dados, function (retorno) {
                util.criarOptions(seletor, retorno, 'idPolo', 'nmPolo', true);

                if(dados.polo && dados.polo.idPolo){
                    $(seletor).val(dados.polo.idPolo).trigger("change");
                }
            });
        },
        preencherMatrizCurricular: function (seletor) {
            servicos.curso.listarMatrizCurricular(dados, function (retorno) {
                var html = "";

                retorno.sort(function(a, b){return a.nrSerieIdeal-b.nrSerieIdeal});

                for (var i = 0; i < retorno.length; i++) {
                    html += '<h3>' + retorno[i].nrSerieIdeal + 'º Módulo</h3>';
                    html += '<ul>';
                    for (var j = 0; j < retorno[i].disciplinas.length; j++) {
                        html += '<li>' + retorno[i].disciplinas[j].nmDisciplina + '</li>';
                    }
                    html += '</ul>';
                    $(seletor).html(html);
                }
            });
        },
        preencherCursoPrimeiraHabilitacao: function (seletor) {
            servicos.primeiraHabilitacao.listarCurso(dados, function (retorno) {
                util.criarOptions(seletor, retorno, 'idCursoPrimeiraHabilitacao', 'nmCurso', true);
            });
        },
        preencherDataProva: function (seletor) {
            servicos.polo.listarDataProva(dados, function (retorno) {
                retorno = retorno.map(function (objeto) {
                    return {
                        dtProva: objeto.dtProva,
                        dsProva: util.formataDataBR(objeto.dtProva) + ' - ' + util.diaSemanaPorData(objeto.dtProva)
                    }
                });
                util.criarOptions(seletor, retorno, 'dtProva', 'dsProva', true);
            });
        },
        preencherDataEntrega: function (seletor) {
            servicos.polo.listarDataEntrega(dados, function (retorno) {
                retorno = retorno.map(function (objeto) {
                    return {
                        dtEntrega: objeto.dtEntrega,
                        dsEntrega: util.formataDataBR(objeto.dtEntrega) + ' - ' + util.diaSemanaPorData(objeto.dtEntrega)
                    }
                });
                util.criarOptions(seletor, retorno, 'dtEntrega', 'dsEntrega', true);
            });
        },
        preencherHoraProva: function (seletor) {
            servicos.polo.listarHoraProva(dados, function (retorno) {
                util.criarOptions(seletor, retorno, 'hrProva', 'hrProva', true);
            });
        },
        preencherHoraEntrega: function (seletor) {
            servicos.polo.listarHoraEntrega(dados, function (retorno) {
                util.criarOptions(seletor, retorno, 'hrEntrega', 'hrEntrega', true);
            });
        },
        preencherFormaPagamento: function (seletor) {
            servicos.pagamento.listarFormaPagamento(dados, function (retorno) {
                retorno = retorno.map(util.labelFormaPagamento);
                util.criarOptions(seletor, retorno, 'idFormaPagamento', 'vlParcela', true);
                if (retorno.length == 1) {
                    $(seletor).val(retorno[0].idFormaPagamento).trigger("change");
                }
            });
        },

        //--------------------------------------------------------------------------------
        //FUNÇÕES PARA SALVAR AS INFORMAÇÕES
        //--------------------------------------------------------------------------------

        salvarInteressado: function () {
            return new Promise(function (resolve, reject) {
                servicos.candidato.salvarInteressado(dados, function (retorno) {
                    //ga('send', 'event', 'status', 'interessado');
                    resolve(true);
                });
            });
        },
        salvarPreContato: function () {
            return new Promise(function (resolve, reject) {
                servicos.candidato.salvarPreContato(dados, function (retorno) {
                    resolve(true);
                });
            });
        },
        salvarContato: function () {
            return new Promise(function (resolve, reject) {
                servicos.candidato.salvarContato(dados, function (retorno) {
                    //ga('send', 'event', 'status', 'contato');
                    resolve(true);
                });
            });
        },
        salvarInscrito: function () {
            return new Promise(function (resolve, reject) {
                servicos.candidato.salvarInscrito(dados, function (retorno) {
                    dados.candidato = retorno;
                    if (dados.polo.flAtivoCallCenter) {
                        funcoes.carregarViewStep2();
                    } else {
                        funcoes.carregarViewAgradecimentoInscrito();
                    }

                    resolve(true);
                });
            });
        },
        salvarQualificado: function () {
            return new Promise(function (resolve, reject) {
                servicos.candidato.salvarQualificado(dados, function (retorno) {
                    dados.candidato = retorno;
                    window.dataLayer.push({ 'ecommerce': undefined });
                    window.dataLayer.push({
                        'event': 'inscricao-central-de-captacao',
                        'step': 'dados-basicos-avancar',
                        'ecommerce': {
                            'checkout': {
                                'actionField': { 'step': '2', 'option': dados.tipoIngresso }, //opções: agendar-vestibular, utilizar-nota-do-enem, transferir-ou-voltar-a-estudar, fazer-segunda-graduacao
                                'products': [{
                                    'name': jQuery('#InfoCursoNome').text().toUpperCase(), //nome do curso em MAIÚSCULO
                                    'id': dados.idCurso,
                                    'price': analytics.vlDemaisMensalidades, //formato: #####.##
                                    'category': 'central-de-captacao',
                                    'dimension7': jQuery('#InfoCursoHabilitacao').text().toUpperCase(), //se é: bacharel, tecnologo, licenciatura, etc
                                    'dimension8': jQuery('#InfoCursoTempo').text().toUpperCase(),
                                    'dimension9': dados.polo && dados.polo.cidade && dados.polo.cidade.estado ? dados.polo.cidade.estado.sgUF : '', //estado que o usuário escolheu
                                    'dimension10': dados.idPolo, //polo que o usuário escolheu
                                    'dimension11': analytics.vlPrimeiraMensalidade, //formato: #####.##
                                    'quantity': 1
                                }]
                            }
                        }
                    });

                    funcoes.bloquearInscricao();
                    if (dados.candidato.cdCandidato && dados.candidato.cdConcurso) {
                        funcoes.carregarViewAgradecimento();
                    } else {
                        funcoes.carregarViewAgradecimentoSemCandidato();
                    }



                    resolve(true);
                }, function (jqXHR) {
                    reject(jqXHR.responseJSON);
                });
            });
        },
        salvarBoleto: function (destino) {
            destino = destino || "BOLETO";
            return new Promise(function (resolve, reject) {
                servicos.candidato.salvarBoleto(dados, function (retorno) {
                    $('#cdCandidato').val(dados.candidato.cdCandidato);
                    $('#cdConcurso').val(dados.candidato.cdConcurso);
                    $('#formaPagamento').val(destino);
                    $('#formPagamento').attr("action", "https://sistemasead.unicesumar.edu.br/portal/boleto/boleto.php");
                    $('#formPagamento').submit();
                    //funcoes.encerrarInscricao();
                    resolve(true);
                });
            });
        },
        salvarBoletoModal: function (form, destino) {
            destino = destino || "BOLETO";
            var idFormaPagamento = form.find('.formaPagtoModalBoleto').val() || null;

            form.find('.formaPagamentoModal').val(destino);

            return new Promise(function (resolve, reject) {

                //#TODO: refatorar salvarBoleto para em vez de pegar o dados, pegar o idFormaPagamento
                // servicos.candidato.salvarBoleto(idFormaPagamento, function (retorno) {

                form.attr("action", "https://sistemasead.unicesumar.edu.br/portal/boleto/boleto.php");

                form.submit();

                resolve(true);
                // });

            });
        },
        pegarDadosPoloPorId: function () {
            return new Promise(function (resolve, reject) {
                servicos.polo.pegarDadosPorId(dados, function (retorno) {
                    dados.polo = retorno;
                    resolve(true);
                });
            });
        },
        pegarDadosPorCep: function () {
            return new Promise(function (resolve, reject) {
                servicos.endereco.pegarDadosPorCep(dados, function (retorno) {
                    resolve(retorno);
                });
            });
        },
        pegarDadosCuponagemPorCupom: function (cupom) {
            return new Promise(function (resolve, reject) {
                servicos.cuponagem.pegaDadosPorCupom(cupom, function (retorno) {
                    resolve(retorno);
                }, function () {
                    reject(true);
                });
            });
        },
        bloquearInscricao: function () {
            $('#selecao-curso-container, #form-step-1-container, #form-step-1-container-mobile, #form-step-2-container').html("");
            $('#btn-inscreva-se-container, #selecaoPolo').addClass("hidden");

            if (stickyRefs.valoresSticky) {
                stickyRefs.valoresSticky.update();
            }

            if (stickyRefs.selecaoPoloSticky) {
                stickyRefs.selecaoPoloSticky.update();
            }
        },
        encerrarInscricao: function () {
            dados = {};
        },

        listarBoletoPorCpf: function (cpf) {
            return new Promise(function (resolve, reject) {
                servicos.candidato.listarBoletoPorCpf(cpf, function (retorno) {
                    resolve(retorno);
                });
            });
        },

        //--------------------------------------------------------------------------------
        //FUNÇÕES PARA CARREGAR AS PÁGINAS
        //--------------------------------------------------------------------------------

        carregarViewDadosCurso: function () {

            util.loadPage("#info-curso-container", "./view/info/" + dados.idCurso + ".html?time=" + new Date().getTime())
                .then(function () {
                    //Quando tiver campanha blue-week, cupom-azul, black-week colocar cursos participantes no array e trocar imagem da campanha
                    // var cursosofertados = ["EGRAD_ADSIS","EGRAD_DM","EGRAD_TI","EGRAD_GPUB","EGRAD_HIST","EGRAD_EMEC","EGRAD_GAS","EGRAD_MAT","EGRAD_GCOM","EGRAD_SALI","EGRAD_GH","EGRAD_TINT"];
                    // if($.inArray(dados.idCurso, cursosofertados)!= -1){
                    //     $("#info-curso-banner-campanha").html("<img src='assets/images/bg-pagina-curso-blue-week.jpg' class='hidden-xs'><img src='assets/images/bg-pagina-curso-blue-week-mob.jpg' class='visible-xs'>");
                    // } else {
                    //     $("#info-curso-banner-campanha").html("");
                    // }
                    if (rota.tipo != "CURSO") { //Padrão ou nicho
                        $('#btnTrocaCurso').addClass('hidden');
                        $("#recebamais").addClass('visible-xs');
                        $("#recebamais").removeClass('hidden');
                        util.scrollTo("#info-curso-container");
                        funcoes.carregarViewValorCurso();
                        if (!util.isMobile()) {
                            funcoes.carregarViewStep1();
                        }else {
                            funcoes.carregarViewStep1Mobile();
                        }
                        funcoes.iniciarVideosYoutube();
                    }
                    funcoes.preencherMatrizCurricular('#InfoCursoCurriculo, #InfoCursoCurriculoAccordion');
                    util.slick('#galeriaCurso');
                });

        },
        carregarViewValorCurso: function () {
            return new Promise(function (resolve, reject) {
                if (dados.polo.flAtivoCallCenter) {
                    servicos.curso.listarPrecoPorCursoPolo(dados, function (retorno) {

                        analytics.vlPrimeiraMensalidade = retorno.vlPrimeira;
                        analytics.vlDemaisMensalidades = retorno.vlDemais;

                        util.loadPage("#valor-curso-container", "./view/valor-curso.html?time=" + new Date().getTime())
                            .then(function () {
                                if (rota.tipo == "CURSO") {
                                    $('#btTrocaPolo').removeClass('hidden');
                                }

                                $("#precoPrimeira").html(retorno.cdMoeda + ' ' + util.formatarValor(retorno.vlPrimeira) + '*');
                                $("#precoDemais").html(retorno.cdMoeda + ' ' + util.formatarValor(retorno.vlDemais) + '**');
                                if (retorno.vlDemaisBruto > 0) {
                                    $("#precoDemaisBruto").removeClass('hidden');
                                    $("#msgDescontoDemais").removeClass('hidden');
                                    /*if(retorno.flCursoTodoDescontoDemais){
                                        $("#msgDescontoDemais").html("Até o fim do curso");
                                    }else{
                                        $("#msgDescontoDemais").html("Por " + retorno.nrMesesDescontoDemais + " meses");
                                    }*/
                                    $("#precoDemaisBruto").html(retorno.cdMoeda + ' ' + util.formatarValor(retorno.vlDemaisBruto));
                                }
                                $('#obs-valor-curso-container').removeClass('hidden');

                                $('.oportunidade-desconto-padrao-container').addClass('hidden');
                                $('.oportunidade-desconto-agora-eu-posso-container').addClass('hidden');
                                $('.oportunidade-desconto-chegamos-container').addClass('hidden');
                                $('.oportunidade-desconto-sem-desconto-container').addClass('hidden');
                                $('.oportunidade-desconto-blueweek-container').addClass('hidden');
                                $('.oportunidade-desconto-blackweek50-container').addClass('hidden');
                                $('.oportunidade-desconto-blackweek30-container').addClass('hidden');

                                if (retorno.cdTipo == 'PADRAO') {
                                    $('.oportunidade-desconto-padrao-container').removeClass('hidden');
                                }

                                if (retorno.cdTipo == 'CHEGAMOS') {
                                    $('.oportunidade-desconto-chegamos-container').removeClass('hidden');
                                }

                                if (retorno.cdTipo == 'AGORA_EU_POSSO') {
                                    $('.oportunidade-desconto-agora-eu-posso-container').removeClass('hidden');
                                }

                                if (retorno.cdTipo == 'PADRAO_SEM_DESCONTO') {
                                    $('.oportunidade-desconto-sem-desconto-container').removeClass('hidden');
                                }

                                if (retorno.cdTipo == 'BLUEWEEK') {
                                    $('.oportunidade-desconto-blueweek-container').removeClass('hidden');
                                }

                                if (retorno.cdTipo == 'BLACKWEEK50') {
                                    $('.oportunidade-desconto-blackweek50-container').removeClass('hidden');
                                }

                                if (retorno.cdTipo == 'BLACKWEEK30') {
                                    $('.oportunidade-desconto-blackweek30-container').removeClass('hidden');
                                }

                                stickyRefs.valoresSticky = util.iniciarSticky('#valores');

                                window.dataLayer.push({ 'ecommerce': undefined });
                                window.dataLayer.push({
                                    'event': 'inscricao-central-de-captacao',
                                    'step': 'curso',
                                    'ecommerce': {
                                        'detail': {
                                            'actionField': { 'list': rota.tipo }, //se é: home, nicho ou curso
                                            'products': [{
                                                'name': jQuery('#InfoCursoNome').text().toUpperCase(), //nome do curso em MAIÚSCULO
                                                'id': dados.idCurso,
                                                'price': analytics.vlDemaisMensalidades, //formato: #####.##
                                                'category': 'central-de-captacao',
                                                'dimension7': jQuery('#InfoCursoHabilitacao').text().toUpperCase(), //se é: bacharel, tecnologo, licenciatura, etc
                                                'dimension8': jQuery('#InfoCursoTempo').text().toUpperCase(),
                                                'dimension9': dados.polo && dados.polo.cidade && dados.polo.cidade.estado ? dados.polo.cidade.estado.sgUF : '', //estado que o usuário escolheu
                                                'dimension10': dados.idPolo, //polo que o usuário escolheu
                                                'dimension11': analytics.vlPrimeiraMensalidade //formato: #####.##
                                            }]
                                        }
                                    }
                                });

                                if (util.getURLParametro("cupom")) {
                                    funcoes.pegarDadosCuponagemPorCupom(util.getURLParametro("cupom")).then(function (dados) {
                                        if (dados.cdCupom) {
                                            $('#msgCupomValorCurso').html(dados.cuponagemAcao.dsJustificativa + "****");
                                            $('.oportunidade-desconto-cupom').html("****" + dados.cuponagemAcao.dsRegulamento);
                                            $('#msgCupomValorCurso').removeClass("hidden");
                                        }
                                    });
                                }

                                resolve(true);
                            });
                    });
                } else {
                    util.loadPage("#valor-curso-container", "./view/valor-curso-breve.html")
                        .then(function () {
                            if (rota.tipo == "CURSO") {
                                $('#btTrocaPolo').removeClass('hidden');
                            }
                            stickyRefs.valoresSticky = util.iniciarSticky('#valores');
                            resolve(true);
                        });
                }
            });
        },
        carregarViewSelecaoPolo: function () {
            return new Promise(function (resolve, reject) {
                util.loadPage('#valor-curso-container', './view/selecao-polo.html').then(function () {
                    funcoes.preencherPais('#cboPaisSelecao');
                    funcoes.preencherEstadoPorPaisECurso('#cboEstadoSelecao');
                    dados.selecaoPoloSticky = util.iniciarSticky('#selecaoPolo');
                    resolve(true);
                });
            });
        },
        carregarViewStep1: function () {
            util.loadPage('#form-step-1-container', './view/form-step-1.html')
                .then(function () {
                    util.aplicarMascaras('#form-step-1-container');
                    $("#step1Curso").html($("#InfoCursoNome").html());
                    $("#step1Polo").html(dados.polo.nmPolo);
                    $("#form-step-2-container").html("");

                    /*if (grecaptcha) {
                        grecaptcha.render(
                           document.getElementById('recaptcha'), 
                           {
                             sitekey: '6Le6A2AUAAAAAPEtll6pyMFBuMnLMIOELyj3hj76',
                             callback: funcoes.reCaptchaChecked
                           }
                        );
                    }*/

                    if (util.getURLParametro("formulario")) {
                        util.scrollTo('#form-step-1-container');
                    }
                });
        },
        carregarViewStep1Mobile: function () {
            if(util.isMobile()){
                util.loadPage('#form-step-1-container-mobile-quero-me-inscrever', './view/form-step-1.html')
                .then(function () {
                    util.aplicarMascaras('#form-step-1-container-mobile-quero-me-inscrever');
                    $("#step1Curso").html($("#InfoCursoNome").html());
                    $("#step1Polo").html(dados.polo.nmPolo);
                    $("#form-step-2-container").html("");

                    $("#institucional-container").addClass('hiddenTags');
                    $(".btQueroMeInscrever").removeClass('hiddenTags');
                    // if (grecaptcha) {
                    //     grecaptcha.render(
                    //         document.getElementById('recaptcha'),
                    //         {
                    //             'sitekey': '6Le6A2AUAAAAAPEtll6pyMFBuMnLMIOELyj3hj76',
                    //             'callback': funcoes.reCaptchaChecked,
                    //             'expired-callback': funcoes.onRecaptchaExpired
                    //         }
                    //     );
                    // }
                });
            }else{
                util.loadPage('#form-step-1-container-mobile', './view/form-step-1.html')
                .then(function () {
                    util.aplicarMascaras('#form-step-1-container-mobile');
                    $("#step1Curso").html($("#InfoCursoNome").html());
                    $("#step1Polo").html(dados.polo.nmPolo);
                    $("#form-step-2-container").html("");

                    // if (grecaptcha) {
                    //     grecaptcha.render(
                    //         document.getElementById('recaptcha'),
                    //         {
                    //             'sitekey': '6Le6A2AUAAAAAPEtll6pyMFBuMnLMIOELyj3hj76',
                    //             'callback': funcoes.reCaptchaChecked,
                    //             'expired-callback': funcoes.onRecaptchaExpired
                    //         }
                    //     );
                    // }

                    if (util.getURLParametro("formulario")) {
                        util.scrollTo('#form-step-1-container-mobile');
                    }
                });
            }
            
        },
        carregarViewStep2: function () {
            util.loadPage('#form-step-2-container', './view/form-step-2.html')
                .then(function () {
                    if(util.isMobile()){
                        $('.title2').addClass('hiddenTags');
                        $('.title2mobile').removeClass('hiddenTags');
                        $('.radioIngresso').removeClass('hiddenTags');
                        $('.titleIngresso').addClass('hiddenTags');
                        $('#stepsMobile').removeClass('hiddenTags');
                        $('.documentosInfoMobile').removeClass('hiddenTags');
                        $('.finalCadastro .title').css({
                            'margin-bottom': '10px'
                        });
                        $('.title2mobile').css({
                            'margin-top': '60px',
                            'text-align': 'left'
                        });

                        $('.parte2Mobile').addClass('hiddenTags');
                        /*$('.titleIngresso h4').addClass('hiddenTags');*/
                        // $(".navli a").attr("href", ".documento");
                    }
                    $("#recebamais").removeClass('visible-xs');
                    $("#recebamais").addClass('hidden');
                    util.aplicarMascaras('#form-step-2-container');
                    util.scrollTo('#form-step-2-container');
                    funcoes.preencherEstadoPorPais('#cboEstadoEndereco');
                    funcoes.preencherDataProva('#cboDataProva');
                    funcoes.preencherDataEntrega('#cboDataEntrega');
                    funcoes.preencherCursoPrimeiraHabilitacao('#cboPrimeiraHabilitacao');
                    var endereco = "";
                    endereco += dados.polo && dados.polo.dsEndereco ? dados.polo.dsEndereco + ', ' : '';
                    endereco += dados.polo && dados.polo.nmNumero ? dados.polo.nmNumero + ' ' : '';
                    endereco += dados.polo && dados.polo.dsComplemento ? dados.polo.dsComplemento + ' - ' : ' - ';
                    endereco += dados.polo && dados.polo.nmBairro ? dados.polo.nmBairro + ', ' : '';
                    endereco += dados.polo && dados.cidade && dados.polo.cidade.nmCidade ? dados.polo.dsEndereco + ' - ' : '';
                    endereco += dados.polo && dados.cidade && dados.polo.cidade.estado && dados.polo.cidade.nmEstado ? dados.polo.nmEstado + ', ' : '';
                    endereco += dados.polo && dados.polo.cdCep ? dados.polo.cdCep + ', ' : '';

                    $("#resumoCandidatoNome").html(util.primeiroNome(dados.nmCandidato));
                    $("#resumoCandidatoNome2").html(util.primeiroNome(dados.nmCandidato)); //mobile
                    $("#resumoCandidatoNome3").html(util.primeiroNome(dados.nmCandidato)); //mobile
                    $("#resumoInfoCursoNome").html($("#InfoCursoNome").html());
                    $("#resumoInfoCursoHabilitacao").html($("#InfoCursoHabilitacao").html());
                    $("#resumoInfoCursoTempo").html($("#InfoCursoTempo").html());
                    $("#resumoInfoPolo").html(dados.polo.nmPolo);
                    $('#agradecimentoEndereco-step-2').html(endereco);
                    $("#resumoPrecoPrimeira").html($("#precoPrimeira").html());
                    $("#resumoPrecoDemais").html($("#precoDemais").html());
                    $('#txtDataNascimento').focus();

                    if (util.getURLParametro("cupom")) {
                        $("#txtCupom").val(util.getURLParametro("cupom")).trigger("change");
                    }

                    $('#obs-form-step-2-container').html($('#obs-valor-curso-container').html());

                    window.dataLayer.push({ 'ecommerce': undefined });
                    window.dataLayer.push({
                        'event': 'inscricao-central-de-captacao',
                        'step': 'dados-pessoais',
                        'ecommerce': {
                            'checkout': {
                                'actionField': { 'step': '1' },
                                'products': [{
                                    'name': jQuery('#InfoCursoNome').text().toUpperCase(), //nome do curso em MAIÚSCULO
                                    // 'name': analytics.nmCurso.toUpperCase(), //nome do curso em MAIÚSCULO
                                    'id': dados.idCurso,
                                    'price': analytics.vlDemaisMensalidades, //formato: #####.##
                                    'category': 'central-de-captacao',
                                    'dimension7': jQuery('#InfoCursoHabilitacao').text().toUpperCase(), //se é: bacharel, tecnologo, licenciatura, etc
                                    'dimension8': jQuery('#InfoCursoTempo').text().toUpperCase(),
                                    'dimension9': dados.polo && dados.polo.cidade && dados.polo.cidade.estado ? dados.polo.cidade.estado.sgUF : '', //estado que o usuário escolheu
                                    'dimension10': dados.idPolo, //polo que o usuário escolheu
                                    'dimension11': analytics.vlPrimeiraMensalidade, //formato: #####.##
                                    'quantity': 1
                                }]
                            }
                        }
                    });

                });
        },
        carregarViewAgradecimento: function () {
            util.loadPage('#agradecimento', './view/confirmacao-geral.html').then(function () {
                window.dataLayer.push({ 'ecommerce': undefined });
                window.dataLayer.push({
                    'event': 'inscricao-central-de-captacao',
                    'step': 'prova-agendada',
                    'ecommerce': {
                        'purchase': {
                            'actionField': {
                                'id': dados.userToken, //ID único do agendamento (token)
                                'revenue': analytics.vlDemaisMensalidades, //formato: #####.##
                                'coupon': dados.cdCupom //valor do cupom utilizado nas inscrição 
                            },
                            'products': [{
                                'name': jQuery('#InfoCursoNome').text().toUpperCase(), //nome do curso em MAIÚSCULO
                                'id': dados.idCurso,
                                'price': analytics.vlDemaisMensalidades, //formato: #####.##
                                'category': 'central-de-captacao',
                                'dimension7': jQuery('#InfoCursoHabilitacao').text().toUpperCase(), //se é: bacharel, tecnologo, licenciatura, etc
                                'dimension8': jQuery('#InfoCursoTempo').text().toUpperCase(),
                                'dimension9': dados.polo && dados.polo.cidade && dados.polo.cidade.estado ? dados.polo && dados.polo.cidade && dados.polo.cidade.estado ? dados.polo.cidade.estado.sgUF : '' : '', //estado que o usuário escolheu
                                'dimension10': dados.idPolo, //polo que o usuário escolheu
                                'dimension11': analytics.vlPrimeiraMensalidade, //formato: #####.##
                                'quantity': 1
                            }]
                        }
                    }
                });

                var mensagem = "";
                var documentos = [];

                if (dados.candidato.flBoleto) {
                    funcoes.preencherFormaPagamento("#cboFormaPagamento");
                    $("#pagamento-container").removeClass("hidden");
                }

                if (dados.tipoIngresso == 'VESTIBULAR') {

                    if (dados.candidato.flBoleto) {
                        documentos = [
                            'Cadastro de Pessoa Física (CPF)',
                            'Carteira de Identidade (RG)',
                            'Certidão de Nascimento ou Casamento',
                            'Comprovante de Residência',
                            'Histórico Escolar do Ensino Médio ',
                            'Certificado de Conclusão do Ensino Médio',
                            // 'Documentos do Representante Legal ou Carta de Emancipação*',
                            // 'Registro Nacional de Estrangeiro (RNE)**',
                            // 'Passaporte**',
                            // 'Revalidação Brasileira de Estudos Realizados no Exterior e cópia juramentada dos documentos necessários conforme a lei vigente**',
                            // 'Contrato de Prestação de Serviços Educacionais***'
                        ];

                        mensagem = '<h2>Pronto, <strong>' + util.primeiroNome(dados.nmCandidato) + '</strong>!</h2>';
                        mensagem += '<p>Ao pagar seu boleto, você recebe seu registro acadêmico e se torna aluno da melhor EAD do Brasil.</p>';
                    } else {
                        documentos = [
                            'No dia da prova, leve um documento de identificação com foto.'
                        ];
                        $('#boxDocumentoTitulo').html("<strong>Atenção!</strong>");
                        if (dados.dtProva && dados.hrProva) {
                            $("#agradecimento-data-container").removeClass("hidden");
                            $("#agradecimento-hora-container").removeClass("hidden");
                            $("#agradecimentoData").html(util.formataDataBR(dados.dtProva));
                            $("#agradecimentoHora").html(dados.hrProva);
                            mensagem = '<h2>Ótimo, <strong>' + util.primeiroNome(dados.nmCandidato) + '</strong>! Sua prova foi agendada.</h2>';
                            mensagem += '<p>No dia do vestibular, aproveite e confira os descontos especiais no polo que você escolheu.</p>';
                        }
                    }
                } else {
                    if (dados.dtEntrega && dados.hrEntrega) {
                        $("#agradecimento-data-container").removeClass("hidden");
                        $("#agradecimento-hora-container").removeClass("hidden");
                        $("#agradecimentoData").html(util.formataDataBR(dados.dtEntrega));
                        $("#agradecimentoHora").html(dados.hrEntrega);
                    }

                    if (dados.tipoIngresso == 'ENEM') {
                        documentos = [
                            'Cadastro de Pessoa Física (CPF)',
                            'Carteira de Identidade (RG)',
                            'Certidão de Nascimento ou Casamento ',
                            'Comprovante de Residência',
                            'Histórico Escolar do Ensino Médio ',
                            'Certificado de Conclusão do Ensino Médio',
                            'Boletim do ENEM',
                            //'Documentos do Representante Legal ou Carta de Emancipação*',
                            //'Registro Nacional de Estrangeiro (RNE)**',
                            //'Passaporte**',
                            //'Revalidação Brasileira de Estudos Realizados no Exterior e cópia juramentada dos documentos necessários conforme a lei vigente**',
                            //'Contrato de Prestação de Serviços Educacionais***'
                        ];
                        mensagem = '<h2>Obrigado por decidir continuar sua jornada aqui, <strong>' + util.primeiroNome(dados.nmCandidato) + '</strong>!</h2>';
                        if (dados.candidato.flBoleto) {
                            mensagem += '<p>Ao pagar seu boleto, você recebe seu registro acadêmico e se torna aluno da melhor EAD do Brasil.</p>';
                        }
                    }

                    if (dados.tipoIngresso == 'TRANSFERENCIA') {
                        documentos = [
                            'Cadastro de Pessoa Física (CPF)',
                            'Carteira de Identidade (RG)',
                            'Certidão de Nascimento ou Casamento ',
                            'Comprovante de Residência',
                            'Histórico do curso de origem',
                            'Plano de ensino do curso de origem para aproveitamento de estudos (quando for o caso)',
                            'Histórico Escolar do Ensino Médio',
                            'Certificado de Conclusão do Ensino Médio',
                            //'Documentos do Representante Legal ou Carta de Emancipação *',
                            //'Registro Nacional de Estrangeiro (RNE)**',
                            //'Passaporte**',
                            //'Revalidação Brasileira de Estudos Realizados no Exterior e cópia juramentada dos documentos necessários conforme a lei vigente**',
                            //'Contrato de Prestação de Serviços Educacionais***'
                        ];
                        mensagem = '<h2>Obrigado por decidir continuar sua jornada aqui, <strong>' + util.primeiroNome(dados.nmCandidato) + '</strong>!</h2>';
                        if (dados.candidato.flBoleto) {
                            mensagem += '<p>Ao pagar seu boleto, você recebe seu registro acadêmico e se torna aluno da melhor EAD do Brasil.</p>';
                        }
                    }

                    if (dados.tipoIngresso == '2GRADUACAO') {
                        documentos = [
                            'Cadastro de Pessoa Física (CPF)',
                            'Carteira de Identidade (RG)',
                            'Certidão de Nascimento ou Casamento ',
                            'Comprovante de Residência',
                            'Histórico Escolar de Graduação',
                            'Diploma de Graduação',
                            //'Documentos do Representante Legal ou Carta de Emancipação *',
                            //'Registro Nacional de Estrangeiro (RNE)**',
                            //'Passaporte**',
                            //'Revalidação Brasileira de Estudos Realizados no Exterior e cópia juramentada dos documentos necessários conforme a lei vigente**',
                            //'Contrato de Prestação de Serviços Educacionais***'
                        ];
                        mensagem = '<h2>Obrigado por decidir continuar sua jornada aqui, <strong>' + util.primeiroNome(dados.nmCandidato) + '</strong>!</h2>';
                        if (dados.candidato.flBoleto) {
                            mensagem += '<p>Ao pagar seu boleto, você recebe seu registro acadêmico e se torna aluno da melhor EAD do Brasil.</p>';
                        }
                    }
                }

                var endereco = "";
                endereco += dados.polo && dados.polo.dsEndereco ? dados.polo.dsEndereco + ', ' : '';
                endereco += dados.polo && dados.polo.nmNumero ? dados.polo.nmNumero + ' ' : '';
                endereco += dados.polo && dados.polo.dsComplemento ? dados.polo.dsComplemento + ' - ' : ' - ';
                endereco += dados.polo && dados.polo.nmBairro ? dados.polo.nmBairro + ', ' : '';
                endereco += dados.polo && dados.cidade && dados.polo.cidade.nmCidade ? dados.polo.dsEndereco + ' - ' : '';
                endereco += dados.polo && dados.cidade && dados.polo.cidade.estado && dados.polo.cidade.nmEstado ? dados.polo.nmEstado + ', ' : '';
                endereco += dados.polo && dados.polo.cdCep ? dados.polo.cdCep + ', ' : '';

                $("#agradecimentoCandidato").html(dados.candidato.cdCandidato);
                $("#agradecimentoPolo").html(dados.polo.nmPolo);
                $("#agradecimentoMensagem").html(mensagem);
                $("#agradecintoDocumentos").html("<li>" + documentos.join('</li><li>') + "</li>");
                $("#agradecimentoEndereco").html(endereco);
                util.scrollTo('#agradecimento');
            });
        },
        carregarViewAgradecimentoInscrito: function () {
            util.loadPage('#agradecimento', './view/confirmacao-inscrito.html').then(function () {
                window.dataLayer.push({ 'ecommerce': undefined });
                window.dataLayer.push({
                    'event': 'inscricao-central-de-captacao',
                    'step': 'prova-agendada',
                    'ecommerce': {
                        'purchase': {
                            'actionField': {
                                'id': dados.userToken, //ID único do agendamento (token)
                                'revenue': analytics.vlDemaisMensalidades, //formato: #####.##
                                'coupon': dados.cdCupom //valor do cupom utilizado nas inscrição 
                            },
                            'products': [{
                                'name': jQuery('#InfoCursoNome').text().toUpperCase(), //nome do curso em MAIÚSCULO
                                'id': dados.idCurso,
                                'price': analytics.vlDemaisMensalidades, //formato: #####.##
                                'category': 'central-de-captacao',
                                'dimension7': jQuery('#InfoCursoHabilitacao').text().toUpperCase(), //se é: bacharel, tecnologo, licenciatura, etc
                                'dimension8': jQuery('#InfoCursoTempo').text().toUpperCase(),
                                'dimension9': dados.polo && dados.polo.cidade && dados.polo.cidade.estado ? dados.polo.cidade.estado.sgUF : '', //estado que o usuário escolheu
                                'dimension10': dados.idPolo, //polo que o usuário escolheu
                                'dimension11': analytics.vlPrimeiraMensalidade, //formato: #####.##
                                'quantity': 1
                            }]
                        }
                    }
                });

                $("#agradecimentoNome").html(util.primeiroNome(dados.nmCandidato));
                funcoes.bloquearInscricao();
                funcoes.encerrarInscricao();
                util.scrollTo('#agradecimento');
            });
        },
        carregarViewAgradecimentoSemCandidato: function () {
            window.dataLayer.push({ 'ecommerce': undefined });
            window.dataLayer.push({
                'event': 'inscricao-central-de-captacao',
                'step': 'prova-agendada',
                'ecommerce': {
                    'purchase': {
                        'actionField': {
                            'id': dados.userToken, //ID único do agendamento (token)
                            'revenue': analytics.vlDemaisMensalidades, //formato: #####.##
                            'coupon': dados.cdCupom //valor do cupom utilizado nas inscrição 
                        },
                        'products': [{
                            'name': jQuery('#InfoCursoNome').text().toUpperCase(), //nome do curso em MAIÚSCULO
                            'id': dados.idCurso,
                            'price': analytics.vlDemaisMensalidades, //formato: #####.##
                            'category': 'central-de-captacao',
                            'dimension7': jQuery('#InfoCursoHabilitacao').text().toUpperCase(), //se é: bacharel, tecnologo, licenciatura, etc
                            'dimension8': jQuery('#InfoCursoTempo').text().toUpperCase(),
                            'dimension9': dados.polo && dados.polo.cidade && dados.polo.cidade.estado ? dados.polo.cidade.estado.sgUF : '', //estado que o usuário escolheu
                            'dimension10': dados.idPolo, //polo que o usuário escolheu
                            'dimension11': analytics.vlPrimeiraMensalidade, //formato: #####.##
                            'quantity': 1
                        }]
                    }
                }
            });

            util.loadPage('#agradecimento', './view/confirmacao-sem-candidato.html').then(function () {
                util.scrollTo('#agradecimento');
                $("#agradecimentoNome").html(util.primeiroNome(dados.nmCandidato));
                funcoes.encerrarInscricao();
            });
        },
        habilitarBtnConfirmarInscricao: function () {
            var desabilitar = true;
            var classe = 'disabled';
            if (util.validarCampos('#formInscricao', true) /*&& grecaptcha && grecaptcha.getResponse()*/) {
                desabilitar = false;
                classe = '';
            }
            $('#btnConfirmarInscricao').prop('disabled', desabilitar).removeClass('disabled').addClass(classe);
            if (desabilitar) {
                $('.campos-obrigatorios').removeClass('hidden');
            } else {
                $('.campos-obrigatorios').addClass('hidden');
            }
        },
        habilitarBtnConfirmarQualificacao: function () {
            var desabilitar = true;

            var classe = 'disabled';
            if (util.validarCampos('#formCadastro', true)) {
                desabilitar = false;
                classe = '';
            }
            $('#btnConfirmarQualificacao').prop('disabled', desabilitar).removeClass('disabled').addClass(classe);
            if (desabilitar) {
                $('.campos-obrigatorios-qualificacao').removeClass('hidden');
            } else {
                $('.campos-obrigatorios-qualificacao').addClass('hidden');
            }
        },
        habilitarBtnTrocarPoloSelecao: function () {
            var desabilitar = true;
            var classe = 'disabled';
            if (util.validarCampos('#formPolo', true)) {
                desabilitar = false;
                classe = '';
            }
            $('#btnTrocarPoloSelecao').prop('disabled', desabilitar).removeClass('disabled').addClass(classe);
        },
        habilitarBtnLigue: function () {
            var desabilitar = true;
            var classe = 'disabled';
            if (util.validarCampo('#telmeligue', false)) {
                desabilitar = false;
                classe = '';
            }
            $('#btn-ligue').prop('disabled', desabilitar).removeClass('disabled').addClass(classe);
        },
        habilitarBtnConfirmarChat: function () {
            var desabilitar = true;
            var classe = 'disabled';
            if (util.validarCampos('#formChat', true)) {
                desabilitar = false;
                classe = '';
            }
            $('#btn-chat').prop('disabled', desabilitar).removeClass('disabled').addClass(classe);
        },
        habilitarBtnBoletoBuscarCandidato: function () {
            var desabilitar = true;
            var classe = 'disabled';
            if (util.validarCampos('#formBoleto', true)) {
                desabilitar = false;
                classe = '';
            }
            $('#btnBoletoBuscarCandidato').prop('disabled', desabilitar).removeClass('disabled').addClass(classe);
        },
        habilitarBtnGerarBoletoModal: function (formSeletor) {
            var desabilitar = true;
            var classe = 'disabled';
            if (util.validarCampos(formSeletor, true)) {
                desabilitar = false;
                classe = '';
            }
            $(formSeletor + ' .btBoletoModal').prop('disabled', desabilitar).removeClass('disabled').addClass(classe);
            $(formSeletor + ' .btCartaoModal').prop('disabled', desabilitar).removeClass('disabled').addClass(classe);
        },
        habilitarCarregando: function () {
            $("#modalLoad").modal({
                show: true,
                backdrop: 'static',
                keyboard: false
            });
        },
        desabilitarCarregando: function () {
            $("#modalLoad").modal('hide');
        },
        reCaptchaChecked: function (val) {
            /*CHAMAR BACKEND: http://www.matera.com/blog/post/google-recaptcha-com-java*/
            //NO RETORNO SE FOR TRUE, CONTINUAR A EXECUÇÃO

            if (val) {
                funcoes.habilitarBtnConfirmarInscricao();
            }
        }
    };

}(jQuery));