export function srsalgo({ repetitions, efactor, dueDate, pass }) {
  let quality = 0;
  let interval = dueDate - Date.now();

  console.log(interval);

  if (pass) {
    quality = 4;
  }

  efactor = Math.max(
    1.3,
    efactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02),
  );

  if (quality < 3) {
    repetitions = 0;
  } else {
    repetitions += 1;
  }

  if (repetitions <= 1) {
    interval = 1;
  } else if (repetitions == 2) {
    interval = 6;
  } else {
    interval = Math.round(interval * efactor);
  }

  const millisecondsInDay = 60 * 60 * 24 * 1000;
  const newDueDate = Date.now() + millisecondsInDay * interval;

  return {
    newDueDate: newDueDate,
    newEfactor: efactor,
    repetitions: repetitions,
  };
}
