const millisecondsInDay = 60 * 60 * 24 * 1000;

function getInterval(repetitions, newEfactor, quality) {
  console.log(repetitions);

  if (repetitions <= 1) return 1;
  if (repetitions == 2) return 3; //original is 6, but I think 3 makes more sense

  return getInterval(repetitions - 1, newEfactor, quality) * newEfactor;
}

export function srsalgo({ repetitions, efactor, pass }) {
  let quality = 0;

  if (pass) {
    quality = 4;
  }

  if (quality < 3) {
    repetitions = 0;
  } else {
    repetitions += 1;
  }

  const newEfactor = Math.max(
    1.3,
    efactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02),
  );

  const interval = getInterval(repetitions, newEfactor, quality);

  const newDueDate = Date.now() + millisecondsInDay * interval;

  return {
    newDueDate,
    newEfactor,
    repetitions,
  };
}
