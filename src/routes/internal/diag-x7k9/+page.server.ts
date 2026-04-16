import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

type TestResult = {
	name: string;
	status: 'ok' | 'fail';
	latencyMs: number;
	result?: string;
	error?: string;
};

type TestRun = {
	id: string;
	tests: TestResult[];
	allPassed: boolean;
	avgLatency: number;
	timestamp: string;
};

// In-memory store for last 5 test runs (RAM only, cleared on server restart)
const recentRuns: TestRun[] = [];
const MAX_RUNS = 5;

function generateId(): string {
	return Math.random().toString(36).substring(2, 10);
}

async function runDiagnostics(): Promise<TestRun> {
	const tests: TestResult[] = [];

	// Test 1: Basic connectivity
	try {
		const start = performance.now();
		await db.run(sql`SELECT 1 AS ping`);
		const latency = performance.now() - start;
		tests.push({
			name: 'Basic Connectivity (SELECT 1)',
			status: 'ok',
			latencyMs: Math.round(latency * 100) / 100,
			result: 'Connection successful'
		});
	} catch (err: unknown) {
		tests.push({
			name: 'Basic Connectivity (SELECT 1)',
			status: 'fail',
			latencyMs: 0,
			error: err instanceof Error ? err.message : String(err)
		});
	}

	// Test 2: SQLite version
	try {
		const start = performance.now();
		const row = await db.get<{ version: string }>(sql`SELECT sqlite_version() AS version`);
		const latency = performance.now() - start;
		tests.push({
			name: 'SQLite Version',
			status: 'ok',
			latencyMs: Math.round(latency * 100) / 100,
			result: row?.version ?? 'unknown'
		});
	} catch (err: unknown) {
		tests.push({
			name: 'SQLite Version',
			status: 'fail',
			latencyMs: 0,
			error: err instanceof Error ? err.message : String(err)
		});
	}

	// Test 3: Table count
	try {
		const start = performance.now();
		const row = await db.get<{ count: number }>(
			sql`SELECT COUNT(*) AS count FROM sqlite_master WHERE type='table'`
		);
		const latency = performance.now() - start;
		tests.push({
			name: 'Table Count',
			status: 'ok',
			latencyMs: Math.round(latency * 100) / 100,
			result: `${row?.count ?? 0} tables found`
		});
	} catch (err: unknown) {
		tests.push({
			name: 'Table Count',
			status: 'fail',
			latencyMs: 0,
			error: err instanceof Error ? err.message : String(err)
		});
	}

	// Test 4: Write/Read/Delete round-trip
	try {
		const start = performance.now();
		await db.run(sql`CREATE TABLE IF NOT EXISTS _diag_test (id INTEGER PRIMARY KEY, val TEXT)`);
		await db.run(sql`INSERT INTO _diag_test (id, val) VALUES (1, 'ping')`);
		const row = await db.get<{ val: string }>(sql`SELECT val FROM _diag_test WHERE id = 1`);
		await db.run(sql`DROP TABLE IF EXISTS _diag_test`);
		const latency = performance.now() - start;
		tests.push({
			name: 'Write/Read/Delete Round-Trip',
			status: row?.val === 'ping' ? 'ok' : 'fail',
			latencyMs: Math.round(latency * 100) / 100,
			result: row?.val === 'ping' ? 'Round-trip verified' : 'Data mismatch'
		});
	} catch (err: unknown) {
		await db.run(sql`DROP TABLE IF EXISTS _diag_test`).catch(() => {});
		tests.push({
			name: 'Write/Read/Delete Round-Trip',
			status: 'fail',
			latencyMs: 0,
			error: err instanceof Error ? err.message : String(err)
		});
	}

	const allPassed = tests.every((t) => t.status === 'ok');
	const avgLatency =
		tests.length > 0
			? Math.round((tests.reduce((sum, t) => sum + t.latencyMs, 0) / tests.length) * 100) / 100
			: 0;

	const run: TestRun = {
		id: generateId(),
		tests,
		allPassed,
		avgLatency,
		timestamp: new Date().toISOString()
	};

	// Store in memory, keep only last 5
	recentRuns.unshift(run);
	if (recentRuns.length > MAX_RUNS) {
		recentRuns.length = MAX_RUNS;
	}

	return run;
}

export const load: PageServerLoad = async () => {
	return {
		recentRuns: structuredClone(recentRuns),
		currentRun: null as TestRun | null
	};
};

export const actions: Actions = {
	default: async () => {
		const run = await runDiagnostics();
		return {
			currentRun: run,
			recentRuns: structuredClone(recentRuns)
		};
	}
};
