import sys
import os
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_ollama.embeddings import OllamaEmbeddings
from langchain_community.llms import Ollama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_history_aware_retriever

# --- Constantes ---
BASE_CONHECIMENTO_PATH = "base_conhecimento_jkl.md"
FAISS_INDEX_PATH = "faiss_index" # Pasta para salvar o índice
MODELO_OLLAMA = "gemma:2b"

def get_vectorstore(ollama_embeddings):
    """
    Carrega o índice FAISS do disco se ele existir.
    """
    if os.path.exists(FAISS_INDEX_PATH):
        try:
            # Permite desserialização, necessário para carregar o índice local
            return FAISS.load_local(
                FAISS_INDEX_PATH, 
                ollama_embeddings, 
                allow_dangerous_deserialization=True
            )
        except Exception as e:
            print(f"Erro ao carregar o índice FAISS: {e}. Recriando...")
            return None
    return None

def create_vectorstore(ollama_embeddings):
    """
    Cria um novo índice FAISS a partir da base de conhecimento e o salva no disco.
    """
    print("Criando novo índice vetorial...")
    loader = TextLoader(BASE_CONHECIMENTO_PATH, encoding="utf-8")
    docs = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)
    
    vectorstore = FAISS.from_documents(documents=splits, embedding=ollama_embeddings)
    vectorstore.save_local(FAISS_INDEX_PATH)
    print(f"Índice vetorial criado e salvo em '{FAISS_INDEX_PATH}'")
    return vectorstore

def get_rag_chain(ollama_embeddings):
    """
    Cria a cadeia RAG completa, carregando ou criando o vectorstore.
    """
    vectorstore = get_vectorstore(ollama_embeddings)
    
    if vectorstore is None:
        print("Nenhum índice encontrado. A primeira pergunta pode demorar mais.")
        vectorstore = create_vectorstore(ollama_embeddings)

    llm = Ollama(model=MODELO_OLLAMA)
    retriever = vectorstore.as_retriever()

    # 1. Prompt para reescrever a pergunta com base no histórico
    contextualize_q_system_prompt = (
        "Dada uma conversa e uma pergunta de acompanhamento, "
        "reescreva a pergunta de acompanhamento para ser uma pergunta independente, "
        "em seu idioma original."
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

    # 2. Prompt para responder a pergunta usando o contexto
    qa_system_prompt = (
        "Você é um assistente da JKL Veículos. Você deve usar apenas as seguintes partes "
        "do contexto recuperado para responder à pergunta. "
        "Se você não sabe a resposta com base no contexto, "
        "apenas diga educadamente que você não possui essa informação. "
        "Mantenha a resposta o mais concisa e direta possível."
        "\n\n"
        "{context}"
    )
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )

    # 3. Criar as chains
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
    
    return rag_chain

def main():
    """
    Função principal para lidar com os argumentos da linha de comando.
    """
    try:
        # [NOVA CORREÇÃO] Força a saída padrão (stdout) para usar UTF-8
        # Isso corrige os erros de caracteres especiais () no Windows.
        if os.name == 'nt': # 'nt' significa que é Windows
            sys.stdout.reconfigure(encoding='utf-8')

        ollama_embeddings = OllamaEmbeddings(model=MODELO_OLLAMA)

        # Comando --init: Força a criação/recriação do índice
        if "--init" in sys.argv:
            create_vectorstore(ollama_embeddings)
            sys.exit(0)

        # Comando --query: Executa a consulta
        if "--query" in sys.argv:
            query_index = sys.argv.index("--query") + 1
            if query_index >= len(sys.argv):
                print("Erro: Argumento --query precisa de um valor.")
                sys.exit(1)
            
            query_text = sys.argv[query_index]
            
            # Cria (ou carrega) a chain RAG
            rag_chain = get_rag_chain(ollama_embeddings)
            
            # Invoca a chain. Usamos um histórico de chat vazio por simplicidade.
            response = rag_chain.invoke({"input": query_text, "chat_history": []})
            
            # Imprime apenas a resposta final para o Node.js
            print(response["answer"])

        else:
            print("Nenhum comando fornecido. Use --init ou --query.")

    except Exception as e:
        if "connection refused" in str(e):
            print("Erro: Não foi possível conectar ao Ollama. Você iniciou o programa Ollama?")
        else:
            print(f"Erro inesperado no script Python: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

