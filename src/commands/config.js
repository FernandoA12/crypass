const logSymbols = require('log-symbols');
const command = {
  name: 'config',
  description: 'Configura padrão de senha.',
  run: async toolbox => {
    const { 
      parameters: { options },
      filesystem,
      print: { error, info }
    } = toolbox;

    var optionValid = [
      'keyStart',
      'keyEnd'
    ]

    var optionInvalid = Object.keys(options).map(key => {
      if(!optionValid.includes(key)){
        return key
      }
    }).filter(key => !!key)
    
    // Se caso não for inserida nenhuma key:
    if(options.length <= 0){
      error(`${logSymbols.error} Obrigatório inserir pelo menos uma das opções válidas abaixo:`)
      info(`${logSymbols.warning} --keyStart + Caracter inicial. "--keyStart random" escolhe um caracter aleatório.\n${logSymbols.warning} --keyEnd + Caracter final. "--keyEnd random" escolhe um caracter aleatório.`)
      return
    }
    // Se caso houver uma opção inválida
    if(optionInvalid.length > 0){
      optionInvalid.map(key => error(`${logSymbols.error} Opção inválida: ${key}`))
      return
    }
    
    //Pega caminho do arquivo de configuração do CRYPASS
    let fileConfigPath = `${filesystem.homedir()}/.crypass_config`;
    // Verifica existencia de JSON de configuração
    if(!filesystem.exists(fileConfigPath)){
      filesystem.write(fileConfigPath, options);
      return
    }      
    let config = JSON.parse(filesystem.read(fileConfigPath))
    filesystem.write(fileConfigPath, {...config, ...options});
  },  
}

module.exports = command
