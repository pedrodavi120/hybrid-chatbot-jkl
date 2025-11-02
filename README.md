# **Chatbot Híbrido para WhatsApp: JKL Veículos (com IA 100% Local)**

## **📖 Descrição**

Este projeto demonstra a criação de um chatbot para WhatsApp que combina uma abordagem baseada em regras (menu de opções) com um assistente de Inteligência Artificial 100% gratuito e local, usando **LangChain** e **Ollama**.

O chatbot é capaz de:

* Guiar usuários através de um menu de opções fixas para tarefas comuns.  
* Responder perguntas abertas e complexas com base em uma base de conhecimento personalizada, **sem custos de API e sem enviar dados para fora**.

## **🏛️ Arquitetura da Solução**

A solução opera de forma híbrida:

1. **Interface (WhatsApp)**: O cliente interage com a loja.  
2. **Orquestrador (Node.js \- whatsapp-web.js)**: Gerencia a conexão com o WhatsApp.  
   * **Lógica de Regras**: Responde a comandos de menu (ex: "1").  
   * **Lógica de IA**: Se for uma pergunta aberta, chama o cérebro de IA.  
3. **Cérebro de IA (Python \+ LangChain \+ Ollama)**:  
   * O script Node.js chama o script Python (chatbot\_ia\_jkl.py).  
   * O script Python usa **LangChain** para carregar a base\_conhecimento\_jkl.md.  
   * O LangChain se comunica com o **Ollama** (rodando no mesmo computador) para usar um modelo de IA local (como o gemma:2b do Google).  
   * O modelo gera uma resposta baseada no conhecimento da JKL.  
   * A resposta é impressa no console (stdout).  
4. **Retorno**: O Node.js captura a resposta e a envia ao usuário.

## **🛠️ Tecnologias Utilizadas**

* **Orquestração**: Node.js, whatsapp-web.js, child\_process  
* **Linguagem de IA**: Python 3.9+  
* **Framework de IA**: LangChain  
* **Servidor de IA Local**: Ollama  
* **Modelo de Linguagem**: Google Gemma (ou qualquer modelo do Ollama)  
* **Base de Conhecimento**: Arquivo Markdown (.md)

## **⚙️ Instalação e Configuração**

### **Parte 1: Ambiente Node.js (WhatsApp)**

1. Tenha o Node.js instalado.  
2. Instale as dependências:  
   npm install whatsapp-web.js qrcode-terminal

### **Parte 2: Ambiente de IA Local (Ollama)**

1. **Instale o Ollama:** Baixe e instale o programa em: [https://ollama.com/](https://ollama.com/)  
2. **Baixe o Modelo de IA:** Após instalar o Ollama, abra seu terminal e execute o comando abaixo para baixar o modelo gemma:2b (aprox. 2.7 GB):  
   ollama pull gemma:2b

3. **Verifique se o Ollama está rodando:** O Ollama deve estar em execução em segundo plano.

### **Parte 3: Ambiente Python (LangChain)**

1. Tenha o Python 3.9+ instalado.  
2. Crie e ative um ambiente virtual:  
   python \-m venv venv  
   source venv/bin/activate  \# macOS/Linux  
   \# venv\\Scripts\\activate    \# Windows

3. Instale as dependências de Python (usando o novo requirements.txt):  
   pip install \-r requirements.txt

4. **Não é necessário um arquivo .env\!** A autenticação é local.

## **🚀 Como Executar**

1. **Inicie o Ollama**: Certifique-se de que o aplicativo Ollama esteja em execução.  
2. Inicie o bot do WhatsApp:  
   Abra um terminal e execute o script Node.js.  
   node app.js

   Escaneie o QR Code com seu celular para conectar.  
3. **Teste a Interação**:  
   * Envie "Oi" para ver o menu.  
   * Teste uma opção do menu, como "1".  
   * Faça uma pergunta aberta da base\_conhecimento\_jkl.md, como:  
     * "Qual a filosofia da empresa?"  
     * "Vocês oferecem garantia estendida?"  
     * "Como funciona a avaliação do meu carro na troca?"

O bot irá alternar entre as respostas programadas e as respostas geradas pela sua IA local e gratuita.
