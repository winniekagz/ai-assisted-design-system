import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { InputOTP, InputOTPGroup, InputOTPSlot } from './input-otp';

afterEach(() => cleanup());

function OTPSlots() {
  return (
    <InputOTPGroup>
      {Array.from({ length: 6 }, (_, index) => (
        <InputOTPSlot key={index} index={index} />
      ))}
    </InputOTPGroup>
  );
}

describe('InputOTP', () => {
  it('merges consumer aria-describedby with helper text', () => {
    render(
      <div>
        <p id='otp-format'>Use six digits.</p>
        <InputOTP
          id='login-code'
          label='Verification code'
          helperText='Code is required.'
          maxLength={6}
          aria-describedby='otp-format'
        >
          <OTPSlots />
        </InputOTP>
      </div>
    );

    const input = screen.getByLabelText('Verification code');

    expect(input).toHaveAttribute(
      'aria-describedby',
      'otp-format login-code-helper'
    );
    expect(screen.getByText('Code is required.')).toBeInTheDocument();
  });
});
