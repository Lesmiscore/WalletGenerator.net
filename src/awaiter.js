function invokeAwaits(generator, next) {
  const { value, done } = generator.next(next);
  if (done) {
    return;
  }
  value.then((a) => invokeAwaits(generator, next));
}
