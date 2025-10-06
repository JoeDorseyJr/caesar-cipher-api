#!/usr/bin/env bun

/**
 * Performance benchmark suite for Caesar Cipher API
 * Tests NFR-001, NFR-002, and CC-HEALTH-002
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const CONCURRENCY = 50;
const PAYLOAD_1KB = 'A'.repeat(1000);

interface BenchmarkResult {
  endpoint: string;
  requests: number;
  avgLatency: number;
  p95Latency: number;
  maxLatency: number;
  errors: number;
  passed: boolean;
}

async function measureRequest(url: string, options: RequestInit): Promise<number> {
  const start = performance.now();
  const response = await fetch(url, options);
  const end = performance.now();
  
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  
  return end - start;
}

async function benchmarkEndpoint(
  name: string,
  url: string,
  options: RequestInit,
  threshold: number,
  concurrency: number = CONCURRENCY
): Promise<BenchmarkResult> {
  console.log(`\nBenchmarking ${name}...`);
  
  const latencies: number[] = [];
  let errors = 0;
  
  // Run concurrent requests
  const promises = Array.from({ length: concurrency }, async () => {
    try {
      const latency = await measureRequest(url, options);
      latencies.push(latency);
    } catch (error) {
      errors++;
    }
  });
  
  await Promise.all(promises);
  
  // Calculate statistics
  latencies.sort((a, b) => a - b);
  const avgLatency = latencies.reduce((sum, l) => sum + l, 0) / latencies.length;
  const p95Index = Math.floor(latencies.length * 0.95);
  const p95Latency = latencies[p95Index] || 0;
  const maxLatency = latencies[latencies.length - 1] || 0;
  
  const passed = avgLatency < threshold && errors === 0;
  
  console.log(`  Requests: ${concurrency}`);
  console.log(`  Avg latency: ${avgLatency.toFixed(2)}ms (threshold: ${threshold}ms)`);
  console.log(`  P95 latency: ${p95Latency.toFixed(2)}ms`);
  console.log(`  Max latency: ${maxLatency.toFixed(2)}ms`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  
  return {
    endpoint: name,
    requests: concurrency,
    avgLatency,
    p95Latency,
    maxLatency,
    errors,
    passed,
  };
}

async function runBenchmarks() {
  console.log('='.repeat(60));
  console.log('Caesar Cipher API Performance Benchmark Suite');
  console.log('='.repeat(60));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Concurrency: ${CONCURRENCY}`);
  
  const results: BenchmarkResult[] = [];
  
  // CC-HEALTH-002: /health should respond within 50ms
  results.push(
    await benchmarkEndpoint(
      'GET /health (CC-HEALTH-002)',
      `${BASE_URL}/health`,
      { method: 'GET' },
      50
    )
  );
  
  // NFR-001: Cipher endpoints <100ms for 1KB payloads
  results.push(
    await benchmarkEndpoint(
      'POST /encrypt (NFR-001)',
      `${BASE_URL}/encrypt`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: PAYLOAD_1KB, shift: 3 }),
      },
      100
    )
  );
  
  results.push(
    await benchmarkEndpoint(
      'POST /decrypt (NFR-001)',
      `${BASE_URL}/decrypt`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: PAYLOAD_1KB, shift: 3 }),
      },
      100
    )
  );
  
  results.push(
    await benchmarkEndpoint(
      'POST /encode (NFR-001)',
      `${BASE_URL}/encode`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: PAYLOAD_1KB }),
      },
      100
    )
  );
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  
  const allPassed = results.every(r => r.passed);
  const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);
  
  console.log(`Total endpoints tested: ${results.length}`);
  console.log(`Passed: ${results.filter(r => r.passed).length}`);
  console.log(`Failed: ${results.filter(r => !r.passed).length}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`\nOverall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  // NFR-002: Verify no errors with 50 concurrent requests
  if (totalErrors === 0) {
    console.log('✅ NFR-002: Service handled 50 concurrent requests without errors');
  } else {
    console.log('❌ NFR-002: Service encountered errors under concurrent load');
  }
  
  process.exit(allPassed ? 0 : 1);
}

// Run benchmarks
runBenchmarks().catch((error) => {
  console.error('Benchmark failed:', error);
  process.exit(1);
});
