import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

const orchestrator = {
  waitForAllServices,
};

export default orchestrator;

/*
Another apporach suggestion:
- Clareza e manutenção: Todas as funções ficam declaradas no topo do arquivo, evitando funções aninhadas desnecessárias. Isso facilita a leitura, manutenção e futuras contribuições.
- Reaproveitamento e testabilidade: Separar fetchStatusPage e waitForWebServer permite testar e reutilizar cada função de forma independente, além de facilitar a extensão para outros serviços no futuro.
- Feedback mais rápido: Com o minTimeout: 300, falhas são detectadas rapidamente, tornando o ciclo de desenvolvimento e CI mais eficiente.
- Tratamento explícito de erros: fetchStatusPage lança um erro caso o serviço ainda não esteja pronto, garantindo que o retry funcione corretamente e evitando loops silenciosos.
- Extensibilidade: Caso seja necessário aguardar outros serviços além do web server, basta adicionar novas funções seguindo o mesmo padrão, mantendo o código limpo e modular.

import retry from "async-retry";

async function fetchStatusPage() {
  const response = await fetch("http://localhost:3000/api/v1/status");
  if (!response.ok) {
    throw new Error(`Status endpoint not ready: ${response.status}`);
  }
  return response.json();
}

async function waitForWebServer() {
  return retry(fetchStatusPage, {
    retries: 100,
    minTimeout: 300, // 300ms entre tentativas
  });
}

async function waitForAllServices() {
  await waitForWebServer();
}

export default {
  waitForAllServices,
};

*/
