// Importações necessárias
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const client = new Client();

// [NOVO] Importação para executar o script Python
const { exec } = require('child_process');

// serviço de leitura do qr code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// apos isso ele diz que foi tudo certo
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp HÍBRIDO da JKL Veículos conectado.');
});

// E inicializa tudo 
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função de delay

// Funil HÍBRIDO
client.on('message', async msg => {
    try {
        const chat = await msg.getChat();
        const contact = await msg.getContact();
        const name = contact.pushname;
        const userMessage = msg.body;

        // [NOVO] Variável de controle
        let isMenuOption = false;

        // Resposta inicial para o primeiro contato ou para voltar ao menu
        if (userMessage.match(/(menu|Menu|bom dia|boa tarde|boa noite|oi|Oi|Olá|olá|ola|Ola|tudo bem|opa|começar|iniciar|e aí|voltar|início)/i) && msg.from.endsWith('@c.us')) {
            isMenuOption = true; // [NOVO] Marca como opção de menu
            
            await delay(2000); 
            await chat.sendStateTyping(); 
            await delay(3000); 
            
            await client.sendMessage(msg.from, 'Olá, ' + name.split(" ")[0] + '! 🚗💨 Bem-vindo(a) ao atendimento virtual da *JKL Veículos*!\n\nEstou aqui para te ajudar. Escolha uma das opções abaixo digitando o número correspondente:\n\n*1️⃣ - Ver Estoque Online*\n*2️⃣ - Promoções da Semana*\n*3️⃣ - Simulação de Financiamento*\n*4️⃣ - Avaliar meu Veículo na Troca*\n*5️⃣ - Dúvidas Frequentes*\n*6️⃣ - Nossa História*\n*7️⃣ - Endereço e Horário*\n*0️⃣ - Falar com um Vendedor*\n\nOu, se preferir, *apenas me faça uma pergunta* sobre a loja!'); 
        }

        // Resposta para a opção 1: Ver Estoque
        if (userMessage !== null && userMessage === '1' && msg.from.endsWith('@c.us')) {
            isMenuOption = true; // [NOVO] Marca como opção de menu
            await delay(2000); 
            await chat.sendStateTyping(); 
            await delay(3000);
            await client.sendMessage(msg.from, 'Ótima escolha! Nosso estoque é selecionado a dedo para garantir a melhor qualidade e procedência. Todos os nossos veículos são periciados e com garantia. ✅');
            
            await delay(1500);
            await client.sendMessage(msg.from, 'Clique no link para ver nosso showroom virtual:\n*https://www.jklveiculos.com.br/estoque*');
        }

        // NOVA OPÇÃO 2: Promoções da Semana
        if (userMessage !== null && userMessage === '2' && msg.from.endsWith('@c.us')) {
            isMenuOption = true; // [NOVO] Marca como opção de menu
            await delay(2000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, 'Confira nossas ofertas especiais desta semana!  fırsat kaçmaz! 🤩\n\n- *[MODELO DO CARRO]:* De R$ XX.XXX por apenas R$ XX.XXX!\n- *[OUTRO MODELO]:* IPVA 2025 Grátis!\n- *Toda a linha [MARCA]:* Transferência por nossa conta!\n\n*Atenção: Ofertas válidas até [data] ou enquanto durar o estoque.*');
            
            await delay(2000);
            await client.sendMessage(msg.from, 'Gostou de alguma? Digite *0* para falar com um vendedor e garantir a sua!');
        }

        // Resposta para a opção 3: Simulação de Financiamento
        if (userMessage !== null && userMessage === '3' && msg.from.endsWith('@c.us')) {
            isMenuOption = true; // [NOVO] Marca como opção de menu
            await delay(2000);
            await chat.sendStateTyping(); 
            await delay(3000);
            await client.sendMessage(msg.from, 'Quer saber como as parcelas cabem no seu bolso? A gente te ajuda! 💰\n\nTrabalhamos com os melhores bancos para oferecer taxas de financiamento competitivas.');

            await delay(2000);
            await client.sendMessage(msg.from, 'Para iniciar sua simulação, chame um de nossos vendedores digitando *0*.\n\nSe preferir, pode adiantar pelo nosso site:\n*https://www.jklveiculos.com.br/financiamento*');
        }

        // Resposta para a opção 4: Avaliar Veículo
        if (userMessage !== null && userMessage === '4' && msg.from.endsWith('@c.us')) {
            isMenuOption = true; // [NOVO] Marca como opção de menu
            await delay(2000); 
            await chat.sendStateTyping(); 
            await delay(3000);
            await client.sendMessage(msg.from, 'Seu usado vale como entrada aqui na JKL Veículos! Oferecemos uma avaliação justa e transparente para facilitar seu negócio. 🔄');
            
            await delay(2000);
            await client.sendMessage(msg.from, 'Para agilizar, digite *0* e fale com nossos avaliadores. Tenha em mãos as seguintes informações:\n\n- *Marca e Modelo*\n- *Ano*\n- *Quilometragem*\n- *Fotos do veículo*');
        }

        // NOVA OPÇÃO 5: Dúvidas Frequentes
        if (userMessage !== null && userMessage === '5' && msg.from.endsWith('@c.us')) {
            isMenuOption = true; // [NOVO] Marca como opção de menu
            await delay(2000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, 'Selecionei algumas das nossas dúvidas mais comuns. Sobre qual assunto você gostaria de saber mais?\n\n*5A* - Quais documentos preciso para financiar?\n*5B* - Vocês aceitam carta de crédito?\n*5C* - Qual a garantia dos veículos?\n\nDigite o código da opção (ex: *5A*). Para voltar, digite *Menu*.');
        }

        // Sub-respostas para Dúvidas Frequentes
        if (userMessage.match(/5A/i) && msg.from.endsWith('@c.us')) {
            isMenuOption = true; // [NOVO] Marca como opção de menu
            await client.sendMessage(msg.from, '*Documentos para Financiamento (Pessoa Física):*\n\n- CNH ou RG/CPF\n- Comprovante de Residência atual\n- Comprovante de Renda (3 últimos contracheques, imposto de renda ou extratos bancários).\n\nLembrando que a análise de crédito pode variar entre os bancos.');
        }
        if (userMessage.match(/5B/i) && msg.from.endsWith('@c.us')) {
            isMenuOption = true; // [NOVO] Marca como opção de menu
            await client.sendMessage(msg.from, 'Sim, aceitamos carta de crédito de consórcio! ✅\n\nTraga sua carta contemplada que nossa equipe cuidará de todo o processo junto à sua administradora para você sair de carro novo.');
        }
        if (userMessage.match(/5C/i) && msg.from.endsWith('@c.us')) {
            isMenuOption = true; // [NOVO] Marca como opção de menu
            await client.sendMessage(msg.from, 'Todos os nossos veículos passam por uma rigorosa inspeção e possuem garantia de 3 meses para motor e câmbio, conforme o Código de Defesa do Consumidor. Mais segurança para a sua compra!');
        }

        // NOVA OPÇÃO 6: Nossa História
        if (userMessage !== null && userMessage === '6' && msg.from.endsWith('@c.us')) {
            isMenuOption = true; // [NOVO] Marca como opção de menu
            await delay(2000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, 'Nossa história começa com um propósito vindo de Deus. 🙏\n\n*Jason Tércio*, nosso fundador, é um homem de fé e visão empreendedora. Guiado por princípios cristãos, ele sonhava em abrir um negócio que fosse instrumento de bênção para outras vidas.');
            await delay(3000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, 'Assim, em 12 de outubro de 2019, nasceu a *JKL Veículos*. Mais tarde, Deus colocou em nosso caminho o *João Batista (Joca)*, um amigo leal que se tornou sócio, somando forças e dedicação.\n\nHoje, seguimos pautados pela confiança, honestidade e pelo compromisso com cada cliente.');
        }

        // Resposta para a opção 7: Endereço
        if (userMessage !== null && userMessage === '7' && msg.from.endsWith('@c.us')) {
            isMenuOption = true; // [NOVO] Marca como opção de menu
            await delay(2000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, 'Será um prazer te receber em nossa loja! Estamos de portas abertas para você conhecer nosso showroom e tomar um café conosco. ☕\n\n📍 *Nosso Endereço:*\nRN 160, 04 – São Gonçalo do Amarante/RN\n\n⏰ *Horário de Funcionamento:*\nSegunda a Sexta: 08h às 18h\nSábado: 08h às 12h\n\n📧 *E-mail:*\ncontato@jklveiculos.com.br\n\nQualquer outra dúvida, é só chamar!');
        }

        // Resposta para a opção 0: Falar com Vendedor
        if (userMessage !== null && userMessage === '0' && msg.from.endsWith('@c.us')) {
            isMenuOption = true; // [NOVO] Marca como opção de menu
            await delay(2000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, 'Com certeza! Nossa equipe está pronta para te atender. 👨‍💼👩‍💼\n\nUm de nossos vendedores irá te responder aqui mesmo no WhatsApp em instantes. Se preferir, pode nos ligar:\n\n📞 *(84) 99451-0452*\n📞 *(84) 99419-2824*');
        }

        // ********************************************
        // ** [NOVO] INÍCIO DA LÓGICA DA IA **
        // ********************************************

        // Se a mensagem NÃO for uma opção de menu e for de um usuário
        if (!isMenuOption && msg.from.endsWith('@c.us')) {
            
            console.log(`[LOG] Mensagem não é do menu. Enviando para a IA: "${userMessage}"`);
            
            await delay(1000);
            await chat.sendStateTyping(); // Mostra "digitando..."

            // 1. Comando para chamar o script Python
            // Usamos o caminho completo do python.exe do venv para garantir!
            const command = `.\\venv\\Scripts\\python.exe chatbot_ia_jkl.py --query "${userMessage}"`;

            // 2. Executar o comando
            // [MUDANÇA AQUI] Adicionamos { encoding: 'utf8' } para corrigir os caracteres
            exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`[ERRO IA] Erro ao executar o comando: ${error.message}`);
                    client.sendMessage(msg.from, 'Desculpe, meu cérebro de IA está offline no momento. 🧠 Tente novamente mais tarde.');
                    return;
                }
                if (stderr) {
                    // Ignora erros "normais" do Ollama, mas loga se for um erro real
                    if (!stderr.includes("llama_print_timings")) {
                         console.error(`[ERRO SCRIPT] Erro no script Python: ${stderr}`);
                    }
                }

                // 3. Enviar a resposta da IA (stdout) para o usuário
                const aiResponse = stdout.trim();
                
                // Se a resposta for vazia ou o erro que queremos (do Ollama não rodando)
                if (!aiResponse || aiResponse.includes("Não foi possível conectar ao Ollama")) {
                    console.error("[ERRO IA] A IA não retornou uma resposta ou o Ollama está offline.");
                    client.sendMessage(msg.from, 'Desculpe, meu cérebro de IA está com dificuldade para conectar. 🧠 Tente novamente mais tarde.');
                } else {
                    // Envia a resposta da IA!
                    console.log(`[LOG] Resposta da IA: "${aiResponse}"`);
                    client.sendMessage(msg.from, aiResponse);
                }
            });
        }
        // ********************************************
        // ** [NOVO] FIM DA LÓGICA DA IA **
        // ********************************************

    } catch (err) {
        console.error("Erro fatal no processamento da mensagem: ", err);
    }
});

