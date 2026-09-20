const SUPABASE_URL = "https://ljyxrywwpzvpoxozxcjt.supabase.co";
const SUPABASE_KEY = "sb_publishable_zTvzZKOA1v0nTBJwAw-n4w_8G6URyLH";

const banco = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
function mostrarPagina(pagina) {
    
document.body.classList.remove("inicio", "professores", "robotica");
document.body.classList.add(pagina);

    const paginas = document.querySelectorAll(".pagina");

    paginas.forEach(function(item) {
        item.classList.remove("ativa");
    });

    const paginaSelecionada = document.getElementById(pagina);

    if (paginaSelecionada) {
        paginaSelecionada.classList.add("ativa");
    }const botoesMenu = document.querySelectorAll("nav button");

botoesMenu.forEach(function(botao) {
    botao.classList.remove("menu-ativo");
});

const botaoAtual = document.querySelector(
    `nav button[onclick="mostrarPagina('${pagina}')"]`
);

if (botaoAtual) {
    botaoAtual.classList.add("menu-ativo");
}
// TROCAR IMAGEM DE FUNDO
if (pagina === "inicio") {
 document.body.style.backgroundImage = 'url("logo-rs.png")';
}

if (pagina === "professores") {
    document.body.style.backgroundImage = 'url("fundo-robotica.png")';
   document.body.style.backgroundImage = 'url("fundo-professores.png")';
}

if (pagina === "robotica") {
   document.body.style.backgroundImage = "url('fundo-robotica.png')";
}

// Configuração do fundo
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundSize = "100% 100%";
document.body.style.backgroundPosition = "center";
}
// SALVAR E CARREGAR AGENDA

document.addEventListener("DOMContentLoaded", async function () {

    const campos = document.querySelectorAll(
        ".pagina[data-ensino] .agenda-nova[data-turno] textarea"
    );

    // CARREGA TODA A AGENDA DO BANCO
    const { data, error } = await banco
        .from("agenda")
        .select("*");

    if (error) {
        console.error("Erro ao carregar agenda:", error);
    } else {

        campos.forEach(function (campo) {

            const linha = campo.closest(".linha-dia");
            const agenda = campo.closest(".agenda-nova");
            const pagina = campo.closest(".pagina");

            const ensino = pagina.dataset.ensino;
            const turno = agenda.dataset.turno;
            const dia = linha.dataset.dia;
            const horario = campo.dataset.horario;

            const registro = data.find(function (item) {
                return (
                    item.ensino === ensino &&
                    item.dia === dia &&
                    item.turno === turno &&
                    item.horario === horario
                );
            });

            if (registro) {
                campo.value = registro.programacao || "";
            }
        });
    }


    // SALVA QUANDO O PROFESSOR ALTERAR UM CAMPO
    campos.forEach(function (campo) {

        campo.addEventListener("change", async function () {

            const { data: usuario } = await banco.auth.getUser();

            if (!usuario.user) {
                alert("Faça login como professor para editar a agenda.");
                location.reload();
                return;
            }

            const linha = campo.closest(".linha-dia");
            const agenda = campo.closest(".agenda-nova");
            const pagina = campo.closest(".pagina");

            const ensino = pagina.dataset.ensino;
            const turno = agenda.dataset.turno;
            const dia = linha.dataset.dia;
            const horario = campo.dataset.horario;

            const { error } = await banco
                .from("agenda")
                .upsert(
                    {
                        ensino: ensino,
                        dia: dia,
                        turno: turno,
                        horario: horario,
                        programacao: campo.value
                    },
                    {
                        onConflict: "ensino,dia,turno,horario"
                    }
                );

            if (error) {
                console.error(error);
                alert("❌ Erro ao salvar a programação.");
            } else {
                console.log("✅ Programação salva!");
            }

        });

    });

});
// LOGIN DO PROFESSOR

async function entrarProfessor() {

    const email = document.getElementById("emailLogin").value;
    const senha = document.getElementById("senhaLogin").value;
    const mensagem = document.getElementById("mensagemLogin");

    mensagem.textContent = "Entrando...";

    const { data, error } = await banco.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        mensagem.textContent = "❌ E-mail ou senha incorretos.";
        mensagem.style.color = "#d32f2f";
        return;
    }

    mensagem.textContent = "✅ Login realizado com sucesso!";
mensagem.style.color = "#198754";
    // LIBERA O SITE
    document.getElementById("cabecalhoSite").style.setProperty("display", "block", "important");
document.getElementById("conteudoSite").style.setProperty("display", "block", "important");

document.getElementById("login").style.setProperty("display", "none", "important");

    // MOSTRA A PÁGINA INICIAL
    mostrarPagina("inicio");
}
// VERIFICA SE O PROFESSOR JÁ ESTÁ LOGADO

// VERIFICA SE O PROFESSOR JÁ ESTÁ LOGADO

document.addEventListener("DOMContentLoaded", async function () {

    const cabecalho = document.getElementById("cabecalhoSite");
    const conteudo = document.getElementById("conteudoSite");
    const login = document.getElementById("login");

    const { data } = await banco.auth.getUser();

    if (data.user) {

        cabecalho.style.setProperty("display", "block", "important");
        conteudo.style.setProperty("display", "block", "important");
        login.style.setProperty("display", "none", "important");

        mostrarPagina("inicio");

    } else {

        cabecalho.style.setProperty("display", "none", "important");
        conteudo.style.setProperty("display", "none", "important");
        login.style.setProperty("display", "block", "important");

    }

});
// SAIR DA CONTA DO PROFESSOR
async function sairProfessor() {

    const { error } = await banco.auth.signOut();

    if (error) {
        alert("Erro ao sair da conta.");
        return;
    }

    location.reload();
}
// MOSTRAR PROFESSOR LOGADO
async function mostrarUsuarioLogado() {

    const { data } = await banco.auth.getUser();

    const usuarioLogado = document.getElementById("usuarioLogado");

    if (data.user && usuarioLogado) {
        usuarioLogado.textContent = "👤 " + data.user.email;
    }
}

mostrarUsuarioLogado();
function mostrarSenha() {
    const campoSenha = document.getElementById("senhaLogin");

    if (campoSenha.type === "password") {
        campoSenha.type = "text";
    } else {
        campoSenha.type = "password";
    }
}
// ABRIR E FECHAR MENU DO USUÁRIO
function abrirMenuUsuario() {
    const menu = document.getElementById("menuUsuario");

    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}