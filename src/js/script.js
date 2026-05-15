//Declarações dos elementos com DOM
const videoElemento=document.getElementById("video");
const botaoScanear=document.getElementById("btn-textos");
const resultado=document.getElementById("saida");
const canvas=document.getElementById("canvas");

//função para habilitar a câmera

async function configurarCamera(){
    try{
        const midia = await navigator.mediaDevices.getUserMedia({
            video: {facingMode: "environment"}, //habilitando a câmera traseira
            audio: false //audio não será capturado
        })
        //atribuir o fluxo da câmera em mídia
        videoElemento.srcObject = midia;
        //garante que a câmera vai funcionar
        videoElemento.onplay();
    }catch(erro){
            resultado.innerText="Erro ao capturar a câmera",erro

    }
}
//executa função da câmera
configurarCamera();

//função para capturar o texto
botaoScanear.onclick = async ()=>{
    botaoScanear.disabled = true; //habilita o botão para pegar o texto
    resultado.innerText = "Fazendo a Leitura... Aguarde";

    //prepara o canvas para receber a estrutura em 2D
    const contexto = canvas.getContext("2d");

    //ajusta o tamanho do canvas de acordo com o video
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    //define a matriz de transformação do canvas (escala, inclnação)
    contexto.setTransform(1,0,0,1,0,0);

    //aplica filtro de contraste para melhorar o OCR
    contexto.filter = 'contrast(1,2) grayscale(1)';

    contexto.drawImage(videoElemento, 0, 0, canvas.width,canvas.height);

    try{
        const {data: { text }}= await Tesseract.recognize(
            canvas,
            'por' //define o idioma
        );
        const textoFinal= text.trim();
        resultado.innerText = textoFinal.length >0 ? textoFinal: "Não foi possível identificar o resultado";
    }catch(erro){
        resultado.innerText="Erro ao processar a leitura",erro
    }finally{
        //desabilida a leitura do texto para começar novamente
        botaoScanear.disabled=false;
    }
}