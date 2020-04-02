import React from 'react';

import { Query } from '../../models/query';

import './HistoryTable.css';

export interface HistoryTableProps {

    history: Query[];
}

export class HistoryTable extends React.Component<HistoryTableProps> {

    render() {
        const { history } = this.props;

        return (
            <div>
                <table className="history-table">
                    <thead>
                    <tr>
                        <th>X</th>
                        <th>Y</th>
                        <th>R</th>
                        <th>Result</th>
                        <th style={{whiteSpace: 'nowrap'}}>Creating time</th>
                        <th style={{whiteSpace: 'nowrap'}}>Elapsed time</th>
                    </tr>
                    </thead>

                    <tbody>
                    {[...history].reverse().map((query, i) => (
                        <tr key={i}>
                            <td>{query.x}</td>
                            <td>{query.y}</td>
                            <td style={{whiteSpace: 'nowrap'}}>{query.r}</td>
                            <td>point&nbsp;is {query.result ? '' : (<>not&nbsp;</>)}included</td>
                            <td>{query.created.toLocaleString()}</td>
                            <td style={{whiteSpace: 'nowrap'}}>{query.elapsed} sec</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
