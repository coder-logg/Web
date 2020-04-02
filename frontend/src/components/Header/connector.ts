import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { HeaderProps } from './Header';
import { RootState } from '../../reducer';
import { signOut } from '../../store/application/actions';
import { lockAndDo } from '../../utils/lockAndDo';

type StateProps = Pick<HeaderProps, 'locked' | 'session'>;

function mapStateToProps(rootState: RootState): StateProps {
    return {
        locked: rootState.application.locked,
        session: rootState.application.session
    }
}

type DispatchProps = Pick<HeaderProps, 'onSignOut'>

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return {
        onSignOut() {
            lockAndDo(dispatch, () => {
                dispatch(signOut());
            });
        }
    }
}

export const headerConnect = connect(mapStateToProps, mapDispatchToProps);
