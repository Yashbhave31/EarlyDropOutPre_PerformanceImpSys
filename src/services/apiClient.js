const SIMULATED_LATENCY_MS = 200;

export async function mockApiCall(dataSupplier) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dataSupplier());
    }, SIMULATED_LATENCY_MS);
  });
}

export const API_CONFIG = {
  isMockMode: true,
  baseURL: "http://localhost:8080/api/v1",
  version: "1.0.0-TYIT-SYNOP"
};
