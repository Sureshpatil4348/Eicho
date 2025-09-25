import IO, { Socket } from 'socket.io-client';
import {
    socketConnected,
    socketDisconnected,
    socketError,
} from './socketActions';
import store from '@renderer/services/store';
import { getCookie } from '@renderer/utils/cookies';

const API_URI = `http://20.83.157.24:8000`;
let socket: any | null = null;

async function SocketConnect(userData: Record<string, unknown> | null = null): Promise<void> {
    const token = getCookie('auth-token')

    socket = IO(API_URI, {
        forceNew: true,
        auth: userData || undefined,
        extraHeaders: {
            authorization: `Bearer ${token}`,
        },
    });

    socket.on('connect', () => {
        console.log('socket connected');
        store.dispatch(socketConnected());
    });

    socket.on('error', (error: unknown) => {
        console.log('socket error', error);
        store.dispatch(socketError(error));
    });

    socket.on('connect_timeout', (timeout: unknown) => {
        console.log('socket connect_timeout', timeout);
        store.dispatch(socketError(timeout));
    });

    socket.on('disconnect', (reason: Socket.DisconnectReason) => {
        console.log('socket disconnect', reason);
        store.dispatch(socketDisconnected(reason));
    });
}

async function SocketDisconnect(): Promise<void> {
    if (socket) {
        socket.disconnect();
        console.log('Socket disconnected manually');
    }
}

export default {
    SocketConnect,
    SocketDisconnect,
    socket,
};

export { SocketConnect, SocketDisconnect, socket };
