const logSymbols = require('log-symbols');
const command = {
  name: 'list',
  description: 'Lista as senhas',
  run: async toolbox => {
    const {
      filesystem,
      print: { table, colors, warning }
    } = toolbox;

    let tableData = [
      [colors.cyan('#'), colors.cyan('Site'), colors.cyan('Passwords'), colors.cyan('Padrão'), colors.cyan('Nivel')]
    ]

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

    allPasswords.map(async (pass, key) => {
      tableData.push([key+1, pass.site, colors.success(pass.password), pass.padrao, pass.level])
    })
    table(
      tableData,
      { format: 'lean' }
    )
  },
}

module.exports = command
