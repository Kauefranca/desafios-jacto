// Objeto com funções reutilizáveis;
module.exports = class Utils {
    constructor() {
        // Função para padronizar todos os erros retornados pela aplicação;
        this.buildError = (response, statusCode, message, path) => {
            return response
                .status(statusCode)
                .send({
                    timestamp: new Date(),
                    statusCode,
                    error: HTTP_ERRORS_CODE[statusCode] ? HTTP_ERRORS_CODE[statusCode] : '',
                    message,
                    path
                });
        };
    };
};

const HTTP_ERRORS_CODE = {
    400: 'Bad Request',
    500: 'Internal Server Error'
};