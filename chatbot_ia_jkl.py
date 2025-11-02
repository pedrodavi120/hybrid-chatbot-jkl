# -*- coding: utf-8 -*-
"""
Este script é o cérebro de IA do chatbot da JKL Veículos.
Versão 100% Gratuita e Local, usando LangChain e Ollama.
*** VERSÃO MODERNA (Pós-LangChain v0.2.x) ***

Pré-requisitos:
- Python 3.9+
- Ollama instalado e rodando.
- Modelo 'gemma:2b' baixado (execute: ollama pull gemma:2b)

Como executar no terminal (para teste):
python chatbot_ia_jkl.py --query "Sua pergunta sobre a JKL Veículos"
"""

import os
import argparse

# Importações do LangChain (MODERNAS E CORRETAS)
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage

# === INÍCIO DA CORREÇÃO DEFINITIVA ===
# Este é o local correto para estas funções nas versões 0.2.x do LangChain
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_history_aware_retriever
# === FIM DA CORREÇÃO DEFINITIVA ===


# Caminho para o arquivo que contém o conhecimento do chatbot
KNOWLEDGE_BASE_PATH = "base_conhecimento_jkl.md"

# Define o modelo que o Ollama irá usar.
OLLAMA_MODEL = "gemma:2b" 

def create_vector_store():
    """
    Carrega o arquivo de conhecimento, divide em pedaços (chunks),
    cria embeddings e armazena em um banco de vetores (FAISS).
    """
    if not os.path.exists(KNOWLEDGE_BASE_PATH):
        raise FileNotFoundError(f"Arquivo de conhecimento '{KNOWLEDGE_BASE_PATH}' não encontrado. Certifique-se que ele está na mesma pasta.")

    # 1. Carregar o documento de texto
    loader = TextLoader(KNOWLEDGE_BASE_PATH, encoding='utf-8')
    documents = loader.load()

    # 2. Dividir o documento em pedaços (chunks)
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1200,     # Tamanho de cada pedaço
        chunk_overlap=100  # Sobreposição para manter o contexto
    )
    texts = text_splitter.split_documents(documents)

    # 3. Criar os embeddings (vetores) usando o Ollama
    # (Isso pode demorar um pouco na primeira vez)
    embeddings = OllamaEmbeddings(model=OLLAMA_MODEL)
    
    # 4. Criar o banco de vetores FAISS com os textos e seus embeddings
    vectorstore = FAISS.from_documents(texts, embeddings)
    return vectorstore

def main():
    """
    Função principal que processa a pergunta do usuário
    e retorna uma resposta baseada no conhecimento.
    """
    # Configura o script para aceitar uma pergunta via linha de comando
    parser = argparse.ArgumentParser(description="Assistente de IA da JKL Veículos (Ollama).")
    parser.add_argument("--query", type=str, required=True, help="A pergunta do cliente.")
    
    args = parser.parse_args()

    try:
        # 1. Criar o banco de vetores a partir do arquivo de conhecimento
        vectorstore = create_vector_store()
        # Criar um "retriever" (buscador) que encontra os 3 chunks mais relevantes
        retriever = vectorstore.as_retriever(search_kwargs={'k': 3})

        # 2. Inicializar o modelo de linguagem (LLM) que está rodando no Ollama
        llm = ChatOllama(model=OLLAMA_MODEL, temperature=0.3) # Temperatura baixa para respostas mais diretas

        # 3. Criar um "Retriever" com Histórico de Conversa
        # Este prompt reformula a pergunta do usuário para incluir o contexto do chat
        contextualize_q_system_prompt = (
            "Dada uma conversa e uma pergunta de acompanhamento, reformule a pergunta "
            "para ser uma pergunta independente, em seu idioma original."
        )
        contextualize_q_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", contextualize_q_system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ]
        )
        history_aware_retriever = create_history_aware_retriever(
            llm, retriever, contextualize_q_prompt
        )

        # 4. Criar a "Chain" (corrente) de Resposta
        # Este prompt instrui a IA a como responder usando o contexto encontrado
        qa_system_prompt = (
            "Você é um assistente virtual da JKL Veículos. Use os trechos de informações a seguir para responder à pergunta do cliente. "
            "Se você não sabe a resposta, apenas diga 'Desculpe, não tenho essa informação no momento.'. "
            "Seja sempre educado e profissional. "
            "Não invente respostas. Fale em português do Brasil."
            "\n\n"
            "Contexto: {context}"
        )
        qa_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", qa_system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ]
        )
        
        # Esta chain "recheia" (stuff) o prompt com os documentos encontrados
        question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

        # 5. Unir tudo em uma "Chain de Recuperação" (RAG)
        rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

        # 6. Invocar a chain com a pergunta do usuário
        
        # Como é um script de linha de comando, o histórico começa vazio
        chat_history = [] 
        
        # A "mágica" acontece aqui
        result = rag_chain.invoke({
            "input": args.query,
            "chat_history": chat_history
        })

        # 7. Imprimir apenas a resposta final
        print(result['answer'])

    except FileNotFoundError as e:
        print(f"Erro: {e}")
    except Exception as e:
        # Este é o erro esperado se o Ollama não estiver rodando
        if "connection refused" in str(e).lower():
            print(f"Erro: Não foi possível conectar ao Ollama. Você iniciou o programa Ollama?")
        else:
            print(f"Ocorreu um erro inesperado: {e}")

if __name__ == "__main__":
    main()

