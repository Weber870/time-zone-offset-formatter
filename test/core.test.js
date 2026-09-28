import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatOffset } from '../src/index.js';

describe('formatOffset', () => {
  it('formats a positive whole-hour offset', () => {
    assert.equal(formatOffset(480), '+08:00');
  });

  it('formats a negative whole-hour offset', () => {
    assert.equal(formatOffset(-300), '-05:00');
  });

  it('formats a positive offset with minutes', () => {
    assert.equal(formatOffset(330), '+05:30');
  });

  it('formats a negative offset with minutes', () => {
    assert.equal(formatOffset(-210), '-03:30');
  });

  it('renders zero as +00:00, not -00:00', () => {
    assert.equal(formatOffset(0), '+00:00');
  });

  it('pads single-digit hours and minutes', () => {
    assert.equal(formatOffset(60), '+01:00');
    assert.equal(formatOffset(1), '+00:01');
  });

  it('handles the maximum real-world IANA offset (+14:00)', () => {
    assert.equal(formatOffset(840), '+14:00');
  });

  it('handles the minimum real-world IANA offset (-12:00)', () => {
    assert.equal(formatOffset(-720), '-12:00');
  });

  it('supports offsets beyond 24 hours without truncation', () => {
    assert.equal(formatOffset(1500), '+25:00');
  });

  it('supports hour magnitudes of 100 or more by emitting more than two digits', () => {
    assert.equal(formatOffset(6000), '+100:00');
  });

  it('throws TypeError for non-number input', () => {
    assert.throws(() => formatOffset('480'), TypeError);
    assert.throws(() => formatOffset(null), TypeError);
    assert.throws(() => formatOffset(undefined), TypeError);
  });

  it('throws TypeError for non-finite numbers', () => {
    assert.throws(() => formatOffset(NaN), TypeError);
    assert.throws(() => formatOffset(Infinity), TypeError);
    assert.throws(() => formatOffset(-Infinity), TypeError);
  });

  it('throws TypeError for fractional minutes', () => {
    assert.throws(() => formatOffset(5.5), TypeError);
    assert.throws(() => formatOffset(-5.5), TypeError);
  });
});
