# **Chatbot Híbrido com IA (LangChain \+ Ollama) para WhatsApp**

Este é um projeto de seminário que demonstra a criação de um chatbot híbrido para WhatsApp. Ele combina um bot baseado em regras (para menus fixos) com um assistente de IA (usando LangChain e Ollama) para responder a perguntas abertas e complexas.

## **🎯 Tema do Seminário**

**T9: Criação de assistente IA chatbot: langchain/n8n etc.**

Este projeto serve como a "aplicação de validação" solicitada, explorando o framework **LangChain** para criar um assistente de IA que roda localmente usando **Ollama** e o modelo gemma:2b.

## **🏛️ Arquitetura da Solução (Híbrida)**

O sistema funciona combinando duas lógicas em um único bot do WhatsApp:

1. **Bot de Regras (Node.js \- whatsapp-web.js)**:  
   * É o "cérebro" principal.  
   * Gerencia a conexão com o WhatsApp.  
   * Processa mensagens de entrada. Se for um número de menu (ex: "1", "2", "0"), ele responde com a mensagem pré-definida.  
   * Se for qualquer outra coisa (uma pergunta), ele aciona o Bot de IA.  
2. **Bot de IA (Python \- langchain \+ ollama)**:  
   * É o "cérebro" de conhecimento.  
   * É chamado pelo script Node.js (via exec).  
   * Utiliza **LangChain** para orquestrar uma cadeia RAG (Retrieval-Augmented Generation).  
   * **RAG (Geração Aumentada por Recuperação)**: O bot não "pensa" sozinho. Ele usa a pergunta do usuário para *buscar* informações relevantes dentro da base de conhecimento (base\_conhecimento\_jkl.md) e, em seguida, usa o modelo de IA (gemma:2b rodando no Ollama) para *gerar* uma resposta em linguagem natural baseada *apenas* nos fatos encontrados.

### **Otimização com Índice FAISS**

Para garantir que as respostas da IA sejam rápidas, nós **pré-processamos** a base de conhecimento.

* Um comando de inicialização (--init) lê o base\_conhecimento\_jkl.md **uma única vez** e o transforma em um banco de dados vetorial (usando FAISS), salvando-o na pasta faiss\_index.  
* Quando o usuário faz uma pergunta, o script Python agora apenas *carrega* esse índice (o que é instantâneo), em vez de recriá-lo do zero, reduzindo o tempo de resposta de minutos para segundos.

## **⚙️ Instalação e Configuração**

Siga estes passos para configurar e rodar o projeto em sua máquina local.

### **Pré-requisitos**

1. **Node.js**: [https://nodejs.org/](https://nodejs.org/)  
2. **Python** (versão 3.9+): [https://www.python.org/](https://www.python.org/)  
3. **Ollama**: [https://ollama.com/](https://ollama.com/) (Instale e mantenha-o rodando em segundo plano).

### **Passo 1: Configurar o Modelo de IA (Ollama)**

Após instalar o Ollama, abra seu terminal e baixe o modelo que usaremos:

ollama pull gemma:2b

*(Certifique-se de que o Ollama esteja rodando antes de prosseguir).*

### **Passo 2: Configurar o Ambiente Python (IA)**

Em um terminal, na pasta do projeto:

\# 1\. Crie um ambiente virtual  
python \-m venv venv

\# 2\. Ative o ambiente  
\# No Windows (PowerShell):  
.\\venv\\Scripts\\activate  
\# No macOS/Linux:  
\# source venv/bin/activate

\# 3\. Instale as dependências do Python  
pip install \-r requirements.txt

### **Passo 3: Configurar o Bot do WhatsApp (Node.js)**

Em **outro** terminal, na mesma pasta do projeto:

\# 1\. Instale as dependências do Node.js  
npm install

### **Passo 4: Criar o Índice da IA (Passo Único)**

Agora, volte para o terminal do Python (com o venv ativo) e rode o comando de inicialização para criar o índice FAISS. **Você só precisa fazer isso uma vez**:

\# (Certifique-se que o (venv) está ativo)  
.\\venv\\Scripts\\python.exe chatbot\_ia\_jkl.py \--init

*(Isso vai ler o base\_conhecimento\_jkl.md e criar a pasta faiss\_index)*.

## **🚀 Como Executar**

Para rodar o chatbot, você precisa ter o **Ollama** rodando em segundo plano e, em seguida, iniciar o bot do Node.js:

1. Verifique se o Ollama está rodando.  
2. Abra o terminal do Node.js (aquele do "Passo 3").  
3. Inicie o bot:  
   node app.js

4. Escaneie o QR Code com seu celular.

## **Link do vídeo da apresentação**: [https://https://youtu.be/oHCCn4_AgYY/](https://youtu.be/oHCCn4_AgYY))  

Pronto\! O bot híbrido está online. Envie uma opção de menu ("1") para testar o bot de regras. Em seguida, envie uma pergunta aberta ("Qual a história da JKL?") para testar o bot de IA.
