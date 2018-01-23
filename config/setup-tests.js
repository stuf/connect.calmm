import browserEnv from 'browser-env';
import { WebSocket } from 'mock-socket';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

browserEnv();

configure({ adapter: new Adapter() });

global.WebSocket = WebSocket;
