import React from 'react';
import { compose } from 'redux';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';

import { Query } from '../../models/query';
import { htmlInputEventExtractor } from '../../utils/htmlInputEventExtractor';
import { customDispatcher } from '../../utils/customDispatcher';

import './AreaForm.css';

export interface AreaFormProps {

    locked: boolean;

    x?: number;
    y?: number;
    r?: number;

    dispatchX: (value?: number) => void;
    dispatchY: (value?: number) => void;
    dispatchR: (value?: number) => void;
    dispatchHistory: (history: Query[]) => void;

    submitQuery(x: number, y: number): void;
}

export class AreaForm extends React.Component<AreaFormProps> {

    private onCheck(event: React.FormEvent) {
        const { x, y, submitQuery } = this.props;

        if (x !== undefined && y !== undefined) {
            submitQuery(x, y);
        }

        event.preventDefault();
    }

    private static replacements: { [key: string]: string } = {
        'minus': '-',
        'zero': '0',
        'one': '1',
        'two': '2',
        'three': '3',
        'four': '4',
        'five': '5',
        'six': '6',
        'seven': '7',
        'eight': '8',
        'nine': '9',
        'point': '.',
        'dot': '.',
        'and': '.'
    };

    private static verifyNumberInput(value: string): string | undefined {
        value = value.trim();

        if (value.length === 0) {
            return;
        }

        for (const key in AreaForm.replacements) {
            value = value.toLowerCase().replace(new RegExp(key, 'g'), '' + AreaForm.replacements[key]);
        }

        value = value.split(' ').join('');

        const numeric = +value;
        if (isNaN(numeric)) {
            return;
        }

        return value;
    }

    private static validateNumberInput(value?: string): number | undefined {
        if (!value) {
            return;
        }

        const dotPosition = value.indexOf('.');
        if ((dotPosition >= 0 ? dotPosition : value.length) > 10) {
            return;
        }

        let preparedValue = value;
        if (dotPosition >= 0) {
            preparedValue = value.substring(0, Math.min(dotPosition + 11, value.length));
        }

        const numeric = +preparedValue;
        if (isNaN(numeric) || numeric <= -3 || numeric >= 3) {
            return;
        }

        return numeric;
    }

    render() {
        const { locked, x, y, r, dispatchX, dispatchY, dispatchR } = this.props;

        return (
            <Panel header="New query" className="area-form">
                <form onSubmit={this.onCheck.bind(this)}>
                    <div className="form-group max-width">
                        <label>X:&nbsp;</label>
                        <InputText data-invalid={x === undefined} placeholder="(-3, 3)" maxLength={13} disabled={locked} onChange=
                            {customDispatcher(htmlInputEventExtractor, dispatchX, compose(AreaForm.validateNumberInput, AreaForm.verifyNumberInput))} />
                    </div>

                    <div className="form-group max-width">
                        <label>Y:&nbsp;</label>
                        <InputText data-invalid={y === undefined} placeholder="(-3, 3)" maxLength={13} disabled={locked} onChange=
                            {customDispatcher(htmlInputEventExtractor, dispatchY, compose(AreaForm.validateNumberInput, AreaForm.verifyNumberInput))} />
                    </div>

                    <div className="form-group max-width">
                        <label>R:&nbsp;</label>
                        <InputText data-invalid={r === undefined} placeholder="(-3, 3)" maxLength={13} disabled={locked} onChange=
                            {customDispatcher(htmlInputEventExtractor, dispatchR, compose(AreaForm.validateNumberInput, AreaForm.verifyNumberInput))} />
                    </div>

                    <Button type="submit" disabled={x === undefined || y === undefined || r === undefined || locked} label="Check" />
                </form>
            </Panel>
        );
    }
}
