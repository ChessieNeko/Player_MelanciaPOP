const btnVoltarBiblioteca = document.getElementById('voltar-playlist');

const playlistOriginal = JSON.parse(localStorage.getItem('playlist')) ?? [suddenShower, likeADream, RunRun,SpringSnow];//operador de coalescência nula 
let index = 0; 
let isPlaying = false;
let isShuffled = false;
let repetirAtivado = false;

let playlistEmbaralhada = [...playlistOriginal];

function iniciaMusica(){
    capaMusica.src = `../assets/imagens/capasMusica/${playlistEmbaralhada[index].file}.jpg`;
    musica.src = `../assets/musicas/${playlistEmbaralhada[index].file}.mp3`;
    nomeMusica.innerText = playlistEmbaralhada[index].nomeMusica;
    nomeBanda.innerText = playlistEmbaralhada[index].artista;

    likeBtnRender();
}

function musicaAnterior(){
    if(index === 0){
        index = playlistEmbaralhada.length-1;
    }else{
        index--;
    }
    iniciaMusica();
    tocarMusica();
}

function musicaPrixima(){
    if(index === playlistEmbaralhada.length-1){
        index = 0;
    }else{
        index++;
    }
    iniciaMusica();
    tocarMusica();
}

function embaralhaLista(listaOriginal){
    const tamanho = listaOriginal.length;
    let indexAtual = tamanho-1;

    while(indexAtual>0){
        let indexRandom = Math.floor(Math.random()*tamanho);
        let aux = listaOriginal[indexAtual];

        listaOriginal[indexAtual] = listaOriginal[indexRandom];
        listaOriginal[indexRandom] = aux;

        indexAtual--;
    }
}

function shuffleBtnClicado(){
    if(isShuffled === false){
        isShuffled = true;
        embaralhaLista(playlistEmbaralhada);
        btnShuffle.classList.add('btn-ativo');
    }else{
        isShuffled = false;
        playlistEmbaralhada = [...playlistOriginal];
        btnShuffle.classList.remove('btn-ativo');
    }
}

function proxOrRepete(){
    if(repetirAtivado === false){
        musicaPrixima();
    }else{
        tocarMusica();
    }
}


function likeBtnRender(){
    if(playlistEmbaralhada[index].liked === false){
        btnLike.querySelector('.bi').classList.remove('bi-heart-fill');
        btnLike.querySelector('.bi').classList.add('bi-heart');
        btnLike.classList.remove('btn-ativo');
    }else{
        btnLike.querySelector('.bi').classList.remove('bi-heart');
        btnLike.querySelector('.bi').classList.add('bi-heart-fill');
        btnLike.classList.add('btn-ativo');
    } 
}

function likeBtnClicado(){
    if(playlistEmbaralhada[index].liked === false){
        playlistEmbaralhada[index].liked = true;
    }else{
        playlistEmbaralhada[index].liked = false;
    }
    likeBtnRender();

    localStorage.setItem(
        'playlist', 
        JSON.stringify(playlistOriginal)
    );
}

function voltarBibliotecaMusicas(){
    location.href = '../index.html';
}


iniciaMusica();

btnVoltarBiblioteca.addEventListener('click',voltarBibliotecaMusicas);

musica.addEventListener('ended',proxOrRepete);

/*Pega tds os btns com esta classe*/
btnPlay.addEventListener('click', decidePlayPause);

btnPrevious.addEventListener('click',musicaAnterior);
btnNext.addEventListener('click',musicaPrixima);
btnShuffle.addEventListener('click',shuffleBtnClicado);
btnLike.addEventListener('click',likeBtnClicado);

/*barra de espaço playiando*/
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        decidePlayPause();
    }
});

/*Hover do Like 
btnLike.addEventListener('mouseover', function() {
    btnLike.querySelector('.bi').classList.remove('bi-heart');
    btnLike.querySelector('.bi').classList.add('bi-heartbreak-fill');
    btnLike.classList.add('btn-ativo');
});

btnLike.addEventListener('mouseout', function() {
    console.log('Mouse saiu do botão');
    // Ações a serem realizadas quando o botão não está mais em hover
});*/