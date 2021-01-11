const logSymbols = require('log-symbols');
const command = {
  name: 'create:pattern',
  description: 'Cria um novo padrão de senha.',
  run: async toolbox => {
    const { 
      parameters: { first },
      prompt,
      filesystem,
      services,
      print: { error, warning, success }
    } = toolbox;

    if (!first) {
      error(`${logSymbols.error} Obrigatório inserir o nome do padrão (crypass create:pattern "nome do padrão")`)
      return
    }

    const servicosOptions = [...Object.keys(services), 'Encerrar'];

    const servicosChoose = [];
    let response, contador = 1;
    do{
      response = await prompt.ask({
        type: 'select',
        name: 'pattern',
        message: `Selecione o ${contador}º serviço`,
        choices: servicosOptions,
      });
      if(response.pattern === 'Encerrar' && servicosChoose.length <= 0) {
        error(`${logSymbols.error} Obrigatório selecionar ao menos 1 serviço!`)
        warning(`${logSymbols.warning} Criação de padrão cancelada!`);
        return
      }
      if(response.pattern !== 'Encerrar') servicosChoose.push(response.pattern);
      contador++;
    }while(response.pattern != "Encerrar" && contador <= 4);

    success(`${logSymbols.success} Padrão criado com sucesso!`)

    //Pega caminho do arquivo de configuração do CRYPASS
    let fileConfigPath = `${filesystem.homedir()}/.crypass_patterns`;
    // Verifica existencia de JSON de configuração
    if(!filesystem.exists(fileConfigPath)){
      filesystem.write(fileConfigPath, {[first]: servicosChoose});
      return
    }      
    let patterns = JSON.parse(filesystem.read(fileConfigPath))
    filesystem.write(fileConfigPath, {...patterns, [first]: servicosChoose});
  },  
}

module.exports = command
