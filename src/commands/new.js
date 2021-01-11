const logSymbols = require('log-symbols');
const command = {
  name: 'new',
  description: 'Cria uma nova senha.',
  run: async toolbox => {
    const {
      prompt,
      parameters,
      services,
      filesystem,
      print: { error, info, success, warning }
    } = toolbox;

    let pickPos = 1;

    if (!parameters.first) {
      error(`${logSymbols.error} Obrigatório inserir o nome do site (crypass create "nome do site")`)
      return
    }

    let fileConfigPath = `${filesystem.homedir()}/.crypass_patterns`;

    if(!filesystem.exists(fileConfigPath)){
      warning(`${logSymbols.warning} Não há padrões criados`)
      return
    }
    
    let padroes = JSON.parse(filesystem.read(fileConfigPath))

    if(Object.keys(padroes).length <= 0){
      warning(`${logSymbols.warning} Não há padrões criados`)
      return
    }
    const selectPadrao = {
      type: 'select',
      name: 'padrao',
      message: 'Qual padrão deseja usar?',
      choices: Object.keys(padroes),
    }
    var { padrao } = await prompt.ask(selectPadrao)

    const selectLevel = {
      type: 'select',
      name: 'level',
      message: 'Selecione o nivel da senha',
      choices: ['BASIC', 'COMPLEX']
    }
    var { level } = await prompt.ask(selectLevel);

    switch (level) {
      case 'COMPLEX': {
        pickPos = 3;
        break;
      }
      default: pickPos = 1
    }

    let password = padroes[padrao].map(service => services[service](pickPos)).join('');
    
    info(`${logSymbols.info} Senha criada e salva com sucesso:`);
    success(` ${password}`);
    
    let pathPasswords = `${filesystem.homedir()}/.crypass_passwords`;
    if(!filesystem.exists(pathPasswords)){
      filesystem.write(pathPasswords, [{ site: parameters.first, password, padrao, level }]);
      return
    }   
    let allPasswords = JSON.parse(filesystem.read(pathPasswords));
    filesystem.write(pathPasswords, [...allPasswords, { site: parameters.first, password, padrao, level }]);
    
  },
}

module.exports = command
