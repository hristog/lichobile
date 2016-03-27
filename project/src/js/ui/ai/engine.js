const maxMoveTime = 8000;
const maxSkill = 20;
const levelToDepth = {
  1: 1,
  2: 1,
  3: 2,
  4: 3,
  5: 5,
  6: 8,
  7: 13,
  8: 21
};

export default function(ctrl) {
  let level = 1;
  const bestmoveRegExp = /^bestmove (\w{4})/;

  return {
    init(cb) {
      window.Stockfish.init(function() {

        window.Stockfish.output(function(msg) {
          console.log(msg);
          const bestmoveRegExpMatch = msg.match(bestmoveRegExp);
          if (bestmoveRegExpMatch) {
            ctrl.onEngineSearch(bestmoveRegExpMatch[1]);
          }
        });

        setOption('Ponder', 'false');

        cb();
      });
    },

    search(fen) {
      window.Stockfish.cmd(`position fen ${fen}`);
      window.Stockfish.cmd(`go movetime ${moveTime(level)} depth ${depth(level)}`);
    },

    setLevel(l) {
      level = l;
      setOption('Skill Level', skill(level));
    },

    exit() {
      window.Stockfish.exit();
    }
  };
}

function setOption(name, value) {
  window.Stockfish.cmd(`setoption name ${name} value ${value}`);
}

function moveTime(level) {
  return level * maxMoveTime / 8;
}

function skill(level) {
  return Math.round((level - 1) * (maxSkill / 7));
}

function depth(level) {
  return levelToDepth[level];
}
