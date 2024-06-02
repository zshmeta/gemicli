import Termynal from './utils/termEffect'


const term = new Termynal('#termynal', {
    typeDelay: 40,
    lineDelay: 700,
    lineData: [
      { type: 'input', prompt: '▲', value: 'npm uninstall react' },
      { value: 'Are you sure you want to uninstall \'react\'?' },
      { type: 'input',  typeDelay: 1000, prompt: '(y/n)', value: 'y' },
      { type: 'progress', progressChar: '·' },
      { value: 'Uninstalled \'react\'' },
      { type: 'input', prompt:'▲', value: 'node' },
      { type: 'input', prompt: '>', value: `Array(5).fill('🦄 ')` },
      { value: `['🦄', '🦄', '🦄', '🦄', '🦄']` },
      { type: 'input', prompt: '▲', value: 'cd ~/repos' },
      { type: 'input', prompt: '▲ ~/repos', value: ' git checkout branch master' },
      { type: 'input', prompt: '▲ ~/repos (master)', value: 'git commit -m \'Fix things\'' },
    ]
  });

  term.start();