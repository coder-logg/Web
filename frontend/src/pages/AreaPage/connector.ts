import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { RootState } from '../../reducer';
import { AreaPageProps } from './AreaPage';
import { lockAndDo } from '../../utils/lockAndDo';
import { authorizedBackendApi } from '../../utils/backendApi';
import { backendApiUserNotifyWrapper } from '../../utils/backendApiUserNotifyWrapper';
import { signOut } from '../../store/application/actions';
import { parseQuery, Query } from "../../models/query";

type StateProps = Pick<AreaPageProps, 'session'>;

function mapStateToProps(state: RootState): StateProps {
    return { session: state.application.session };
}

type DispatchProps = Pick<AreaPageProps, 'onSubmitQuery' | 'signOut'>;

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return {
        onSubmitQuery(x: number, y: number, r: number, session: string, addPoint: (query: Query) => void): void {
            lockAndDo(dispatch, async () => {
                const response = await backendApiUserNotifyWrapper(
                    authorizedBackendApi('areaCheck', session, 'POST', { x, y, r })
                );

                if (response.ok) {
                    addPoint(parseQuery(await response.json()));
                }
            })
        },

        signOut(): void {
            dispatch(signOut());
        }
    }
}

export const areaPageConnect = connect(mapStateToProps, mapDispatchToProps);
