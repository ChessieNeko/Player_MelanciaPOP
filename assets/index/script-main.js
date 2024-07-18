/***Declaração das var globais do DOM***/
const pageBody = document.getElementById('page-body');
const palavraBusca = document.getElementById('palavra-busca');
const playlistMenu = document.getElementById('listaMusicas');
const btnApagaMusica = document.getElementById('btn-apagaMusica');
const btnBusca = document.getElementById('btn-busca');
const btnPlaylist = document.getElementById('btn-playlist');
const btnAddMusica = document.getElementById('btn-addMusica');
const btnTocarPlaylist = document.getElementById('start-player');
const btnVoltarBiblioteca = document.getElementById('voltar-playlist');
const footerPlayer = document.getElementById('footer-player');
const btnMostraPlayer = document.getElementById('btn-showPlayer');
/*Quando possivel trocar os icones.svg*/
const btnSkip10sec = document.getElementById('btn-pula10sec');
const btnBack10sec = document.getElementById('btn-volta10sec');
/***************************************************************/
//estudar e organizar
document.getElementById('menu-checked').addEventListener('change', function() {
    var navPlaylist = document.getElementById('nav-playlist');
    if (this.checked) {
        navPlaylist.style.right = '0';
    } else {
        navPlaylist.style.right = '-450px'; // Posição original
    }
});
/*******************/
/***Variaveis Aux***/
let index = 0; //operador de coalescência nula 
let isPlaying = false;
let isShuffled = false;
let repetirAtivado = false;
let idMusicaAtual;

let musicas = [...bibliotecaMusicas];//Este arquivo esta no script musicas.js
let playlist = JSON.parse(localStorage.getItem('playlist')) ?? [likeADream, suddenShower, RunRun];

/***Funções da Biblioteca e Afins***/
function carregaBiblioteca(){
    pageBody.innerHTML = '';
    
    for(let index = 0; index < musicas.length; index++){
        pageBody.innerHTML +=
            `
            <div class="cardMusica">
                <div class="cardImgWrapper">
                    <img src="./assets/imagens/capasMusica/${musicas[index].capa}" class="cardImg" alt="capa da Música">
                    <button class="btn btn-playCard btnSobreImg" onclick="togglePlayPause(${index})"><i class="bi bi-play-circle-fill"></i></button>
                </div>
                <div class="cardMusica-conteudo">
                    <h5 class="card-titulo">${musicas[index].nomeMusica}</h5>
                    <div class="cardMusicaInfoBtn">
                        <div class="cardMusicaInfo">
                            <p class="card-texto">${musicas[index].album}</p>
                            <p class="card-texto">${musicas[index].artista}</p>
                        </div>
                                    
                        <button id="btn-addMusica" class="btn" onclick="addAPlaylist(${musicas[index].id})"><i class="bi bi-plus-circle"></i></button>
                    </div>
                </div>
            </div>
            `  
    }
}

function clickBusca(){
    const palavraNormalizada = palavraBusca.value.trim().toLowerCase();
    if(palavraBusca.value.trim() === ''){
        return;
    }
    musicas = [...bibliotecaMusicas];
    musicas = musicas.filter((musica) => 
        musica.nomeMusica.toLowerCase().includes(palavraNormalizada)||
        musica.album.toLowerCase().includes(palavraNormalizada)||
        musica.artista.toLowerCase().includes(palavraNormalizada)
    );
    
    carregaBiblioteca();
}

function resetaFiltro(){
    if(palavraBusca.value !== ''){return;}
    musicas = [...bibliotecaMusicas];
    carregaBiblioteca();
}

function carregaPlaylist(){
    playlistMenu.innerHTML = '';

    for(let index = 0; index < playlist.length; index++){
        playlistMenu.innerHTML += 
        `
        <li class="item-Playlist" id="${playlist[index].id}">
            <div class="infoMusica">
                <img src="./assets/imagens/capasMusica/${playlist[index].file}.jpg" alt="Capa da musica na playlist">
                <div class="infoMusicaTextos">
                    <h3>${playlist[index].nomeMusica}</h3>
                    <p>${playlist[index].artista}</p>
                </div>
            </div>
            <button id="btn-apagaMusica" class="btn" onclick="removeDaPlaylist('${playlist[index].id}')"><i class="bi bi-trash3-fill"></i></button>
        </li>
        `;
    }
}

function removeDaPlaylist(idMusica){
    const musicaElement = document.getElementById(idMusica);
    if (musicaElement) {
        musicaElement.remove();
    }
    playlist = playlist.filter((musica) => musica.id !== idMusica);

    attArmazenamentoLocal();
    carregaPlaylist();
}


function addAPlaylist(idMusica){
    if(playlist.find(musica => musica.id == idMusica))return;
    const musicaParaAdd = musicas.find(musica => musica.id === `${idMusica}`);

    if (!musicaParaAdd) return;

    playlist.push(musicaParaAdd);

    playlistMenu.innerHTML += 
        `
        <li class="item-Playlist">
            <div class="infoMusica">
                <img src="./assets/imagens/capasMusica/${musicaParaAdd.file}.jpg" alt="Capa da musica na playlist">
                <div>
                    <h3>${musicaParaAdd.nomeMusica}</h3>
                    <p>${musicaParaAdd.artista}</p>
                </div>
            </div>
            <button id="btn-apagaMusica" class="btn" onclick="removeDaPlaylist('${musicaParaAdd.id}')"><i class="bi bi-trash3-fill"></i></button>
        </li>
        `;

    attArmazenamentoLocal();
}

function attArmazenamentoLocal(){
    localStorage.setItem('playlist', JSON.stringify(playlist));
}

function startPlayerFullPlaylist(){
    location.href = 'reprodutor/reprodutor.html';
}

/**Funções do Player**/
function togglePlayPause(index) {
    const botoesPlayCard = document.querySelectorAll('.btn-playCard');
    const btnPPCard = botoesPlayCard[index];
    const isPlayingNow = isPlaying && idMusicaAtual === index;
    const footerPlayer = document.getElementById('footer-player');

    if (isPlayingNow) {
        pausarMusicaCard(btnPPCard);
    } else {
        if (idMusicaAtual !== index) {
            guardaId(index);
            btnPPCard.classList.add('visivel');
        } else {
            tocarMusica();
            btnPPCard.classList.add('visivel');
        }
        trocaPlayPraPause(btnPPCard);

        //Garante que os botões comecem com opacidade 0 sempre e atualiza svg
        botoesPlayCard.forEach((btn, i) => {
            if (i !== index) {
                btn.classList.remove('visivel');
                trocaPausePraPlay(btn);
            }
        });

        footerPlayer.classList.add('show'); // Mostrar o footer quando a música é tocada
    }
    // Atualiza o botão de play/pause no player do footer
    if (isPlayingNow) {
        trocaPausePraPlay(btnPlay);
    } else {
        trocaPlayPraPause(btnPlay);
    }
}


function pausarMusicaCard(btnPauseCard){
    if (btnPauseCard) {
        trocaPausePraPlay(btnPauseCard);
    }

    musica.pause();
    isPlaying = false;
}

function guardaId(idMusica){
    idMusicaAtual = idMusica;
    tocarMusicaPorId(idMusicaAtual);
}

function musicaRepete(){
    if(repetirAtivado === true)
        tocarMusica();
}


/***Eventos***/
document.addEventListener('DOMContentLoaded', (event) => {
    const footerPlayer = document.getElementById('footer-player');
    const hideFooterButton = document.getElementById('btn-hide-footer'); // Botão para esconder o footer

    hideFooterButton.addEventListener('click', () => {
        footerPlayer.classList.remove('show');
        btnMostraPlayer.classList.add('mostra');
    });
});

btnMostraPlayer.addEventListener('click', function(){
    if(musica.src){//garante que há uma musica carregada
        footerPlayer.classList.add('show');
    }
});

musica.addEventListener('ended', musicaRepete);
btnBusca.addEventListener('click', clickBusca);
palavraBusca.addEventListener('input', resetaFiltro);
btnTocarPlaylist.addEventListener('click',startPlayerFullPlaylist);

/**nav btns 10s**/
btnSkip10sec.addEventListener('click', function() {
    musica.currentTime += 10;
});
btnBack10sec.addEventListener('click', function() {
    musica.currentTime -= 10;
});

/*Esconde Player*/
document.addEventListener('DOMContentLoaded', (event) => {
    const footerPlayer = document.getElementById('footer-player');
    const escondeFooter = document.getElementById('btn-hide-footer'); // Botão para esconder o footer

    escondeFooter.addEventListener('click', () => {
        footerPlayer.classList.remove('show');
    });
});

carregaBiblioteca();
carregaPlaylist();