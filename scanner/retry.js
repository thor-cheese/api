/**
 * Execute a promise and retry with exponential backoff
 * based on the maximum retry attempts it can perform
 * @param {Promise} promise promise to be executed
 * @param {function} onRetry callback executed on every retry
 * @param {number} maxRetries The maximum number of retries to be attempted
 * @returns {Promise} The result of the given promise passed in
 */
function retry(promise, onRetry, maxRetries) {
  // Notice that we declare an inner function here
  // so we can encapsulate the retries and don't expose
  // it to the caller. This is also a recursive function
  async function retryWithBackoff(retries) {
    try {
      // Make sure we don't wait on the first attempt
      if (retries > 0) {
        // Here is where the magic happens.
        // on every retry, we exponentially increase the time to wait.
        // Here is how it looks for a `maxRetries` = 4
        // (2 ** 1) * 100 = 200 ms
        // (2 ** 2) * 100 = 400 ms
        // (2 ** 3) * 100 = 800 ms
        const timeToWait = 2 ** retries * 100;
        console.log(`waiting for ${timeToWait}ms... Max: ${maxRetries} Retry:${retries} `);
        await waitFor(timeToWait);
      }
      return await promise();
    } catch (e) {
      // only retry if we didn't reach the limit
      // otherwise, let the caller handle the error
      if (retries < maxRetries) {
        onRetry();

        return retryWithBackoff(retries + 1);
      } else {
        console.warn('Max retries reached. Bubbling the error up')
        throw e;
      }
    }
  }

  return retryWithBackoff(0);
}

/**
 * Wait for the given milliseconds
 * @param {number} milliseconds The given time to wait
 * @returns {Promise} A fulfiled promise after the given time has passed
 */
function waitFor(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

module.exports = {
  retry: retry

};
