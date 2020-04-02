import React from 'react';

export function htmlInputEventExtractor(event: React.FormEvent<HTMLInputElement>) {
    return event.currentTarget.value;
}
