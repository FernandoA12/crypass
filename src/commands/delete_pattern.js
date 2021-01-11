const logSymbols = require('log-symbols');
const command = {
  name: 'delete:pattern',
  description: 'Deletar um padrão',
  run: async toolbox => {
    const {
      filesystem,
      parameters,
      print: { error, success, warning }
    } = toolbox;

    if(!parameters.first){
      error(`${logSymbols.error} Obrigatório a passagem de um nome`);
      return
    }

    let pathPattern = `${filesystem.homedir()}/.crypass_patterns`;
    if (!filesystem.exists(pathPattern)) {
      warning(`${logSymbols.warning} Não há padrões criados`)
      return
    }

    let allPattern = JSON.parse(filesystem.read(pathPattern));

    if (allPattern.length <= 0) {
      warning(`${logSymbols.warning} Não há padrões criados`)
      return
    }
    if(!allPattern[parameters.first]){
      warning(`${logSymbols.warning} Não existe um padrãos com esse nome`)
      return
    }
    delete allPattern[parameters.first];
    filesystem.write(pathPattern, allPattern)

    success(`${logSymbols.success} Padrão deletado com sucesso!`);
  },
}

module.exports = command
