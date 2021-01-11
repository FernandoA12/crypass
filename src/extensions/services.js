module.exports = toolbox => {
  const {
    filesystem,
    parameters
  } = toolbox;

  const indexLetter = letter => 'abcdefghijklmnopqrstuvwxyz'.indexOf(letter.toLowerCase()) + 1;

  toolbox.services = {
    KeyStart: () => {
      let fileConfigPath = `${filesystem.homedir()}/.crypass_config`;
      let config = JSON.parse(filesystem.read(fileConfigPath))
      return config.keyStart ? config.keyStart : "_"
    },
    PickFirst: pos => parameters.first.substr(0, pos),
    PickLast: pos => parameters.first.substr(parameters.first.length - pos, parameters.first.length),
    AlphaNumericMix: pos => {
      let { first } = parameters;
      let firstLetter = first.substr(0, pos);
      let lastLetter = first.substr(first.length - pos, first.length);
    
      return firstLetter.split('').map(letter => letter+indexLetter(letter)).join('') + lastLetter.split('').map(letter => letter+indexLetter(letter)).join('')
    },
    LetterPosition: () =>
      parameters.first
        .split('')
        .map(indexLetter)
        .join('')
    ,
    KeyEnd: () => {
      let fileConfigPath = `${filesystem.homedir()}/.crypass_config`;
      let config = JSON.parse(filesystem.read(fileConfigPath))
      return config.keyEnd ? config.keyEnd : "$"
    }
  }
}