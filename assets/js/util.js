util = (function ($) {
    return {
        criarOptions: function (objeto, itens, itemValor, itemDescricao, placeholder) {
            return new Promise(function (resolve, reject) {
                var html = util.criarOptionsHtml(itens, itemValor, itemDescricao, placeholder);

                $(objeto)
                    .html(html)
                    .prop('disabled', false);

                resolve(true);
            });
        },
        criarOptionsHtml: function (itens, itemValor, itemDescricao, placeholder, defaultSelected) {
            defaultSelected = defaultSelected || false;

            var html = "";

            if (placeholder) {
                html += util.criarOptionVazio();
            }

            var selected = '';
            if (defaultSelected && itens.length == 1) {
                selected = 'selected ';
            }

            $.each(itens, function (indice, valor) {
                html += '<option ' + selected + 'value="' + itens[indice][itemValor] + '">' + itens[indice][itemDescricao] + '</option>';
            });

            return html;
        },
        resetCombo: function (seletor) {
            $(seletor).html(util.criarOptionVazio()).prop('disabled', true);
        },
        criarOptionVazio: function () {
            return "<option></option>";
        },
        scrollTo: function (seletor) {
            return new Promise(function (resolve, reject) {
                var offset = 0;
                if ($(window).width() > 767) {
                    offset = 70;
                } else if ($(window).width() < 767) {
                    offset = 60;
                }

                $("html, body").animate(
                    { scrollTop: $(seletor).offset().top - offset },
                    { duration: 800, complete: function () { resolve(true) } }
                );
            });
        },
        iniciarSelect2: function () {
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
        },
        slick: function (seletor) {
            $(seletor).slick({
                dots: false,
                infinite: true,
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
        },
        getDadosUrl: function () {
            var path = window.location.pathname;
            var retorno = {
                tipo: "PADRAO",
                rotas: [],
                parametros: [],
            };
            var urls = [
                { url: /^\/curso\/([a-zA-Z0-9-.]+)(\/)?$/, tipo: 'CURSO' },
                //{ url: /^\/curso\/([a-zA-Z0-9-.]+)\/([a-zA-Z0-9-.]+)(\/)?$/, tipo: 'CURSO' },
                { url: /^\/area\/([a-zA-Z0-9-.]+)(\/)?$/, tipo: 'NICHO' },
                { url: /^\/(.+)\/(.+)$/, tipo: 'PADRAO' }
            ];

            for (var i = 0; i < urls.length; i++) {
                var resultado = path.match(urls[i].url);
                if (resultado) {
                    retorno = {
                        tipo: urls[i].tipo,
                        rotas: resultado.splice(1, resultado.length)
                    };
                    break;
                }
            }

            return retorno;
        },
        getURLParametro: function (sParam) {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam) {
                    return sParameterName[1];
                }
            }
            return null;
        },
        loadPage: function (seletor, urlPage) {

            return new Promise(function (resolve, reject) {
                $.get(urlPage, function (data) {
                    $(seletor).html(data);
                    $('.ffl-wrapper').floatingFormLabels();
                    $('.tip').tooltip();
                    util.iniciarSelect2();

                    if (stickyRefs.valoresSticky) {
                        stickyRefs.valoresSticky.update();
                    }

                    if (stickyRefs.selecaoPoloSticky) {
                        stickyRefs.selecaoPoloSticky.update();
                    }

                    resolve(true);
                });
            });
        },
        iniciarSticky: function (seletor) {
            retorno = null;
            if ($(seletor).length) {
                retorno = new hcSticky(seletor, {
                    stickTo: '.infoCurso',
                    top: 80,
                    responsive: {
                        767: {
                            disable: true
                        }
                    }
                });
            }
            return retorno;
        },
        aplicarMascaras: function (seletorAncora) {
            var nonoDigito = function (val) {
                return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
            };
            nonoDigitoOptions = {
                onKeyPress: function (val, e, field, options) {
                    field.mask(nonoDigito.apply({}, arguments), options);
                }
            };

            $(seletorAncora).find('input.data').mask("00/00/0000");

            switch (dados.idPais) {
                case '3':
                    $(seletorAncora).find('input.telefone').mask('+9 999-999-9999');
                    break;
                case '40':
                    $(seletorAncora).find('input.telefone').mask('+99999999999');
                    break;
                case '429':
                    $(seletorAncora).find('input.telefone').mask('+999 99-999-9999');
                    break;
                default:
                    $(seletorAncora).find('input.telefone').mask(nonoDigito, nonoDigitoOptions);
                    break;
            }

            $(seletorAncora).find('input.valor, div.valor span, div.valorimovel span').mask('#.##0,00', { reverse: true });
            $(seletorAncora).find('input.estado').mask('AA');

            if (dados.idPais != 90) {
                $(seletorAncora).find('input.cep').unmask();
            } else {
                $(seletorAncora).find('input.cep').mask('00000-000');
            }

            $(seletorAncora).find('input.cpf').mask('000.000.000-00');

            $(seletorAncora).find('input.numero').mask('0#');
        },
        validarCampos: function (seletorForm, modoSilencioso, detalharErros) {
            modoSilencioso = modoSilencioso || false
            detalharErros = detalharErros || false
            /*
                modoSilencioso = false: Já coloca a borda no elemento input sendo validado e adiciona o title com a mensagem de erro
                modoSilencioso = true: valida, mas omite as informações e retorna o resultado da validação

                detalharErros = false: no array campos, basta uma ocorrência para que o retorno seja false
                detalharErros = true: retornado um objeto com os campos inválidos ou array vazio [] se não hover validação
            */

            //identificar checkbox ou radio e buscar o :checked e .val()
            var campos = $(seletorForm + ' input[required], ' + seletorForm + ' textarea[required], ' + seletorForm + ' select[required]');
            var erros = new Array();
            $.each(campos, function (index, item) {
                var itemSeletor = seletorForm + ' [name="' + item.name + '"]';

                if (!util.validarCampo(itemSeletor, modoSilencioso)) {
                    erros.push({
                        seletor: itemSeletor,
                        msg: $(item).data('validacao-msg')
                    });
                }
            });

            if (detalharErros) {
                return erros;
            }

            return (erros.length === 0);
        },
        validarCampo: function (seletor, modoSilencioso) {
            modoSilencioso = modoSilencioso || false;
            var valido;
            var elemento = $(seletor);

            if (!elemento.length) {
                return false;
            }

            var valor;
            switch (elemento.attr('type')) {
                case 'checkbox':
                    valor = elemento.is(':checked');
                    break;
                case 'radio':
                    valor = elemento.is(':checked');
                    break;
                default:
                    valor = elemento.val();
                    break;
            }

            var fnValidar = 'validar' + $(elemento).data('validacao-fn');
            var msg = elemento.data('validacao-msg');

            if (typeof util[fnValidar] === 'undefined') {
                console.log('Função ' + fnValidar + 'não definida!');
                return false;
            }

            valido = util[fnValidar](valor);

            var wrapper = elemento.closest('.wrapper-field');

            if (!modoSilencioso && wrapper.length) {

                if (!valido) {
                    wrapper.addClass('invalido').attr('title', msg);
                } else {
                    wrapper.removeClass('invalido').removeAttr('title');
                }
            }

            return valido;
        },
        validarTextoEmpty: function (str) {
            return (str.trim().length > 0);
        },
        validarNome: function (str) {
            return util.validarTextoEmpty(str);
        },
        validarEmail: function (str) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(str).toLowerCase());
        },
        validarTelefone: function (str) {
            str = str.replace(/\D+/g, '');
            var retorno = false
            switch (dados.idPais) {
                case '3':
                    retorno = (str.trim().length == 11);
                    break;
                case '429':
                    retorno = (str.trim().length == 12);
                    break;
                default:
                    retorno = (str.trim().length == 10 || str.trim().length == 11);
                    break;
            }

            return retorno;
            // var re = /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/;
            // return re.test(String(str));
        },
        validarCpf: function (str) {
            if (dados.idPais != 90) {
                return (str.trim().length > 0 && str.trim().length <= 50);
            }

            var strCPF = str.replace(/\D+/g, '');
            var Soma = 0;
            var Resto;

            if (strCPF == "00000000000") {
                return false;
            }

            for (i = 1; i <= 9; i++) {
                Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
            }

            Resto = (Soma * 10) % 11;

            if ((Resto == 10) || (Resto == 11)) {
                Resto = 0;
            }

            if (Resto != parseInt(strCPF.substring(9, 10))) {
                return false;
            }

            Soma = 0;
            for (i = 1; i <= 10; i++) {
                Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
            }

            Resto = (Soma * 10) % 11;

            if ((Resto == 10) || (Resto == 11)) {
                Resto = 0;
            }

            if (Resto != parseInt(strCPF.substring(10, 11))) {
                return false;
            }

            return true;
        },
        validarAceitePoliticas: function (valor) {
            return util.validarCheckboxMarcada(valor);
        },
        validarCheckboxMarcada: function (valor) {
            return valor === true;
        },
        validarComboPreenchida: function (str) {
            return (str && str != '') === true;
        },
        validarData: function (str) {
            var dateformat = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/;

            if (!str.match(dateformat)) {
                return false;
            }

            var pdate = str.split('/');

            var dd = parseInt(pdate[0]);
            var mm = parseInt(pdate[1]);
            var yy = parseInt(pdate[2]);

            // Create list of days of a month [assume there is no leap year by default]
            var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (mm == 1 || mm > 2) {
                if (dd > ListofDays[mm - 1]) {
                    return false;
                }
            }

            if (mm == 2) {
                var lyear = false;
                if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
                    lyear = true;
                }
                if ((lyear == false) && (dd >= 29)) {
                    return false;
                }
                if ((lyear == true) && (dd > 29)) {
                    return false;
                }
            }

            return true;
        },
        validarGenero: function (str) {
            return str === 'M' || str === 'F'
        },
        validarCep: function (str) {
            var re = /^\d{5}-\d{3}$/;

            switch (dados.idPais) {
                case '3':
                case '40':
                    retorno = (str.trim().length > 0);
                case '429':
                case '40':
                    retorno = (str.trim().length > 0);
                    break;
                default:
                    retorno = re.test(str);
                    break;
            }

            return retorno;
        },
        validarEndereco: function (str) {
            return util.validarTextoEmpty(str);
        },
        validarNumeroEndereco: function (str) {
            return util.validarTextoEmpty(str);
        },
        validarEstadoEndereco: function (str) {
            return util.validarComboPreenchida(str);
        },
        validarCidadeEndereco: function (str) {
            return util.validarComboPreenchida(str);
        },
        validarBairroEndereco: function (str) {
            return util.validarTextoEmpty(str);
        },
        validarDeclaracaoVerdadeira: function (valor) {
            return util.validarCheckboxMarcada(valor);
        },
        validarDataProvaSelecionada: function (str) {
            return util.validarComboPreenchida(str);
        },
        validarHoraProvaSelecionado: function (str) {
            return util.validarComboPreenchida(str);
        },
        validarPrimeiraFaculdadeSelecionada: function (str) {
            return util.validarComboPreenchida(str);
        },
        validarPrimeiraHabilitacaoSelecionada: function (str) {
            return util.validarComboPreenchida(str);
        },
        validarPaisSelecao: function (str) {
            return util.validarComboPreenchida(str);
        },
        validarEstadoSelecao: function (str) {
            return util.validarComboPreenchida(str);
        },
        validarPoloSelecao: function (str) {
            return util.validarComboPreenchida(str);
        },
        validarCondicaoPagamentoModal: function (str) {
            return util.validarComboPreenchida(str);
        },
        formataDataBD: function (str) {
            if (str) {
                var math = str.match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/);
                if (math && math.length == 4) {
                    return math[3] + "-" + math[2] + "-" + math[1];
                }
            }
            return null;
        },
        formataDataBR: function (str) {
            if (str) {
                var math = str.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/);
                if (math && math.length == 4) {
                    return math[3] + "/" + math[2] + "/" + math[1];
                }
            }
            return null;
        },
        formataCpf: function (str) {
            if (str) {
                var math = str.match(/^([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})$/);
                if (math) {
                    return math[1] + "." + math[2] + "." + math[3] + "-" + math[4];
                }
            }
            return str;
        },
        diaSemanaPorData: function (data) {
            var diaSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
            var math = data.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/);
            if (math && math.length == 4) {
                return diaSemana[(new Date(parseInt(math[1]), parseInt(math[2]) - 1, parseInt(math[3]))).getDay()];
            }
            return null;
        },
        formatarValor: function (valor) {
            return parseFloat(valor).toFixed(2).replace(".", ",");
        },
        primeiroNome: function (str) {
            if (str) {
                var arr = str.split(' ');
                if (arr.length > 0) {
                    return arr[0];
                }
            }
            return str;
        },
        getCookie: function (cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },
        labelFormaPagamento: function (objeto) {
            return {
                idFormaPagamento: objeto.idFormaPagamento,
                //vlParcela: (parseInt(objeto.nrParcela) - 1) + ' x de ' + util.formatarValor(objeto.vlParcela)
                vlParcela: 'R$ ' + util.formatarValor(objeto.vlParcela)
            }
        },
        base64Decode: function (s) {
            var e = {}, i, b = 0, c, x, l = 0, a, r = '', w = String.fromCharCode, L = s.length;
            var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for (i = 0; i < 64; i++) { e[A.charAt(i)] = i; }
            for (x = 0; x < L; x++) {
                c = e[s.charAt(x)]; b = (b << 6) + c; l += 6;
                while (l >= 8) { ((a = (b >>> (l -= 8)) & 0xff) || (x < (L - 2))) && (r += w(a)); }
            }
            return r;
        },
        strReverse: function (str) {
            return str.split("").reverse().join("");
        },
        isMobile: function () {
            return (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        },
        webpIsSupported: function (callback) {
            // If the browser doesn't has the method createImageBitmap, you can't display webp format
            try {
                if (!window.createImageBitmap) {
                    callback(false);
                    return;
                }

                // Base64 representation of a white point image
                var webpdata = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';

                // Retrieve the Image in Blob Format
                fetch(webpdata).then(function (response) {
                    return response.blob();
                }).then(function (blob) {
                    // If the createImageBitmap method succeeds, return true, otherwise false
                    createImageBitmap(blob).then(function () {
                        callback(true);
                    }, function () {
                        callback(false);
                    });
                });
            } catch (error) {
                callback(false);
            }
        }

    };
}(jQuery));