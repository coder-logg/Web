import React from 'react';

import { Query } from '../../models/query';

import './Area.css';
import { backendApiUserNotifyWrapper } from "../../utils/backendApiUserNotifyWrapper";
import { authorizedBackendApi } from "../../utils/backendApi";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const CANVAS_STEP_X = CANVAS_WIDTH / 2 / 5;
const CANVAS_STEP_Y = CANVAS_HEIGHT / 2 / 5;

const CANVAS_COLOR_PRIMARY = '#090909';
const CANVAS_COLOR_SECONDARY = '#C0C0C0';
const CANVAS_COLOR_BACKGROUND = '#F9F9F9';
const CANVAS_COLOR_SHADOW = 'rgba(0, 0, 0, 0.5)';
const CANVAS_COLOR_AREA = '#007AD9';
const CANVAS_COLOR_POINT_OTHER = '#333333';
const CANVAS_COLOR_POINT_INCLUDES = '#00ff00';
const CANVAS_COLOR_POINT_NOT_INCLUDES = '#ff0000';

export interface AreaProps {

    locked: boolean;

    width?: number | string;
    height?: number | string;

    formPoint: {
        x?: number;
        y?: number;
    };

    r?: number;
    history: Query[];
    session?: string;

    submitQuery(x: number, y: number): void;
}

interface AreaState {

    anotherR: {[key: string]: {[key: string]: boolean}}

    mouse?: {
        x: number;
        y: number;
        hover: boolean;
    };
}

export class Area extends React.Component<AreaProps, AreaState> {

    static defaultProps = {
        width: 400,
        height: 400
    };

    state: AreaState = { anotherR: {} };

    canvas: React.RefObject<HTMLCanvasElement>;

    canvasScale = 1;
    canvasTranslate = { x: 0, y: 0 };

    constructor(props: AreaProps) {
        super(props);

        this.canvas = React.createRef<HTMLCanvasElement>();
    }

    public repaint() {
        const { r, history, formPoint } = this.props;
        const { anotherR, mouse } = this.state;

        const canvas = this.canvas.current;
        if (!canvas) {
            return;
        }

        const context = canvas.getContext('2d')!;

        const actualCanvasSize = {
            width: parseInt(getCurrentStyle(canvas, 'width'), 10),
            height: parseInt(getCurrentStyle(canvas, 'height'), 10)
        };

        // Init canvas
        context.globalAlpha = 1;
        context.resetTransform();
        context.clearRect(0, 0, canvas.width, canvas.height);

        const canvasScale = this.canvasScale = Math.min(
            actualCanvasSize.width / CANVAS_WIDTH,
            actualCanvasSize.height / CANVAS_HEIGHT
        );

        context.scale(canvasScale, canvasScale);

        const canvasTranslate = this.canvasTranslate = {
            x: (actualCanvasSize.width / canvasScale - CANVAS_WIDTH) / 2,
            y: (actualCanvasSize.height / canvasScale - CANVAS_HEIGHT) / 2
        };

        context.translate(canvasTranslate.x, canvasTranslate.y);

        context.strokeStyle = CANVAS_COLOR_PRIMARY;
        context.fillStyle = CANVAS_COLOR_BACKGROUND;
        context.font = `bold ${CANVAS_STEP_X / 3}px 'Courier New', monospace`;
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Clip
        context.beginPath();
        context.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.clip();

        // Area
        if (r !== undefined) {
            const halfR = +r / 2;

            context.fillStyle = CANVAS_COLOR_AREA;

            context.beginPath();
            context.moveTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            context.lineTo(CANVAS_WIDTH / 2 - CANVAS_STEP_X * r, CANVAS_HEIGHT / 2);
            context.lineTo(CANVAS_WIDTH / 2 - CANVAS_STEP_X * r, CANVAS_HEIGHT / 2 - CANVAS_STEP_Y * r);
            context.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - CANVAS_STEP_Y * r);
            context.arcTo(CANVAS_WIDTH / 2 + CANVAS_STEP_X * r, CANVAS_HEIGHT / 2 - CANVAS_STEP_Y * r,
                CANVAS_WIDTH / 2 + CANVAS_STEP_X * r, CANVAS_HEIGHT / 2,
                Math.abs((CANVAS_STEP_X + CANVAS_STEP_Y) / 2 * r));
            context.lineTo(CANVAS_WIDTH / 2 + CANVAS_STEP_X * halfR, CANVAS_HEIGHT / 2);
            context.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + CANVAS_STEP_Y * halfR);
            context.fill();

            context.fillStyle = CANVAS_COLOR_BACKGROUND;
        }

        // Grid
        context.strokeStyle = CANVAS_COLOR_SECONDARY;

        context.beginPath();
        for (let i = 1; i < 7 * 2; ++i) {
            context.moveTo(CANVAS_STEP_X / 4, i * CANVAS_STEP_Y);
            context.lineTo(CANVAS_WIDTH - CANVAS_STEP_X / 4, i * CANVAS_STEP_Y);

            context.moveTo(i * CANVAS_STEP_X,CANVAS_STEP_Y / 4);
            context.lineTo(i * CANVAS_STEP_X, CANVAS_HEIGHT - CANVAS_STEP_Y / 4);
        }
        context.stroke();
        context.strokeStyle = CANVAS_COLOR_PRIMARY;

        // Axises
        context.lineWidth = 2;

        context.beginPath();
        context.moveTo(CANVAS_STEP_X / 2, CANVAS_HEIGHT / 2);
        context.lineTo(CANVAS_WIDTH - CANVAS_STEP_X / 2, CANVAS_HEIGHT / 2);
        context.moveTo(CANVAS_WIDTH - CANVAS_STEP_X, CANVAS_HEIGHT / 2 - CANVAS_STEP_Y / 4);
        context.lineTo(CANVAS_WIDTH - CANVAS_STEP_X / 2, CANVAS_HEIGHT / 2);
        context.lineTo(CANVAS_WIDTH - CANVAS_STEP_X, CANVAS_HEIGHT / 2 + CANVAS_STEP_Y / 4);

        context.moveTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT - CANVAS_STEP_Y / 2);
        context.lineTo(CANVAS_WIDTH / 2, CANVAS_STEP_X / 2);
        context.moveTo(CANVAS_WIDTH / 2 - CANVAS_STEP_X / 4, CANVAS_STEP_Y);
        context.lineTo(CANVAS_WIDTH / 2, CANVAS_STEP_Y / 2);
        context.lineTo(CANVAS_WIDTH / 2 + CANVAS_STEP_X / 4, CANVAS_STEP_Y);
        context.stroke();

        context.lineWidth = 1;

        // Shadow
        context.fillStyle = CANVAS_COLOR_SHADOW;

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(CANVAS_WIDTH, 0);
        context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
        context.lineTo(0, CANVAS_HEIGHT);
        context.closePath();

        context.moveTo(CANVAS_WIDTH / 2 - CANVAS_STEP_X * 3, CANVAS_HEIGHT / 2 - CANVAS_STEP_Y * 3);
        context.lineTo(CANVAS_WIDTH / 2 + CANVAS_STEP_X * 3, CANVAS_HEIGHT / 2 - CANVAS_STEP_Y * 3);
        context.lineTo(CANVAS_WIDTH / 2 + CANVAS_STEP_X * 3, CANVAS_HEIGHT / 2 + CANVAS_STEP_Y * 3);
        context.lineTo(CANVAS_WIDTH / 2 - CANVAS_STEP_X * 3, CANVAS_HEIGHT / 2 + CANVAS_STEP_Y * 3);
        context.closePath();

        context.fill('evenodd');

        context.fillStyle = CANVAS_COLOR_BACKGROUND;

        // History
        context.lineWidth = 0.5;

        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;
        history.forEach((point) => {
            // context.globalAlpha = 1 - Math.min(point.r !== +r ? Math.abs(+r - +point.r) / 3 : 0, 0.9);

            if (r !== undefined && point.r === +r) {
                context.fillStyle = point.result
                    ? CANVAS_COLOR_POINT_INCLUDES
                    : CANVAS_COLOR_POINT_NOT_INCLUDES
                ;
            } else {
                switch (anotherR[point.x] && anotherR[point.x][point.y]) {
                    case true:
                        context.fillStyle = CANVAS_COLOR_POINT_INCLUDES;
                        break;

                    case false:
                        context.fillStyle = CANVAS_COLOR_POINT_NOT_INCLUDES;
                        break;

                    default:
                        context.fillStyle = CANVAS_COLOR_POINT_OTHER;
                }
            }

            context.beginPath();
            context.arc(
                centerX + point.x * CANVAS_STEP_X,
                centerY - point.y * CANVAS_STEP_Y,
                3, 0, Math.PI * 2
            );
            context.fill();
            context.stroke();
        });

        context.globalAlpha = 1;
        context.fillStyle = CANVAS_COLOR_BACKGROUND;

        // Form point position

        if (formPoint.x) {
            context.beginPath();
            context.moveTo(CANVAS_WIDTH / 2 + +formPoint.x * CANVAS_STEP_X, CANVAS_HEIGHT);
            context.lineTo(CANVAS_WIDTH / 2 + +formPoint.x * CANVAS_STEP_X, 0);
            context.stroke();
        }

        if (formPoint.y) {
            context.beginPath();
            context.moveTo(0, CANVAS_HEIGHT / 2 - +formPoint.y * CANVAS_STEP_Y);
            context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2 - +formPoint.y * CANVAS_STEP_Y);
            context.stroke();
        }

        context.fillStyle = CANVAS_COLOR_BACKGROUND;

        // Mouse position
        if (mouse && mouse.hover) {
            const mouseXLabelText = `X: ${+mouse.x.toFixed(5)}`;
            const mouseYLabelText = `Y: ${+mouse.y.toFixed(5)}`;

            const mouseLabelsWidth = Math.max(
                context.measureText(mouseXLabelText).width,
                context.measureText(mouseYLabelText).width
            );

            const mouseRightSide = Math.max(
                Math.floor((CANVAS_STEP_X * 1.5 + mouseLabelsWidth) / CANVAS_STEP_X * 2) * CANVAS_STEP_X / 2,
                CANVAS_STEP_X * 2.5
            );

            context.beginPath();
            context.moveTo(CANVAS_STEP_X / 2, CANVAS_STEP_Y * 0.5);
            context.lineTo(mouseRightSide, CANVAS_STEP_Y * 0.5);
            context.lineTo(mouseRightSide, CANVAS_STEP_Y * 1.5);
            context.lineTo(CANVAS_STEP_X / 2, CANVAS_STEP_Y * 1.5);
            context.lineTo(CANVAS_STEP_X / 2, CANVAS_STEP_Y * 0.5);
            context.fill();
            context.stroke();

            context.fillStyle = CANVAS_COLOR_PRIMARY;
            context.fillText(mouseXLabelText, CANVAS_STEP_X * 0.75, whereMeDrawText(context, CANVAS_STEP_Y * 0.7));
            context.fillText(mouseYLabelText, CANVAS_STEP_X * 0.75, whereMeDrawText(context, CANVAS_STEP_Y));
            context.fillStyle = CANVAS_COLOR_BACKGROUND;
        }
    }

    componentDidMount(): void {
        this.repaint();
    }

    componentDidUpdate(prevProps: Readonly<AreaProps>, prevState: Readonly<AreaState>, snapshot?: any): void {
        const { session, r } = this.props;

        if (prevProps.r !== r) {
            this.setState({ ...this.state, anotherR: {} });

            if (r !== undefined && session) {
                let start: any = undefined;

                let prevPromise = new Promise(resolve => start = resolve);
                this.props.history.filter(q => q.r != r).forEach(query => {
                    const currentPromise = prevPromise;

                    prevPromise = (async () => {
                        const response = await backendApiUserNotifyWrapper(
                            authorizedBackendApi(`areaCheck/r/${r}/x/${query.x}/y/${query.y}`, session)
                        );

                        if (response.ok && this.props.r === r) {
                            await currentPromise;

                            this.setState({
                                ...this.state,

                                anotherR: {
                                    ...this.state.anotherR,

                                    [query.x]: {
                                        ...this.state.anotherR[query.x],

                                        [query.y]: await response.json()
                                    }
                                }
                            });
                        }
                    })();
                });

                if (start) {
                    start();
                }
            }
        }

        this.repaint();
    }

    private onClick() {
        const { locked, submitQuery } = this.props;
        const { mouse } = this.state;

        if (!locked && mouse) {
            submitQuery(mouse.x, mouse.y);
        }
    }

    private onMouseMove(event: React.MouseEvent) {
        const canvas = this.canvas.current;

        if (!canvas) {
            return;
        }

        const offsetLeft = parseInt(getCurrentStyle(canvas, 'border-left-width'), 10);
        const offsetTop = parseInt(getCurrentStyle(canvas, 'border-top-width'), 10);

        const rect = canvas.getBoundingClientRect();
        const x = Math.ceil(event.clientX - rect.left - offsetLeft) / this.canvasScale - this.canvasTranslate.x;
        const y = (event.clientY - rect.top - offsetTop) / this.canvasScale - this.canvasTranslate.y;

        if (x < 0 || x >= CANVAS_WIDTH || y < 0 || y >= CANVAS_HEIGHT) {
            return;
        }

        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;

        this.setState({
            ...this.state,

            mouse: {
                x: (x - centerX) / CANVAS_STEP_X,
                y: (centerY - y) / CANVAS_STEP_Y,
                hover: true
            }
        });
    }

    private onMouseLeave() {
        const { mouse } = this.state;

        if (mouse) {
            this.setState({ ...this.state, mouse: { ...mouse, hover: false } });
        }
    }

    render() {
        const { width, height } = this.props;

        return (
            <canvas ref={this.canvas} className="area" width={width} height={height} onClick={this.onClick.bind(this)}
                    onMouseMove={this.onMouseMove.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)} />
        );
    }
}

function getCurrentStyle(element: HTMLElement, style: string) {
    try {
        return window.getComputedStyle(element, null).getPropertyValue(style);
    } catch (e) {
        return (element as { currentStyle?: { [key: string]: string } }).currentStyle![style];
    }
}

function whereMeDrawText(context: CanvasRenderingContext2D, topY: number, height: number = CANVAS_STEP_Y / 3) {
    return (height + context.measureText('M').width) / 2 + topY;
}
