import React from 'react';
import { Panel } from "primereact/panel";

import { Page } from '../Page/Page';
import { parseQuery, Query } from '../../models/query';
import { Area } from '../../components/Area/Area';
import { AreaForm } from '../../components/AreaForm/AreaForm';
import { HistoryTable } from '../../components/HistoryTable/HistoryTable';
import { stateDispatcher } from '../../utils/stateDispatcher';
import { areaFormConnect } from '../../components/AreaForm/connector';
import { areaConnect } from '../../components/Area/connector';
import { forAuthorizedConnect } from '../../components/Guard/forAuthorizedConnect';
import { Guard } from '../../components/Guard/Guard';
import { authorizedBackendApi } from '../../utils/backendApi';
import { backendApiUserNotifyWrapper } from '../../utils/backendApiUserNotifyWrapper';
import { growl } from "../../index";

import './AreaPage.css';

const AreaContainer = areaConnect(Area);
const AreaFormContainer = areaFormConnect(AreaForm);
const ForAuthorizedGuard = forAuthorizedConnect(Guard);

export interface AreaPageProps {

    session?: string;

    onSubmitQuery(x: number, y: number, r: number, session: string, addPoint: (query: Query) => void): void;
    signOut(): void;
}

interface AreaPageState {

    formPoint: {
        x?: number;
        y?: number;
    }

    r?: number;
    history: Query[];
}

export class AreaPage extends Page<AreaPageProps, AreaPageState> {

    state: AreaPageState = {
        formPoint: {},
        history: []
    };

    componentDidMount(): void {
        setInterval(async () => {
            const { session } = this.props;

            if (!session) {
                return;
            }

            const response = await authorizedBackendApi('history', session);
            if (!response.ok) {
                if (response.status === 401) {
                    backendApiUserNotifyWrapper(Promise.resolve(response));
                }

                return;
            }

            const history: Query[] = (await response.json()).map(parseQuery);
            this.setState({ ...this.state, history });
        }, 1000);
    }

    private submitQuery(x: number, y: number) {
        const { session, onSubmitQuery } = this.props;
        const { r } = this.state;

        if (r === undefined) {
            growl.current?.show({
                severity: 'warn',
                summary: 'Area error',
                detail: 'Please, specify the R value in form to working with interactive image'
            });

            return;
        }

        if (session) {
            onSubmitQuery(x, y, r, session, query => {
                this.setState({ ...this.state, history: [...this.state.history, query] });
            });
        }
    }

    private dispatchFormPoint<T>(field: string, value: T) {
        this.setState({ ...this.state, formPoint: { ...this.state.formPoint, [field]: value } })
    }

    renderContent() {
        const { formPoint, r, history } = this.state;

        return (
            <ForAuthorizedGuard redirectUrl="/">
                <div className="area-page-main">
                    <div className="area-container">
                        <AreaContainer formPoint={formPoint} r={r} history={history}
                                       submitQuery={this.submitQuery.bind(this)} />
                    </div>

                    <div className="area-form-container">
                        <AreaFormContainer x={formPoint.x} y={formPoint.y} r={r}
                                           dispatchX={(x?: number) => this.dispatchFormPoint('x', x)}
                                           dispatchY={(y?: number) => this.dispatchFormPoint('y', y)}
                                           dispatchR={stateDispatcher(this, 'r')}
                                           dispatchHistory={stateDispatcher(this, 'history')}
                                           submitQuery={this.submitQuery.bind(this)} />
                    </div>
                </div>

                {history.length > 0 && (
                    <Panel header="History" className="history-panel">
                        <HistoryTable history={this.state.history}/>
                    </Panel>
                )}
            </ForAuthorizedGuard>
        );
    }
}
