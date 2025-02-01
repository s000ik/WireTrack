interface ProcessParameters {
    uts: number;
    elongation: number;
    conductivity: number;
}

// Base values and ranges from existing data
export const baseValues = {
    uts: 11.0,         // Base ~10.0 MPa
    elongation: 12.0,  // Base ~18.0%
    conductivity: 61.3 // Base ~61.3 S/m
};

const ranges = {
    uts: { min: 10.5, max: 11.8 },        // ±0.5 range
    elongation: { min: 10.0, max: 14.0 }, // Wider range observed
    conductivity: { min: 61.0, max: 61.6 } // Tight range
};

// Add random walk with bounds checking
function randomWalk(current: number, range: { min: number; max: number }, step: number = 0.1): number {
    const delta = (Math.random() - 0.5) * step;
    const next = current + delta;
    // Round to 2 decimal places
    const rounded = Math.round(next * 100) / 100;

    if (rounded < range.min) return Math.round((current + Math.abs(delta)) * 100) / 100;
    if (rounded > range.max) return Math.round((current - Math.abs(delta)) * 100) / 100;
    return rounded;
}

// Generate data with realistic variations
export function generateProcessData(previous?: ProcessParameters): ProcessParameters {
    const current = previous || baseValues;

    return {
        uts: randomWalk(current.uts, ranges.uts, 0.1),         // 2 decimals for UTS
        elongation: randomWalk(current.elongation, ranges.elongation, 0.2),   // 2 decimals for elongation
        conductivity: randomWalk(current.conductivity, ranges.conductivity, 0.05)  // 2 decimals for conductivity
    };
}