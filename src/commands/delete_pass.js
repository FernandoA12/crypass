const logSymbols = require('log-symbols');
const command = {
  name: 'delete:pass',
  description: 'Deletar a senha',
  run: async toolbox => {
    const {
      filesystem,
      parameters,
      print: { error, success, warning }
    } = toolbox;

    if(!parameters.first){
      error(`${logSymbols.error} Obrigatório a passagem de um ID`);
      return
    }

    let pathPasswords = `${filesystem.homedir()}/.crypass_passwords`;
    if (!filesystem.exists(pathPasswords)) {
      warning(`${logSymbols.warning} Não há senhas criadas`)
      return
    }

    let allPasswords = JSON.parse(filesystem.read(pathPasswords));

    if (allPasswords.length <= 0) {
      warning(`${logSymbols.warning} Não há senhas criadas`)
      return
    }

    filesystem.write(pathPasswords, allPasswords.filter((pass, key) => key+1 !== parameters.first))

    success(`${logSymbols.success} Senha deletada com sucesso!`);
  },
}

module.exports = command
