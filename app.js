const RULES = [
  {
    label: '×2',
    fn: n => n * 2,
    pattern: 'The rule is to multiply by 2. Each output is double the input. The outputs skip count in twos — they go up by 2 each time, just like even numbers!'
  },
  {
    label: '×3',
    fn: n => n * 3,
    pattern: 'The rule is to multiply by 3. Each output is triple the input. The outputs go up by 3 each time — that\'s skip counting in threes!'
  },
  {
    label: '+2',
    fn: n => n + 2,
    pattern: 'The rule is to add 2. Each output is 2 more than the input. The outputs go up by 1 each time, just like the inputs do.'
  },
  {
    label: '+3',
    fn: n => n + 3,
    pattern: 'The rule is to add 3. Every output is 3 bigger than its matching input. The outputs go up by 1 each time as the inputs increase by 1.'
  },
  {
    label: '+5',
    fn: n => n + 5,
    pattern: 'The rule is to add 5. Each output is 5 more than the input. As the inputs count up by 1, the outputs also count up by 1 — just shifted 5 higher!'
  },
  {
    label: '+10',
    fn: n => n + 10,
    pattern: 'The rule is to add 10. Each output is 10 more than the input. You can think of it as moving one tens-place higher on the number line!'
  },
  {
    label: '−1',
    fn: n => n - 1,
    pattern: 'The rule is to subtract 1. Each output is 1 less than the input. The outputs count up by 1 each time, staying just one step behind the inputs.'
  },
];

let state = {};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomize() {
  const rule = RULES[randomInt(0, RULES.length - 1)];
  const start = randomInt(2, 6);
  const inputs = [start, start + 1, start + 2, start + 3];
  const outputs = inputs.map(rule.fn);
  state = { rule, inputs, outputs, answers: ['', '', '', ''] };
  render();
}

function reset() {
  state.answers = ['', '', '', ''];
  renderAnswers();
  document.getElementById('overall-status').textContent = '';
  document.getElementById('overall-status').className = 'overall-status';
  document.getElementById('pattern-section').hidden = true;
}

function render() {
  // IN boxes
  const inBoxes = document.getElementById('in-boxes');
  inBoxes.innerHTML = '';
  state.inputs.forEach(n => {
    const box = document.createElement('div');
    box.className = 'io-box in-box';
    box.textContent = n;
    inBoxes.appendChild(box);
  });

  // Rule label
  document.getElementById('machine-rule').textContent = state.rule.label;

  renderAnswers();

  document.getElementById('overall-status').textContent = '';
  document.getElementById('overall-status').className = 'overall-status';
  document.getElementById('pattern-section').hidden = true;
}

function renderAnswers() {
  const outBoxes = document.getElementById('out-boxes');
  outBoxes.innerHTML = '';
  const feedbackList = document.getElementById('feedback-list');
  feedbackList.innerHTML = '';

  state.inputs.forEach((_, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'out-wrapper';

    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'io-box out-input';
    input.placeholder = '?';
    input.value = state.answers[i];
    input.dataset.index = i;
    input.addEventListener('input', e => {
      state.answers[i] = e.target.value;
      checkLive(i);
    });
    wrapper.appendChild(input);
    outBoxes.appendChild(wrapper);

    const fb = document.createElement('div');
    fb.className = 'feedback-icon';
    fb.id = `fb-${i}`;
    if (state.answers[i] !== '') {
      const val = parseInt(state.answers[i], 10);
      if (val === state.outputs[i]) {
        fb.textContent = '✓';
        fb.classList.add('correct');
        input.classList.add('correct');
      } else {
        fb.textContent = '✗';
        fb.classList.add('wrong');
        input.classList.add('wrong');
      }
    }
    feedbackList.appendChild(fb);
  });
}

function checkLive(index) {
  const input = document.querySelector(`.out-input[data-index="${index}"]`);
  const fb = document.getElementById(`fb-${index}`);
  const raw = state.answers[index];
  const val = raw === '' ? NaN : parseInt(raw, 10);

  if (isNaN(val) || raw === '') {
    fb.textContent = '';
    fb.className = 'feedback-icon';
    input.classList.remove('correct', 'wrong');
    updateOverall();
    return;
  }

  if (val === state.outputs[index]) {
    fb.textContent = '✓';
    fb.className = 'feedback-icon correct';
    input.classList.add('correct');
    input.classList.remove('wrong');
  } else {
    fb.textContent = '✗';
    fb.className = 'feedback-icon wrong';
    input.classList.add('wrong');
    input.classList.remove('correct');
  }

  updateOverall();
}

function updateOverall() {
  const allFilled = state.answers.every(a => a !== '');
  const statusEl = document.getElementById('overall-status');

  if (!allFilled) {
    statusEl.textContent = '';
    statusEl.className = 'overall-status';
    return;
  }

  const allCorrect = state.answers.every((a, i) => parseInt(a, 10) === state.outputs[i]);

  if (allCorrect) {
    statusEl.textContent = '🎉 Well done! All outputs are correct!';
    statusEl.className = 'overall-status success';
    document.getElementById('pattern-section').hidden = false;
    document.getElementById('pattern-text').textContent = state.rule.pattern;
  } else {
    statusEl.textContent = 'Some answers need fixing — check the ✗ rows.';
    statusEl.className = 'overall-status error';
    document.getElementById('pattern-section').hidden = true;
  }
}

document.getElementById('hint-btn').addEventListener('click', () => {
  const section = document.getElementById('pattern-section');
  section.hidden = !section.hidden;
  if (!section.hidden) {
    document.getElementById('pattern-text').textContent = state.rule.pattern;
  }
});

document.getElementById('reset-btn').addEventListener('click', reset);
document.getElementById('randomize-btn').addEventListener('click', randomize);

randomize();
