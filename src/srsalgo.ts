const millisecondsInDay = 60 * 60 * 24 * 1000;

function getDiffInDays(a, b) {
  // a and b are javascript Date objects
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.abs(Math.floor((utc2 - utc1) / millisecondsInDay));
}

export function srsalgo({ repetitions, efactor, dueDate, pass }) {
  let quality = 0;
  let interval = getDiffInDays(new Date(dueDate), new Date());

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
    interval = 3; //original is 6, but I think 3 makes more sense
  } else {
    interval = Math.round(interval * efactor);
  }

  let newDueDate = Date.now();

  if (quality > 3) {
    newDueDate = Date.now() + millisecondsInDay * interval;
  }

  return {
    newDueDate: newDueDate,
    newEfactor: efactor,
    repetitions: repetitions,
  };
}
