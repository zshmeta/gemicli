import Spinnit from 'spinnit';

// Using the Spinnit function to create the desired effect

const runSpinners = async () => {
  // Run equation spinner
  const equationSpinner = Spinnit({ spinner: 'equation', speed: 200, duration: 200 });
  equationSpinner.start();
  setTimeout(() => {
    equationSpinner.stop(true);
    console.log('Equation Spinner Complete');
  }, equationSpinner.duration);

  // Run loading text spinner
  const loadingTextSpinner = Spinnit({ spinner: 'yingyang', speed: 100, text: 'Processing wait a second ...' });
  await loadingTextSpinner.start();

  // Run loading bar spinner
  const loadingBarSpinner = Spinnit({ spinner: 'loadingbar', steps: 20, speed: 330 });
  await loadingBarSpinner.start();
};

runSpinners();

