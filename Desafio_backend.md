# Desafio do BTG Pactual Digital 
Desenvolva um serviço web REST onde conterá 2 funcionalidades:

 1. Endpoint para autenticação do serviço;
	- Login pode ser feito em memoria; 
 2. Endpoint para geração do documento com os dados inputados pelo usuário e salvar no disco
	 - Dados: Nome Completo, Data de Nascimento, CPF, RG;
	 - Documento pode ser um arquivo formato .txt com os dados escritos no seguinte formato:

		Ex:
		Nome Completo: $Nome
		Data de Nascimento: $Data
		CPF: $CPF
		RG: $RG

		Usuario Autenticado
		Login: $Login
		IP: $IP

#### Pontos

 - Autenticação poderá ser feita a escolha do entrevistado (recomendamos
   o uso de JWT);
 - Verificar se o usuário tem uma sessão valida para gerar o documento;
 - Inclusão de testes unitários e importante;

Submeta o projeto ao github ou gitlab e nos envie o repositório para avaliarmos.
